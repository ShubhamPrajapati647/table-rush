import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthMethodSwitch, LoginForm, OtpAuthForm } from "@/components/auth/AuthForms";
import { AuthShell } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Table Rush" },
      { name: "description", content: "Sign in to your Table Rush customer account." },
      { property: "og:title", content: "Sign in — Table Rush" },
      { property: "og:description", content: "Sign in to order, pay and track from your table." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthShell
      eyebrow="Customers"
      title="Welcome back"
      description="Sign in to order from your table and follow your orders."
      footer={
        <>
          New to Table Rush?{" "}
          <Link to="/signup" className="font-semibold underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthMethodSwitch code={<OtpAuthForm mode="login" />} password={<LoginForm />} />
    </AuthShell>
  ),
});
