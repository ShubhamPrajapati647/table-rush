import { Coffee, Pizza, Sandwich, Utensils, UtensilsCrossed, Leaf, CircleDot } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import logoSymbol from "@/assets/logo-symbol.png";

const SESSION_KEY = "table-rush-intro-seen";
const DURATION = 5000;

type Phase = "pending" | "playing" | "leaving" | "done";

const ORBIT = [
  { Icon: Sandwich, angle: 0, delay: 0 },
  { Icon: Pizza, angle: 60, delay: 0.05 },
  { Icon: Coffee, angle: 120, delay: 0.1 },
  { Icon: CircleDot, angle: 180, delay: 0.15 },
  { Icon: Utensils, angle: 240, delay: 0.2 },
  { Icon: Leaf, angle: 300, delay: 0.25 },
];

const FAN = [-24, -12, 12, 24];

function CardFace({ small = false }: { small?: boolean }) {
  return (
    <div className="tr-card-face">
      <span className="tr-corner tr-corner-tl" />
      <span className="tr-corner tr-corner-br" />
      {!small && (
        <>
          <span className="tr-pip tr-pip-tl">
            <UtensilsCrossed />
          </span>
          <span className="tr-pip tr-pip-br">
            <Coffee />
          </span>
        </>
      )}
      <div className="tr-card-center">
        <img className="tr-card-brand" src={logoSymbol} alt="TableRush" />
      </div>
    </div>
  );
}

/** 5-second card-game intro shown once per browser session before the homepage. */
export function IntroAnimation() {
  const [phase, setPhase] = useState<Phase>("pending");
  const [reduced, setReduced] = useState(false);

  const finish = useCallback(() => {
    setPhase("leaving");
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    window.setTimeout(() => setPhase("done"), 450);
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setPhase("done");
      return;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    setPhase("playing");
    const timer = window.setTimeout(finish, prefersReduced ? 1200 : DURATION);
    return () => window.clearTimeout(timer);
  }, [finish]);

  useEffect(() => {
    if (phase !== "playing") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`tr-intro ${phase === "leaving" ? "tr-intro-leave" : ""} ${reduced ? "tr-intro-reduced" : ""}`}
      role="dialog"
      aria-label="Table Rush intro"
    >
      {phase !== "pending" && (
        <>
          <div className="tr-glow" />
          <div className="tr-stage">
            {FAN.map((deg, i) => (
              <div
                key={deg}
                className="tr-card tr-fan"
                style={{ "--fan": `${deg}deg`, "--fan-x": `${deg * 3.2}px`, animationDelay: `${i * 0.04}s` } as React.CSSProperties}
              >
                <CardFace small />
              </div>
            ))}
            <div className="tr-trail tr-trail-a" />
            <div className="tr-trail tr-trail-b" />
            <div className="tr-card tr-main">
              <div className="tr-card-back" />
              <CardFace />
              <span className="tr-sweep" />
            </div>
            {ORBIT.map(({ Icon, angle, delay }) => (
              <span
                key={angle}
                className="tr-orbit"
                style={{ "--a": `${angle}deg`, animationDelay: `${delay}s` } as React.CSSProperties}
              >
                <span className="tr-orbit-icon">
                  <Icon />
                </span>
              </span>
            ))}
          </div>
          <div className="tr-title">
            <p className="tr-title-main">TABLE RUSH</p>
            <p className="tr-title-sub">Food • Games • Together</p>
          </div>
        </>
      )}
      <button type="button" className="tr-skip" onClick={finish}>
        Skip
      </button>
    </div>
  );
}
