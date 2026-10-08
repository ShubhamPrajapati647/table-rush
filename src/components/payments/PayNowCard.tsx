import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/menu";
import { guestToken, type OrderRecord } from "@/lib/orders";
import { isOnlineMethod } from "@/lib/payments";
import { paymentConfig, startPayment, verifyPayment } from "@/lib/payments.functions";

type CheckoutResult = { error?: { message?: string }; paymentDetails?: unknown; redirect?: boolean };
type CashfreeInstance = {
  checkout: (options: { paymentSessionId: string; redirectTarget: string }) => Promise<CheckoutResult>;
};
type CashfreeFactory = (options: { mode: "sandbox" | "production" }) => CashfreeInstance;

function loadCashfree(): Promise<CashfreeFactory> {
  const existing = (window as unknown as { Cashfree?: CashfreeFactory }).Cashfree;
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => {
      const factory = (window as unknown as { Cashfree?: CashfreeFactory }).Cashfree;
      if (factory) resolve(factory);
      else reject(new Error("The payment window could not be loaded."));
    };
    script.onerror = () => reject(new Error("The payment window could not be loaded."));
    document.body.appendChild(script);
  });
}

type Banner = { tone: "success" | "pending" | "error"; title: string; text: string };

const BANNERS: Record<string, Banner> = {
  paid: { tone: "success", title: "Payment successful", text: "Your order has been confirmed." },
  pending: {
    tone: "pending",
    title: "Payment processing",
    text: "We are waiting for payment confirmation.",
  },
  failed: {
    tone: "error",
    title: "Payment failed",
    text: "Your payment could not be completed. Please try again.",
  },
  cancelled: { tone: "error", title: "Payment cancelled", text: "No payment was confirmed." },
};

/**
 * Online payment via Cashfree's hosted checkout. The browser only opens the
 * server-created session; the server re-checks Cashfree before anything is PAID.
 */
export function PayNowCard({ order }: { order: OrderRecord }) {
  const queryClient = useQueryClient();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const checkedReturn = useRef(false);

  const config = useQuery({ queryKey: ["payment-config"], queryFn: () => paymentConfig() });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["my-order", order.id] }).then(() => {
      void queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    });

  const verify = async (fallback?: keyof typeof BANNERS) => {
    const result = await verifyPayment({ data: { order_id: order.id, guest_token: guestToken() } });
    const key =
      result.payment_status === "pending" && fallback ? fallback : result.payment_status;
    setBanner(BANNERS[key] ?? null);
    await refresh();
  };

  // Returning from a redirect-based payment (e.g. UPI app on mobile).
  useEffect(() => {
    if (checkedReturn.current || !isOnlineMethod(order.payment_method)) return;
    if (!window.location.search.includes("cf_return")) return;
    checkedReturn.current = true;
    void verify().catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.id]);

  const pay = useMutation({
    mutationFn: async () => {
      const session = await startPayment({
        data: { order_id: order.id, guest_token: guestToken() },
      });
      if (session.status === "not_configured") {
        setError(
          "Online payment isn't switched on yet. Please pay at the counter — the venue will mark your order paid.",
        );
        return;
      }
      if (session.status === "already_paid") {
        await refresh();
        return;
      }
      const Cashfree = await loadCashfree();
      const cashfree = Cashfree({ mode: session.mode });
      const result = await cashfree.checkout({
        paymentSessionId: session.payment_session_id,
        redirectTarget: "_modal",
      });
      if (result.redirect) return;
      // Whatever the modal says, the server asks Cashfree for the real status.
      await verify(result.error ? "cancelled" : undefined);
    },
    onMutate: () => {
      setError(null);
      setBanner(null);
    },
    onError: (cause) =>
      setError(cause instanceof Error ? cause.message : "We couldn't start the payment."),
  });

  if (!isOnlineMethod(order.payment_method)) {
    if (order.payment_status === "paid") return null;
    return (
      <div className="surface-card space-y-2 p-5">
        <h2 className="font-display text-lg font-semibold">Pay at Counter</h2>
        <p className="text-sm text-muted-foreground">
          Settle {formatPrice(order.total)} at the counter. The venue marks your order paid once you
          do.
        </p>
      </div>
    );
  }

  if (order.payment_status === "paid") {
    return (
      <div className="surface-card flex items-start gap-3 p-5">
        <ShieldCheck className="mt-0.5 size-5 text-success" />
        <div>
          <h2 className="font-display text-lg font-semibold">Payment successful</h2>
          <p className="text-sm text-muted-foreground">
            {formatPrice(order.total)} confirmed by Cashfree. Your order has been confirmed.
          </p>
        </div>
      </div>
    );
  }

  if (order.payment_status === "refunded") {
    return (
      <div className="surface-card space-y-2 p-5">
        <h2 className="font-display text-lg font-semibold">Refunded</h2>
        <p className="text-sm text-muted-foreground">
          This payment has been refunded. It can take a few working days to reach your bank.
        </p>
      </div>
    );
  }

  const configured = config.data?.configured === true;

  return (
    <div className="surface-card space-y-3 p-5">
      <h2 className="font-display text-lg font-semibold">
        {order.payment_status === "failed" ? "Payment failed" : "Complete your payment"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {order.payment_status === "failed"
          ? `Your payment could not be completed. Please try again, or pay ${formatPrice(order.total)} at the counter.`
          : `${formatPrice(order.total)} is still to be paid for this order.`}
      </p>

      {banner ? (
        <div
          className={`rounded-xl p-3 text-sm ${
            banner.tone === "success"
              ? "bg-success/10 text-success"
              : banner.tone === "pending"
                ? "bg-muted"
                : "bg-destructive/10 text-destructive"
          }`}
        >
          <p className="font-semibold">{banner.title}</p>
          <p>{banner.text}</p>
        </div>
      ) : null}

      {config.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Checking payment options…
        </p>
      ) : configured ? (
        <>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            disabled={pay.isPending}
            onClick={() => pay.mutate()}
          >
            {pay.isPending ? <Loader2 className="size-4 animate-spin" /> : null} Pay{" "}
            {formatPrice(order.total)} now
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" /> Secure payment powered by Cashfree
            {config.data?.mode === "sandbox" ? " · test mode, no real money moves" : ""}
          </p>
        </>
      ) : (
        <p className="rounded-xl bg-muted p-3 text-sm">
          Online payment isn't switched on yet, so this order is marked payment pending. Please pay
          at the counter and the venue will confirm it.
        </p>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
