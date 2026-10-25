import type { CSSProperties } from "react";
import { slotById } from "../../day";
import { composeLinks, profile } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.twilight;

// The constellation traces the TN monogram; the loose stars around it are scenery.
const constellation = [
  "120,112 250,98 382,114",
  "250,98 258,262 268,432",
  "560,440 575,252 590,110 700,272 812,432 826,270 840,106",
];

const stars: Array<[x: number, y: number, r: number, delay: number]> = [
  [120, 112, 4, 0.2],
  [250, 98, 5, 0],
  [382, 114, 4, 0.4],
  [258, 262, 3, 0.8],
  [268, 432, 4.5, 1.1],
  [560, 440, 4, 1.4],
  [575, 252, 3, 1.6],
  [590, 110, 5, 1.8],
  [700, 272, 3, 2.1],
  [812, 432, 4.5, 2.3],
  [826, 270, 3, 2.5],
  [840, 106, 4, 2.7],
  [60, 300, 1.8, 0.6],
  [420, 330, 1.5, 1.3],
  [470, 60, 2, 0.9],
  [680, 64, 1.6, 2],
  [930, 210, 2.2, 1.5],
  [904, 478, 1.6, 2.9],
  [360, 508, 1.8, 0.3],
  [140, 470, 1.5, 2.4],
  [980, 52, 1.4, 1.7],
  [700, 512, 2, 3.1],
];

export function TwilightPoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} />

      <svg aria-hidden="true" viewBox="0 0 1000 560" className="motif mt-8 w-full max-w-3xl self-end overflow-visible">
        {constellation.map((points) => (
          <polyline
            key={points}
            points={points}
            pathLength={1}
            className="star-line fill-none stroke-accent"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}
        {stars.map(([x, y, r, delay]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="star fill-current" style={{ "--d": delay } as CSSProperties} />
        ))}
      </svg>

      <div className="mt-auto pt-10">
        <p className="font-display text-[length:min(11vw,9rem)] font-thin uppercase leading-[0.9] [font-stretch:125%]">
          Let's talk
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block font-display text-[length:min(5.4vw,3rem)] font-medium [font-stretch:82%] [overflow-wrap:anywhere] underline decoration-accent decoration-2 underline-offset-8"
        >
          {profile.email}
        </a>
        <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
          {composeLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/40 px-4 py-2.5 transition-colors hover:border-ink hover:bg-ink hover:text-sky"
            >
              Compose in {link.label}
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-ink/20 pt-5 font-mono text-[11px] uppercase tracking-[0.2em]">
          <ul className="flex gap-6">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-accent">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
                LinkedIn
              </a>
            </li>
          </ul>
          <p className="opacity-70">{profile.location}</p>
        </div>
      </div>
    </Poster>
  );
}
