import type { CSSProperties } from "react";
import { slotById } from "../../day";
import { skillGroups } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.sunset;

// A long shadow cast to the right by a low sun: stacked offsets whose length follows --shadow-len.
function longShadow(layers: number) {
  const length = 0.75;
  return Array.from({ length: layers }, (_, layer) => {
    const step = ((layer + 1) * length) / layers;
    return `calc(var(--shadow-len) * ${step.toFixed(3)}em) calc(var(--shadow-len) * ${(step * 0.36).toFixed(3)}em) 0 var(--shade)`;
  }).join(", ");
}

const shadows = { "--long-shadow": longShadow(36), "--long-shadow-sm": longShadow(12) };

export function SunsetPoster() {
  return (
    <Poster slot={slot} style={{ "--shade": "#A13C17" } as CSSProperties}>
      <PosterHead slot={slot} title="Skills" />

      <ul className="motif mt-12 flex flex-1 flex-col justify-center gap-7 md:gap-5">
        {skillGroups.map((group, index) => (
          <li
            key={group.name}
            className="grid items-end gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
          >
            <span
              aria-hidden="true"
              className="sunset-word block whitespace-nowrap font-display text-[length:min(10vw,6.5rem)] font-extrabold uppercase leading-[0.9]"
              style={{ "--i": index, ...shadows } as CSSProperties}
            >
              {group.name}
            </span>
            <p className="font-mono text-[13px] leading-6">
              <span className="sr-only">{group.name}: </span>
              {group.items.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </Poster>
  );
}
