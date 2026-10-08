import { createFileRoute } from "@tanstack/react-router";

/**
 * Cashfree webhook — the authoritative payment confirmation path. The raw body
 * is verified with the Cashfree signature before anything is parsed or written,
 * and the result is re-read from Cashfree's API so a replayed or partial event
 * can never mark an order paid on its own. Repeat deliveries are no-ops.
 */
export const Route = createFileRoute("/api/public/webhooks/cashfree")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("x-webhook-signature") ?? "";
        const timestamp = request.headers.get("x-webhook-timestamp") ?? "";

        const { logPaymentEvent, syncOrderFromGateway, verifyWebhookSignature } = await import(
          "@/lib/payments.server"
        );

        if (!verifyWebhookSignature(raw, signature, timestamp)) {
          await logPaymentEvent({
            orderId: null,
            eventType: "webhook.rejected",
            signatureValid: false,
            payload: { reason: "invalid signature" },
          });
          return new Response("Invalid signature", { status: 401 });
        }

        let body: Record<string, unknown>;
        try {
          body = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          return new Response("Invalid payload", { status: 400 });
        }

        const type = String(body["type"] ?? "webhook.unknown");
        const data = (body["data"] ?? {}) as Record<string, unknown>;
        const providerOrderId = String(
          ((data["order"] as Record<string, unknown> | undefined)?.["order_id"] as string) ?? "",
        );
        const providerPaymentId = String(
          ((data["payment"] as Record<string, unknown> | undefined)?.["cf_payment_id"] as
            | string
            | number) ?? "",
        );

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row } = providerOrderId
          ? await supabaseAdmin
              .from("payments")
              .select("order_id, orders ( total )")
              .eq("provider_order_id", providerOrderId)
              .maybeSingle()
          : { data: null };

        await logPaymentEvent({
          orderId: row?.order_id ?? null,
          eventType: type,
          providerOrderId: providerOrderId || null,
          providerPaymentId: providerPaymentId || null,
          signatureValid: true,
          payload: body,
        });

        if (!row) return new Response("ok");
        const total = Number((row as unknown as { orders?: { total: number } }).orders?.total ?? 0);
        try {
          await syncOrderFromGateway(row.order_id, providerOrderId, total);
        } catch (cause) {
          console.error("cashfree webhook sync failed", cause);
          return new Response("retry", { status: 500 });
        }
        return new Response("ok");
      },
    },
  },
});
