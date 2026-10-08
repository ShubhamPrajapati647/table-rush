import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { homePathForRoles } from "@/lib/roles";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  customer: "Customer",
  restaurant_owner: "Restaurant owner",
  restaurant_staff: "Restaurant staff",
  cafe_owner: "Café owner",
  cafe_staff: "Café staff",
};

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My profile — Table Rush" },
      { name: "description", content: "Manage your Table Rush account details." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { loading, user, profile, roles, refresh, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setCity(profile?.city ?? "");
  }, [profile]);

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim(), city: city.trim() })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      await refresh();
      setSaved(true);
    }
    setBusy(false);
  }

  async function onSignOut() {
    await signOut();
    void navigate({ to: "/", replace: true });
  }

  return (
    <PublicPage>
      <PageHeader eyebrow="Your account" title="Profile" description="Your Table Rush details." />
      <Section>
        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <EmptyState
            icon={UserRound}
            title="Sign in to view your profile"
            description="Your details are only visible to you."
            action={
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <form onSubmit={onSave} className="surface-card space-y-5 p-6">
              {error ? (
                <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {saved ? <p className="text-sm text-muted-foreground">Profile saved.</p> : null}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
              </Button>
            </form>

            <div className="surface-card space-y-4 p-6">
              <div>
                <p className="eyebrow">Email</p>
                <p className="mt-1 text-sm break-words">{user.email}</p>
              </div>
              <div>
                <p className="eyebrow">Account type</p>
                <p className="mt-1 text-sm">
                  {roles.length ? roles.map((r) => ROLE_LABELS[r] ?? r).join(", ") : "Customer"}
                </p>
              </div>
              {homePathForRoles(roles) !== "/customer/orders" ? (
                <p className="text-sm text-muted-foreground">
                  This account manages a venue. To order as a customer, sign up with a separate customer account.{" "}
                  <Link to={homePathForRoles(roles)} className="font-semibold underline">
                    Open my dashboard
                  </Link>
                </p>
              ) : null}
              <Button variant="outline" onClick={onSignOut}>
                Log out
              </Button>
            </div>
          </div>
        )}
      </Section>
    </PublicPage>
  );
}
