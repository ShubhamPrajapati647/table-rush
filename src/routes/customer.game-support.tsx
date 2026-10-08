import { createFileRoute } from "@tanstack/react-router";

import { GameSupportContent } from "@/components/game/GameSupportContent";
import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";

export const Route = createFileRoute("/customer/game-support")({
  head: () => ({
    meta: [
      { title: "Game support — Table Rush" },
      {
        name: "description",
        content:
          "How to play TABLE RUSH, the physical table card game: card types and game rules.",
      },
      { property: "og:title", content: "Game support — Table Rush" },
      {
        property: "og:description",
        content: "How to play, card types and game rules for the TABLE RUSH card game.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CustomerGameSupport,
});

function CustomerGameSupport() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="Game support"
        title="TABLE RUSH — A Physical Table Card Game"
        description="Gather around the table. Shuffle the deck. Play your cards."
      />
      <Section className="max-w-5xl">
        <GameSupportContent audience="customer" />
      </Section>
    </PublicPage>
  );
}
