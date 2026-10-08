import { createFileRoute, Link } from "@tanstack/react-router";

import { AuthMethodSwitch, OtpAuthForm, SignupForm } from "@/components/auth/AuthForms";
import { AuthShell } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Table Rush account" },
      {
        name: "description",
        content: "Create a free Table Rush customer account to order from your table.",
      },
      { property: "og:title", content: "Create your Table Rush account" },
      { property: "og:description", content: "Discover. Order. Play. Enjoy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AuthShell
      eyebrow="Customers"
      title="Create your account"
      description="Free for customers. Order from your table in a few taps."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline">
            Sign in
          </Link>
          <br />
          Running a venue?{" "}
          <Link to="/for-restaurants" className="font-semibold underline">
            Register your restaurant
          </Link>{" "}
          or{" "}
          <Link to="/for-cafes" className="font-semibold underline">
            register your café
          </Link>
        </>
      }
    >
      <AuthMethodSwitch code={<OtpAuthForm mode="signup" />} password={<SignupForm role="customer" />} />
    </AuthShell>
  ),
});
