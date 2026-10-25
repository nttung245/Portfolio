import type { CSSProperties } from "react";

type StaticNoiseProps = {
  on: boolean;
  period?: string;
};

// Bursts of scanlines and film grain over a Poster, timed with its glitching text.
export function StaticNoise({ on, period = "6.4s" }: StaticNoiseProps) {
  return (
    <div
      aria-hidden="true"
      className={`static-noise motif pointer-events-none absolute inset-0 z-20 ${on ? "is-on" : ""}`}
      style={{ "--noise-period": period } as CSSProperties}
    />
  );
}
