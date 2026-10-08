import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — Table Rush" },
      { name: "description", content: "Get a link to reset your Table Rush password." },
      { property: "og:title", content: "Forgot password — Table Rush" },
      { property: "og:description", content: "Reset your Table Rush account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    // Same message whether or not the account exists, so emails can't be probed.
    if (err && err.status === 429) setError("Too many requests. Please wait a minute and try again.");
    else setSent(true);
  }

  return (
    <AuthShell
      eyebrow="Account help"
      title="Forgot your password?"
      description="Works for customer, restaurant, café and admin accounts."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold underline">
            Back to sign in
          </Link>
        </>
      }
    >
      {sent ? (
        <p className="rounded-xl bg-primary/15 px-3 py-2.5 text-sm">
          If an account exists for that email, a reset link is on its way. Check your inbox and spam folder.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
