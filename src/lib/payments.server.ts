/**
 * Server-only Cashfree Payments adapter (the active payment provider).
 *
 * Secrets (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) are read inside each function
 * and never leave the server. Payment success is only accepted after Cashfree
 * itself reports it — a browser redirect or callback is never trusted.
 */

import { createHmac, timingSafeEqual } from "crypto";

import type { PaymentStatus } from "@/lib/orders";

const API_VERSION = "2025-01-01";

export type GatewayConfig = {
  configured: boolean;
  appId: string;
  secretKey: string;
  mode: "sandbox" | "production" | "unconfigured";
  baseUrl: string;
};

/** Reads the gateway credentials. Missing credentials are a state, not a crash. */
export function gatewayConfig(): GatewayConfig {
  const appId = process.env["CASHFREE_APP_ID"] ?? "";
  const secretKey = process.env["CASHFREE_SECRET_KEY"] ?? "";
  const env = (process.env["CASHFREE_ENVIRONMENT"] ?? "sandbox").toLowerCase();
  const mode = env === "production" ? "production" : "sandbox";
  if (!appId || !secretKey) {
    return { configured: false, appId: "", secretKey: "", mode: "unconfigured", baseUrl: "" };
  }
  return {
    configured: true,
    appId,
    secretKey,
    mode,
    baseUrl: mode === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg",
  };
}

function headers(config: GatewayConfig): Record<string, string> {
  return {
    "x-client-id": config.appId,
    "x-client-secret": config.secretKey,
    "x-api-version": API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function readError(response: Response, fallback: string): Promise<string> {
  const text = await response.text();
  console.error(`Cashfree request failed [${response.status}]: ${text}`);
  try {
    return (JSON.parse(text) as { message?: string }).message ?? fallback;
  } catch {
    return fallback;
  }
}

export type GatewayOrder = {
  order_id: string;
  order_status: string; // ACTIVE | PAID | EXPIRED | TERMINATED ...
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
};

/** Creates the Cashfree order the browser checkout needs. */
export async function createGatewayOrder(input: {
  providerOrderId: string;
  amount: number;
  customer: { id: string; name: string; phone: string; email: string | null };
  returnUrl: string | null;
  notifyUrl: string | null;
  note: string;
}): Promise<GatewayOrder> {
  const config = gatewayConfig();
  if (!config.configured) throw new Error("Online payments are not configured yet.");

  const response = await fetch(`${config.baseUrl}/orders`, {
    method: "POST",
    headers: headers(config),
    body: JSON.stringify({
      order_id: input.providerOrderId,
      order_amount: Number(input.amount.toFixed(2)),
      order_currency: "INR",
      customer_details: {
        customer_id: input.customer.id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 50) || "customer",
        customer_name: input.customer.name.slice(0, 100),
        customer_phone: input.customer.phone.replace(/\D/g, "").slice(-10),
        ...(input.customer.email ? { customer_email: input.customer.email } : {}),
      },
      ...(input.returnUrl && input.notifyUrl
        ? { order_meta: { return_url: input.returnUrl, notify_url: input.notifyUrl } }
        : {}),
      order_note: input.note.slice(0, 200),
    }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, "The payment gateway rejected this order."));
  }
  return (await response.json()) as GatewayOrder;
}

/** Reads a Cashfree order (used to reuse a still-active payment session). */
export async function fetchGatewayOrder(providerOrderId: string): Promise<GatewayOrder | null> {
  const config = gatewayConfig();
  if (!config.configured) return null;
  const response = await fetch(`${config.baseUrl}/orders/${encodeURIComponent(providerOrderId)}`, {
    headers: headers(config),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await readError(response, "We couldn't check that payment."));
  return (await response.json()) as GatewayOrder;
}

export type GatewayPayment = {
  cf_payment_id: string;
  payment_status: string; // SUCCESS | PENDING | FAILED | USER_DROPPED | CANCELLED | NOT_ATTEMPTED
  payment_amount: number;
  payment_currency: string;
  payment_group: string | null;
  payment_message: string | null;
  error_code: string | null;
};

/** All payment attempts for a Cashfree order — the source of truth. */
export async function fetchGatewayPayments(providerOrderId: string): Promise<GatewayPayment[]> {
  const config = gatewayConfig();
  if (!config.configured) throw new Error("Online payments are not configured yet.");
  const response = await fetch(
    `${config.baseUrl}/orders/${encodeURIComponent(providerOrderId)}/payments`,
    { headers: headers(config) },
  );
  if (!response.ok) throw new Error(await readError(response, "We couldn't verify that payment."));
  const rows = (await response.json()) as Array<Record<string, unknown>>;
  return rows.map((row) => ({
    cf_payment_id: String(row["cf_payment_id"] ?? ""),
    payment_status: String(row["payment_status"] ?? ""),
    payment_amount: Number(row["payment_amount"] ?? 0),
    payment_currency: String(row["payment_currency"] ?? "INR"),
    payment_group: (row["payment_group"] as string | null) ?? null,
    payment_message: (row["payment_message"] as string | null) ?? null,
    error_code:
      ((row["error_details"] as { error_code?: string } | null)?.error_code as string | undefined) ??
      null,
  }));
}

/** Webhook signature: base64(HMAC-SHA256(timestamp + rawBody, secret key)). */
export function verifyWebhookSignature(rawBody: string, signature: string, timestamp: string): boolean {
  const config = gatewayConfig();
  if (!config.configured || !signature || !timestamp) return false;
  const expected = createHmac("sha256", config.secretKey)
    .update(timestamp + rawBody)
    .digest("base64");
  return safeEqual(signature, expected);
}

/** A Cashfree payment state mapped onto our own payment status. */
export function mapGatewayStatus(status: string): PaymentStatus | null {
  switch (status.toUpperCase()) {
    case "SUCCESS":
      return "paid";
    case "FAILED":
    case "USER_DROPPED":
    case "CANCELLED":
      return "failed";
    case "PENDING":
    case "NOT_ATTEMPTED":
      return "pending";
    default:
      return null;
  }
}

/**
 * Picks the outcome for an order from its gateway attempts: any successful
 * attempt wins, otherwise pending beats failed. Never upgrades pending to paid.
 */
export function summariseAttempts(payments: GatewayPayment[]): {
  status: PaymentStatus;
  payment: GatewayPayment | null;
} {
  const success = payments.find((p) => mapGatewayStatus(p.payment_status) === "paid");
  if (success) return { status: "paid", payment: success };
  const pending = payments.find((p) => mapGatewayStatus(p.payment_status) === "pending");
  if (pending) return { status: "pending", payment: pending };
  const failed = payments.find((p) => mapGatewayStatus(p.payment_status) === "failed");
  if (failed) return { status: "failed", payment: failed };
  return { status: "pending", payment: null };
}

type Outcome = {
  orderId: string;
  status: PaymentStatus;
  providerPaymentId?: string | null;
  providerOrderId?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  refundAmount?: number | null;
};

/**
 * Writes a verified payment outcome idempotently. The order's payment_status
 * goes through the database so the status-transition trigger still applies.
 */
export async function applyPaymentOutcome(outcome: Outcome): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("payment_status")
    .eq("id", outcome.orderId)
    .maybeSingle();
  // Already settled with this result (e.g. a repeated webhook) — nothing to do.
  if (order && order.payment_status === outcome.status && outcome.status !== "pending") return;
  // A paid order never falls back to failed/pending because of a stale attempt.
  if (order?.payment_status === "paid" && outcome.status !== "refunded") return;

  const patch: {
    status: PaymentStatus;
    provider: string;
    updated_at: string;
    provider_payment_id?: string;
    provider_order_id?: string;
    error_code: string | null;
    error_message: string | null;
    paid_at?: string;
    refunded_at?: string;
    refund_amount?: number;
  } = {
    status: outcome.status,
    provider: "cashfree",
    updated_at: new Date().toISOString(),
    error_code: outcome.errorCode ?? null,
    error_message: outcome.errorMessage ?? null,
  };
  if (outcome.providerPaymentId) patch.provider_payment_id = outcome.providerPaymentId;
  if (outcome.providerOrderId) patch.provider_order_id = outcome.providerOrderId;
  if (outcome.status === "paid") patch.paid_at = new Date().toISOString();
  if (outcome.status === "refunded") {
    patch.refunded_at = new Date().toISOString();
    if (outcome.refundAmount != null) patch.refund_amount = outcome.refundAmount;
  }

  await supabaseAdmin.from("payments").update(patch).eq("order_id", outcome.orderId);

  if (order && order.payment_status !== outcome.status) {
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ payment_status: outcome.status })
      .eq("id", outcome.orderId);
    if (error) console.warn("payment status transition rejected", error.message);
  }
}

/** Audit row for every provider callback, valid or not. */
export async function logPaymentEvent(input: {
  orderId: string | null;
  eventType: string;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  signatureValid: boolean;
  payload: unknown;
}): Promise<void> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("payment_events").insert({
    order_id: input.orderId,
    provider: "cashfree",
    event_type: input.eventType.slice(0, 120),
    provider_order_id: input.providerOrderId ?? null,
    provider_payment_id: input.providerPaymentId ?? null,
    signature_valid: input.signatureValid,
    payload: (input.payload ?? {}) as never,
  });
}

/** Re-reads Cashfree for an order and stores the verified result. */
export async function syncOrderFromGateway(
  orderId: string,
  providerOrderId: string,
  expectedTotal: number,
): Promise<PaymentStatus> {
  const attempts = await fetchGatewayPayments(providerOrderId);
  const { status, payment } = summariseAttempts(attempts);
  if (status === "paid" && payment) {
    if (Math.round(payment.payment_amount * 100) !== Math.round(expectedTotal * 100)) {
      await applyPaymentOutcome({
        orderId,
        status: "failed",
        providerOrderId,
        providerPaymentId: payment.cf_payment_id,
        errorCode: "amount_mismatch",
        errorMessage: "The amount paid did not match the order total.",
      });
      return "failed";
    }
  }
  if (status === "pending" && !payment) return "pending";
  await applyPaymentOutcome({
    orderId,
    status,
    providerOrderId,
    providerPaymentId: payment?.cf_payment_id ?? null,
    errorCode: status === "failed" ? payment?.error_code ?? "payment_failed" : null,
    errorMessage: status === "failed" ? payment?.payment_message ?? "The payment did not go through." : null,
  });
  return status;
}
