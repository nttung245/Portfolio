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
      aria-label={slot.label}
      data-live={live ? "" : undefined}
      className={`poster relative flex min-h-svh flex-col overflow-x-clip px-4 pb-28 pt-20 text-ink sm:px-8 ${className}`}
      style={{ "--ink": slot.ink, "--accent": slot.accent, ...style } as CSSProperties}
    >
      {children}
    </section>
  );
}

type PosterHeadProps = {
  slot: TimeSlot;
  title: string;
  heading?: boolean;
};

// The micro-type row at the top of every Poster: the Time slot on the left, the topic on the right.
// The time itself lives in the Frame's Day clock.
export function PosterHead({ slot, title, heading = true }: PosterHeadProps) {
  const Title = heading ? "h2" : "p";

  return (
    <header className="flex items-baseline justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.2em]">
      <p className="flex items-baseline gap-3">
        <span>{slot.label}</span>
        <span className="text-[10px] normal-case tracking-[0.04em] opacity-70">{slot.vn}</span>
      </p>
      <Title className="text-right">{title}</Title>
    </header>
  );
}
