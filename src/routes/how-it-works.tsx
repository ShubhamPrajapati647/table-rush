import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Table Rush works — customers and venues" },
      {
        name: "description",
        content:
          "From discovering a venue to scanning your table, ordering, paying and tracking — here's how Table Rush works.",
      },
      { property: "og:title", content: "How Table Rush works" },
      {
        property: "og:description",
        content: "Discover, scan, order, pay and track — for customers and for venues.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HowItWorks,
});

const GUEST_STEPS = [
  { title: "Find a venue", body: "Browse restaurants and cafés on Table Rush and pick one." },
  { title: "Scan your table", body: "Each table has its own QR code that opens the right menu." },
  { title: "Order", body: "Add items and add-ons, then send the order to the kitchen." },
  { title: "Pay your way", body: "Pay online or at the counter, depending on the venue." },
  { title: "Track & play", body: "Follow your order status and play the TABLE RUSH card game at your table." },
];

const VENUE_STEPS = [
  { title: "Register", body: "Create your restaurant or café account and add your venue details." },
  { title: "Get approved", body: "Table Rush reviews new venues before they go live to customers." },
  { title: "Build your menu", body: "Add categories, items, prices and add-ons." },
  { title: "Set up tables", body: "Create tables and print the QR code for each one." },
  { title: "Run service", body: "Accept orders, take payments and review reports." },
];

function Steps({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="mt-6 space-y-4">
      {steps.map((step, index) => (
        <li key={step.title} className="surface-card flex gap-4 p-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <div>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function HowItWorks() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="How it works"
        title="Discover. Order. Play. Enjoy."
        description="Table Rush works the same way for every venue, so customers always know what to expect."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">For customers</h2>
            <Steps steps={GUEST_STEPS} />
            <Button asChild className="mt-6">
              <Link to="/signup">Create a free account</Link>
            </Button>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">For restaurants &amp; cafés</h2>
            <Steps steps={VENUE_STEPS} />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/for-restaurants">Register your restaurant</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/for-cafes">Register your café</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </PublicPage>
  );
}
