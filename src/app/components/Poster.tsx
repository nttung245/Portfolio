import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInView } from "motion/react";
import type { TimeSlot } from "../day";

type PosterProps = {
  slot: TimeSlot;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function Poster({ slot, className = "", style, children }: PosterProps) {
  const ref = useRef<HTMLElement>(null);
  const live = useInView(ref, { amount: 0.1 });

  return (
    <section
      ref={ref}
      id={slot.id}
      aria-label={slot.topic}
      data-live={live ? "" : undefined}
      className={`poster relative isolate flex min-h-svh flex-col overflow-x-clip px-4 pb-28 pt-20 text-ink sm:px-8 ${className}`}
      style={{ "--ink": slot.ink, "--accent": slot.accent, ...style } as CSSProperties}
    >
      {children}
    </section>
  );
}

type PosterHeadProps = {
  slot: TimeSlot;
  detail?: string;
  heading?: boolean;
};

// The micro-type row at the top of every Poster: just its Topic, with an optional detail on the right.
// Time slots are never named on screen; the Sky and the Day clock carry the time of day.
export function PosterHead({ slot, detail, heading = true }: PosterHeadProps) {
  const Title = heading ? "h2" : "p";

  return (
    <header className="flex items-baseline justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
      <Title>{slot.topic}</Title>
      {detail && <p className="text-right opacity-70">{detail}</p>}
    </header>
  );
}
