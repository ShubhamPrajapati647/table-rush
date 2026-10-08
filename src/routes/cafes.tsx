import { createFileRoute } from "@tanstack/react-router";

import { DirectoryBrowser } from "@/components/directory/DirectoryBrowser";
import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";

export const Route = createFileRoute("/cafes")({
  head: () => ({
    meta: [
      { title: "Cafés on Table Rush" },
      {
        name: "description",
        content: "Browse cafés on Table Rush, check their hours and order from your table.",
      },
      { property: "og:title", content: "Cafés on Table Rush" },
      { property: "og:description", content: "Find a café, scan your table and order in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cafes,
});

function Cafes() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="Discover"
        title="Cafés"
        description="Search cafés across Mumbai by name, area and type. Cafés on Table Rush also take orders from your table."
      />
      <Section>
        <DirectoryBrowser fixedType="cafe" />
      </Section>
    </PublicPage>
  );
}
