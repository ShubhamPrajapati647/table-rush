import { DashboardHeading } from "@/components/dashboard/DashboardShell";
import { GameSupportContent } from "@/components/game/GameSupportContent";

/** Game support inside a dashboard (business or admin). */
export function GameSupportSection({ audience }: { audience: "business" | "admin" }) {
  return (
    <>
      <DashboardHeading
        title="Game support"
        description="TABLE RUSH — a physical table card game. How to play, card types and game rules."
      />
      <GameSupportContent audience={audience} />
    </>
  );
}
