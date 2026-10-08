import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { homePathForRoles, type AppRole } from "@/lib/roles";

function Message({ tone, children }: { tone: "error" | "success"; children: string }) {
  return (
    <p
      className={`rounded-xl px-3 py-2.5 text-sm ${
        tone === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-primary/15 text-primary-foreground"
      }`}
    >
      {children}
    </p>
  );
}

/** Email + password sign in. Redirect target comes from the account's roles. */
export function LoginForm({ expectedRoles }: { expectedRoles?: AppRole[] }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Could not sign in.");
      setBusy(false);
      return;
    }

    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((row) => row.role as AppRole);

    if (expectedRoles && !roles.some((role) => expectedRoles.includes(role))) {
      await supabase.auth.signOut();
      setError("This account can't sign in here. Use the sign-in page for your account type.");
      setBusy(false);
      return;
    }

    await refresh();
    void navigate({ to: homePathForRoles(roles), replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Message tone="error">{error}</Message> : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-xs font-semibold underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
      </Button>
    </form>
  );
}

/**
 * Sign up for customers and business owners. The role is stored in the auth
 * user's metadata and validated server-side by a database trigger, so an
 * admin role can never be requested from a public form.
 */
export function SignupForm({
  role,
  businessLabel,
}: {
  role: Extract<AppRole, "customer" | "restaurant_owner" | "cafe_owner">;
  businessLabel?: string;
}) {
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          role,
          business_name: businessName.trim() || null,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    if (!data.session) {
      setNotice("Check your email to confirm your account, then sign in.");
      setBusy(false);
      return;
    }

    await refresh();
    void navigate({ to: homePathForRoles([role]), replace: true });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Message tone="error">{error}</Message> : null}
      {notice ? <Message tone="success">{notice}</Message> : null}

      <div className="space-y-2">
        <Label htmlFor="fullName">{businessLabel ? "Owner name" : "Full name"}</Label>
        <Input
          id="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      {businessLabel ? (
        <div className="space-y-2">
          <Label htmlFor="businessName">{businessLabel}</Label>
          <Input
            id="businessName"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
      </Button>
    </form>
  );
}

type OtpChannel = "email" | "phone";

/** Normalise an Indian mobile number to +91XXXXXXXXXX; accepts numbers already in +country form. */
function normalisePhone(raw: string): string | null {
  const trimmed = raw.replace(/[\s()-]/g, "");
  if (/^\+\d{10,15}$/.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
  if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
  return null;
}

/**
 * One-time-code sign up / sign in with email or mobile number.
 * New accounts get the requested role via metadata, which the database trigger validates.
 */
export function OtpAuthForm({
  mode,
  role = "customer",
}: {
  mode: "signup" | "login";
  role?: Extract<AppRole, "customer" | "restaurant_owner" | "cafe_owner">;
}) {
  const [channel, setChannel] = useState<OtpChannel>("email");
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { refresh } = useAuth();

  function target(): string | null {
    if (channel === "email") {
      const email = contact.trim().toLowerCase();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255 ? email : null;
    }
    return normalisePhone(contact);
  }

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    setError(null);
    setNotice(null);
    const value = target();
    if (!value) {
      setError(channel === "email" ? "Enter a valid email address." : "Enter a valid 10-digit mobile number.");
      return;
    }
    if (mode === "signup" && !fullName.trim()) {
      setError("Enter your name.");
      return;
    }
    setBusy(true);
    const options: { shouldCreateUser: boolean; data?: Record<string, string> } = {
      shouldCreateUser: mode === "signup",
    };
    if (mode === "signup") {
      options.data = { full_name: fullName.trim().slice(0, 100), role, ...(channel === "phone" ? { phone: value } : {}) };
    }
    const { error: otpError } =
      channel === "email"
        ? await supabase.auth.signInWithOtp({
            email: value,
            options: { ...options, emailRedirectTo: `${window.location.origin}/` },
          })
        : await supabase.auth.signInWithOtp({ phone: value, options });
    setBusy(false);
    if (otpError) {
      const msg = otpError.message.toLowerCase();
      if (channel === "phone" && (msg.includes("provider") || msg.includes("sms") || msg.includes("unsupported"))) {
        setError("Mobile sign-in isn't switched on yet. Please use your email for now.");
      } else if (mode === "login" && msg.includes("signups not allowed")) {
        setError("No account found. Create an account first.");
      } else {
        setError(otpError.message);
      }
      return;
    }
    setSentTo(value);
    setCode("");
    setNotice(
      channel === "email"
        ? `We sent a code to ${value}. Enter it below, or tap the link in the email.`
        : `We sent a code by SMS to ${value}.`,
    );
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    if (!sentTo) return;
    if (!/^\d{6,8}$/.test(code)) {
      setError("Enter the code you received.");
      return;
    }
    setBusy(true);
    setError(null);
    const { data, error: verifyError } =
      channel === "email"
        ? await supabase.auth.verifyOtp({ email: sentTo, token: code, type: "email" })
        : await supabase.auth.verifyOtp({ phone: sentTo, token: code, type: "sms" });
    if (verifyError || !data.user) {
      setError(verifyError?.message ?? "That code didn't work. Try again.");
      setBusy(false);
      return;
    }
    const { data: roleRows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const roles = (roleRows ?? []).map((row) => row.role as AppRole);
    await refresh();
    void navigate({ to: homePathForRoles(roles.length ? roles : [role]), replace: true });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1" role="tablist">
        {(["email", "phone"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={channel === c}
            onClick={() => {
              setChannel(c);
              setContact("");
              setSentTo(null);
              setError(null);
              setNotice(null);
            }}
            className={`rounded-full py-2 text-sm font-semibold transition-colors ${
              channel === c ? "bg-background shadow-sm" : "text-muted-foreground"
            }`}
          >
            {c === "email" ? "Email" : "Mobile number"}
          </button>
        ))}
      </div>

      {error ? <Message tone="error">{error}</Message> : null}
      {notice ? <Message tone="success">{notice}</Message> : null}

      {!sentTo ? (
        <form onSubmit={sendCode} className="space-y-4">
          {mode === "signup" ? (
            <div className="space-y-2">
              <Label htmlFor="otpName">Full name</Label>
              <Input id="otpName" required maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="otpContact">{channel === "email" ? "Email" : "Mobile number"}</Label>
            <Input
              id="otpContact"
              type={channel === "email" ? "email" : "tel"}
              inputMode={channel === "email" ? "email" : "numeric"}
              autoComplete={channel === "email" ? "email" : "tel"}
              placeholder={channel === "email" ? "you@example.com" : "98765 43210"}
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Send code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otpCode">Code</Label>
            <Input
              id="otpCode"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              placeholder="123456"
              className="text-center text-lg tracking-[0.4em]"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : mode === "signup" ? "Verify & create account" : "Verify & sign in"}
          </Button>
          <div className="flex justify-between text-sm">
            <button type="button" className="underline" onClick={() => setSentTo(null)}>
              Change {channel === "email" ? "email" : "number"}
            </button>
            <button type="button" className="underline" disabled={busy} onClick={() => void sendCode()}>
              Resend code
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/** Code-based form with an option to use a password instead. */
export function AuthMethodSwitch({ code, password }: { code: React.ReactNode; password: React.ReactNode }) {
  const [usePassword, setUsePassword] = useState(false);
  return (
    <div className="space-y-4">
      {usePassword ? password : code}
      <button
        type="button"
        className="w-full text-center text-sm text-muted-foreground underline"
        onClick={() => setUsePassword((v) => !v)}
      >
        {usePassword ? "Use a one-time code instead" : "Use a password instead"}
      </button>
    </div>
  );
}
