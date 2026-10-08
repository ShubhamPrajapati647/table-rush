import { createFileRoute } from "@tanstack/react-router";

import { GameSupportContent } from "@/components/game/GameSupportContent";
import { PageHeader, PublicPage, Section } from "@/components/site/PublicPage";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "TABLE RUSH — A Physical Table Card Game" },
      {
        name: "description",
        content: "How to play TABLE RUSH, the physical card game for restaurant and café tables: card types and game rules.",
      },
      { property: "og:title", content: "TABLE RUSH — A Physical Table Card Game" },
      { property: "og:description", content: "Gather around the table, shuffle the deck and play your cards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamePage,
});

function GamePage() {
  return (
    <PublicPage>
      <PageHeader
        eyebrow="Game support"
        title="TABLE RUSH — A Card Game for the Table"
        description="Gather around the table. Shuffle the deck. Play your cards. Challenge your friends. Enjoy the moment."
      />
      <Section className="max-w-5xl">
        <GameSupportContent audience="customer" />
      </Section>
    </PublicPage>
  );
}
