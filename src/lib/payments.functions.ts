import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import type { PaymentConfig, StartPaymentResult } from "@/lib/payments";

const UUID = /^[0-9a-f-]{36}$/i;

function orderInput(data: unknown): { order_id: string; guest_token: string } {
  const input = data as { order_id?: unknown; guest_token?: unknown } | undefined;
  const id = String(input?.order_id ?? "");
  if (!UUID.test(id)) throw new Error("Order not found.");
  return { order_id: id, guest_token: String(input?.guest_token ?? "").slice(0, 80) };
}

async function currentUserId(): Promise<string | null> {
  const header = getRequest()?.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  if (token.split(".").length !== 3) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.getUser(token);
  return data.user?.id ?? null;
}

type OrderRow = {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_token: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  total: number;
  payment_method: string;
  payment_status: string;
  business_id: string;
  businesses?: { business_name: string } | null;
};

/** Loads the order only if this browser/account actually placed it. */
async function loadOwnOrder(input: { order_id: string; guest_token: string }): Promise<OrderRow> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const userId = await currentUserId();
  const { data } = await supabaseAdmin
    .from("orders")
    .select(
      `id, order_number, customer_id, guest_token, customer_name, customer_phone, customer_email,
       total, payment_method, payment_status, business_id, businesses ( business_name )`,
    )
    .eq("id", input.order_id)
    .maybeSingle();
  if (!data) throw new Error("Order not found.");
  const row = data as unknown as OrderRow;
  const owns =
    (userId && row.customer_id === userId) ||
    (Boolean(input.guest_token) && row.guest_token === input.guest_token);
  if (!owns) throw new Error("Order not found.");
  return row;
}

/** Public gateway state. Never includes a secret. */
export const paymentConfig = createServerFn({ method: "GET" }).handler(
  async (): Promise<PaymentConfig> => {
    const { gatewayConfig } = await import("@/lib/payments.server");
    const config = gatewayConfig();
    return { configured: config.configured, provider: "cashfree", mode: config.mode, currency: "INR" };
  },
);

/**
 * Opens a payment attempt for the amount already stored (and server-priced) on
 * the order. Reuses a still-active Cashfree session so repeated taps on
 * "Pay" never create duplicate gateway orders.
 */
export const startPayment = createServerFn({ method: "POST" })
  .inputValidator(orderInput)
  .handler(async ({ data }): Promise<StartPaymentResult> => {
    const { createGatewayOrder, fetchGatewayOrder, gatewayConfig } = await import(
      "@/lib/payments.server"
    );
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const order = await loadOwnOrder(data);
    if (order.payment_status === "paid" || order.payment_status === "refunded") {
      return { status: "already_paid" };
    }
    if (order.payment_method === "pay_at_counter") {
      throw new Error("This order is set to be paid at the counter.");
    }

    const config = gatewayConfig();
    if (!config.configured) return { status: "not_configured" };
    const mode = config.mode === "production" ? "production" : "sandbox";

    const { data: existing } = await supabaseAdmin
      .from("payments")
      .select("provider, provider_order_id, payment_session_id")
      .eq("order_id", order.id)
      .maybeSingle();

    if (
      existing?.provider === "cashfree" &&
      existing.provider_order_id &&
      existing.payment_session_id
    ) {
      const current = await fetchGatewayOrder(existing.provider_order_id);
      if (current?.order_status === "ACTIVE") {
        return {
          status: "ready",
          provider: "cashfree",
          mode,
          payment_session_id: existing.payment_session_id,
          provider_order_id: existing.provider_order_id,
          order_number: order.order_number,
        };
      }
    }

    const req = getRequest();
    const reqUrl = new URL(req.url);
    const host = req.headers.get("x-forwarded-host") ?? reqUrl.host;
    const proto = req.headers.get("x-forwarded-proto") ?? reqUrl.protocol.replace(":", "");
    // Cashfree only accepts https callback URLs; local dev skips them.
    const origin = proto === "https" ? `https://${host}` : null;
    const providerOrderId = `${order.order_number}-${Date.now().toString(36)}`;
    const gatewayOrder = await createGatewayOrder({
      providerOrderId,
      amount: Number(order.total),
      customer: {
        id: order.customer_id ?? `guest_${order.id.slice(0, 8)}`,
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
      },
      returnUrl: origin ? `${origin}/customer/orders/${order.id}?cf_return=1` : null,
      notifyUrl: origin ? `${origin}/api/public/webhooks/cashfree` : null,
      note: `${order.businesses?.business_name ?? "Table Rush"} · ${order.order_number}`,
    });

    await supabaseAdmin
      .from("payments")
      .update({
        provider: "cashfree",
        provider_order_id: gatewayOrder.order_id,
        payment_session_id: gatewayOrder.payment_session_id,
        status: "pending",
        error_code: null,
        error_message: null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order.id);

    if (order.payment_status === "failed") {
      await supabaseAdmin.from("orders").update({ payment_status: "pending" }).eq("id", order.id);
    }

    return {
      status: "ready",
      provider: "cashfree",
      mode,
      payment_session_id: gatewayOrder.payment_session_id,
      provider_order_id: gatewayOrder.order_id,
      order_number: order.order_number,
    };
  });

/**
 * Verifies the payment with Cashfree's API after checkout closes or the
 * customer returns. Only a gateway-confirmed success marks the order PAID.
 */
export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator(orderInput)
  .handler(async ({ data }): Promise<{ payment_status: string }> => {
    const { logPaymentEvent, syncOrderFromGateway } = await import("@/lib/payments.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const order = await loadOwnOrder(data);
    if (order.payment_status === "paid" || order.payment_status === "refunded") {
      return { payment_status: order.payment_status };
    }
    const { data: payment } = await supabaseAdmin
      .from("payments")
      .select("provider, provider_order_id")
      .eq("order_id", order.id)
      .maybeSingle();
    if (payment?.provider !== "cashfree" || !payment.provider_order_id) {
      return { payment_status: order.payment_status };
    }
    const status = await syncOrderFromGateway(order.id, payment.provider_order_id, Number(order.total));
    await logPaymentEvent({
      orderId: order.id,
      eventType: "checkout.verify",
      providerOrderId: payment.provider_order_id,
      signatureValid: true,
      payload: { status },
    });
    return { payment_status: status };
  });
