import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";

const FAQS = [
  { q: "How do I order at a restaurant or café?", a: "Scan the QR code on your table, or open the venue on Table Rush and pick your table. Add items to your cart, check out and pay online or at the counter." },
  { q: "Do I need an account to order?", a: "No. You can order without an account and follow the order on its own page. Sign in to see all your orders in one place and to leave reviews." },
  { q: "How do I track my order?", a: "After you place an order, its page updates by itself as the venue accepts, prepares and serves it. Signed-in customers can open it any time from My orders." },
  { q: "Which payment methods are supported?", a: "UPI, credit card, debit card and net banking through Cashfree, or pay at the counter. An order is marked paid only after Cashfree confirms the payment." },
  { q: "My payment failed. Was I charged?", a: "Failed payments aren't marked as paid. You can retry from the order page. If money left your account, write to supporttablerush@gmail.com with your order number." },
  { q: "Who can write reviews?", a: "Only signed-in customers whose order has been served, one review per order. This keeps ratings honest." },
  { q: "How do I list my restaurant or café?", a: "Use Register Your Restaurant or Register Your Café. You can then add your menu and tables, print QR codes and receive orders in your dashboard." },
  { q: "What is the Table Rush game?", a: "A physical card game played at the table while you wait for food. See the Game page for how to play and the rules." },
  { q: "I forgot my password.", a: "Tap \"Forgot password?\" on any sign-in page and we'll email you a reset link." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Table Rush ordering, payments & reviews" },
      { name: "description", content: "Answers about ordering by QR, tracking orders, payments, reviews and listing your restaurant or café on Table Rush." },
      { property: "og:title", content: "Table Rush FAQ" },
      { property: "og:description", content: "Common questions about ordering, payments, reviews and listing your venue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <PublicPage>
      <PageHeader eyebrow="Help" title="Frequently asked questions" description="Quick answers for customers and venue owners." />
      <Section className="max-w-3xl space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="surface-card group p-5">
            <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
            <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
        <p className="pt-4 text-sm text-muted-foreground">
          Still stuck? <Link to="/contact" className="underline">Contact us</Link>.
        </p>
      </Section>
    </PublicPage>
  );
}
