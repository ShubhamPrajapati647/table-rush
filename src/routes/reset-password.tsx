import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { homePathForRoles, type AppRole } from "@/lib/roles";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Table Rush" },
      { name: "description", content: "Choose a new password for your Table Rush account." },
      { property: "og:title", content: "Set a new password — Table Rush" },
      { property: "og:description", content: "Choose a new Table Rush password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery") || window.location.search.includes("code=");
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady("ok");
    });
    const t = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      setReady((r) => (r === "ok" ? r : data.session && isRecovery ? "ok" : data.session ? "ok" : "invalid"));
    }, 800);
    return () => {
      clearTimeout(t);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setBusy(true);
    const { data, error: err } = await supabase.auth.updateUser({ password });
    if (err || !data.user) {
      setBusy(false);
      return setError(err?.message ?? "Couldn't update your password.");
    }
    const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    void navigate({ to: homePathForRoles((rows ?? []).map((r) => r.role as AppRole)), replace: true });
  }

  return (
    <AuthShell eyebrow="Account help" title="Set a new password" description="Choose a strong password you don't use elsewhere.">
      {ready === "checking" ? (
        <div className="flex justify-center py-6"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
      ) : ready === "invalid" ? (
        <div className="space-y-4 text-sm">
          <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-destructive">
            This reset link is invalid or has expired.
          </p>
          <Button asChild className="w-full"><Link to="/forgot-password">Request a new link</Link></Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p> : null}
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pw2">Confirm password</Label>
            <Input id="pw2" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
