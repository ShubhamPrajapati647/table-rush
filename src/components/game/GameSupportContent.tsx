import { BookOpen, Layers, ScrollText } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/logo-symbol.png";
import { cn } from "@/lib/utils";
import {
  CARD_CATEGORIES,
  GAME_RULES,
  GAME_TAGLINE,
  HOW_TO_PLAY,
  TO_BE_UPDATED,
  type GameCardCategory,
} from "@/lib/game";

type Audience = "customer" | "business" | "admin";
type Tab = "how" | "cards" | "rules";

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
  { key: "how", label: "How to Play", icon: BookOpen },
  { key: "cards", label: "Card Types", icon: Layers },
  { key: "rules", label: "Game Rules", icon: ScrollText },
];

function PlayingCard({
  category,
  name,
  icon: Icon,
  text,
}: {
  category: GameCardCategory;
  name: string;
  icon: GameCardCategory["icon"];
  text: string;
}) {
  return (
    <div className="tr-play-card group [perspective:900px]">
      <div
        className={cn(
          "relative flex aspect-[5/7] flex-col overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-br p-3 text-ink-foreground shadow-lg transition-transform duration-300 group-hover:[transform:rotateX(6deg)_rotateY(-8deg)_translateY(-6px)] group-hover:shadow-2xl motion-reduce:transition-none motion-reduce:group-hover:transform-none",
          category.tone,
        )}
      >
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-foreground/80">
          <span>{category.name.replace(" Cards", "")}</span>
          <img src={logo} alt="" className="h-4 w-auto" />
        </div>
        <div className="my-auto flex flex-col items-center gap-2 text-center">
          <span className="flex size-14 items-center justify-center rounded-full border border-gold/60 bg-ink/30">
            <Icon className="size-7 text-gold" aria-hidden="true" />
          </span>
          <h4 className="font-brand text-xl font-bold leading-tight">{name}</h4>
          <p className="text-xs text-ink-foreground/85">{text}</p>
        </div>
        <p className="text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
          TableRush
        </p>
      </div>
    </div>
  );
}

function HowToPlay() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {HOW_TO_PLAY.map((item, index) => (
        <li key={item.step} className="surface-card flex gap-4 p-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-brand text-lg font-bold text-gold">
            {index + 1}
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Step {index + 1}
            </p>
            <h3 className="font-semibold">{item.step}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function CardTypes() {
  return (
    <div className="space-y-10">
      {CARD_CATEGORIES.map((category) => (
        <section key={category.key}>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-ink text-gold">
              <category.icon className="size-4" aria-hidden="true" />
            </span>
            <h3 className="font-display text-xl font-semibold">{category.name}</h3>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{category.description}</p>
          {category.note ? (
            <p className="mt-2 max-w-2xl rounded-xl border border-gold/40 bg-cream px-3 py-2 text-xs">
              {category.note}
            </p>
          ) : null}
          {category.cards.length ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {category.cards.map((card) => (
                <PlayingCard key={card.name} category={category} {...card} />
              ))}
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function GameRules() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {GAME_RULES.map((group) => (
        <section key={group.title} className="surface-card p-5">
          <h3 className="font-display text-lg font-semibold">{group.title}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm">
            {group.rules.map((rule) => (
              <li key={rule} className={rule === TO_BE_UPDATED ? "italic text-muted-foreground" : ""}>
                {rule}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Physical card-game guide shared by the customer page and every dashboard. */
export function GameSupportContent({ audience: _audience }: { audience: Audience }) {
  const [tab, setTab] = useState<Tab>("how");
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gold/30 bg-ink p-6 text-center text-ink-foreground sm:p-8">
        <img src={logo} alt="" className="mx-auto h-12 w-auto" />
        <p className="mt-3 font-brand text-2xl font-bold text-gold sm:text-3xl">TABLE RUSH</p>
        <p className="text-sm text-ink-foreground/80">Physical Card Game</p>
        <p className="mt-2 text-xs text-ink-foreground/60">
          Gather around the table. Shuffle the deck. Play your cards.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                tab === t.key
                  ? "border-gold bg-gold text-ink"
                  : "border-gold/40 text-ink-foreground hover:border-gold hover:text-gold",
              )}
            >
              <t.icon className="size-4" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" aria-label={TABS.find((t) => t.key === tab)?.label}>
        {tab === "how" ? <HowToPlay /> : tab === "cards" ? <CardTypes /> : <GameRules />}
      </div>
      <p className="sr-only">{GAME_TAGLINE}</p>
    </div>
  );
}
