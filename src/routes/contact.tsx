import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Store } from "lucide-react";

import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Table Rush" },
      {
        name: "description",
        content: "Get in touch with the Table Rush team about customer support or listing your venue.",
      },
      { property: "og:title", content: "Contact Table Rush" },
      { property: "og:description", content: "Customer support and business enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

const CARDS = [
  {
    icon: MessageSquare,
    title: "Customer support",
    body: "Trouble with an order, a payment or your account? Reach out and we'll help.",
  },
  {
    icon: Store,
    title: "Business enquiries",
    body: "Want your restaurant or café on Table Rush? Tell us about your venue.",
  },
  {
    icon: Mail,
    title: "Everything else",
    body: "Partnerships, press or feedback on the Table Rush game.",
  },
];

function Contact() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="Contact"
        title="Talk to Table Rush"
        description="Write to supporttablerush@gmail.com — here's what we can help with."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div key={card.title} className="surface-card p-6">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/20">
                <card.icon className="size-5" />
              </span>
              <h2 className="mt-5 font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Email us any time at{" "}
          <a href="mailto:supporttablerush@gmail.com" className="font-semibold text-primary underline-offset-4 hover:underline">
            supporttablerush@gmail.com
          </a>
          .
        </p>
      </Section>
    </PublicPage>
  );
}
