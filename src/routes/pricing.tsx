import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Digital menu with categories and add-ons",
  "Table management and printable QR codes",
  "Live orders screen with status updates",
  "Online payments (UPI, cards, net banking) and pay at counter",
  "Sales and order reports",
  "Customer reviews and ratings",
  "Table Rush card game support",
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing for Restaurants & Cafés — Table Rush" },
      { name: "description", content: "What's included for restaurants and cafés on Table Rush: QR ordering, table management, live orders, online payments and reports." },
      { property: "og:title", content: "Table Rush pricing for businesses" },
      { property: "og:description", content: "QR ordering, tables, live orders, payments and reports for your venue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <PublicPage>
      <PageHeader eyebrow="For business" title="Pricing" description="One plan with everything your restaurant or café needs. Contact us for a quote for your venue." />
      <Section className="max-w-3xl">
        <div className="surface-card p-8">
          <h2 className="font-display text-2xl font-semibold">Table Rush for venues</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pricing is shared on request — write to supporttablerush@gmail.com.</p>
          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-3 text-sm"><Check className="size-5 shrink-0 text-primary" />{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link to="/restaurant/register">Register Your Restaurant</Link></Button>
            <Button asChild variant="outline"><Link to="/cafe/register">Register Your Café</Link></Button>
            <Button asChild variant="ghost"><a href="mailto:supporttablerush@gmail.com?subject=Table%20Rush%20pricing">Ask for pricing</a></Button>
          </div>
        </div>
      </Section>
    </PublicPage>
  );
}
