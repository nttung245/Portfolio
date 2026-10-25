import type { CSSProperties } from "react";
import { seeded } from "../random";

type StarFieldProps = {
  seed: number;
  count: number;
  className?: string;
};

// Twinkling stars at fixed pixel sizes, so they stay round on any screen shape.
export function StarField({ seed, count, className = "" }: StarFieldProps) {
  const random = seeded(seed);
  const stars = Array.from({ length: count }, () => {
    const bright = random() < 0.12;
    return {
      left: random() * 100,
      top: random() * 100,
      size: bright ? 2 + random() * 1.5 : 1 + random() * 0.8,
      bright,
      delay: random() * 5,
      duration: 2.2 + random() * 3.4,
    };
  });

  return (
    <div aria-hidden="true" className={`motif pointer-events-none absolute ${className}`}>
      {stars.map((star, index) => (
        <span
          key={index}
          className={`twinkle absolute rounded-full bg-current ${star.bright ? "shadow-[0_0_6px_1px_currentColor]" : ""}`}
          style={
            {
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              "--d": star.delay,
              "--t": star.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
