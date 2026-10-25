import type { CSSProperties } from "react";
import { slotById } from "../../day";
import { profile } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.dawn;

function BreathingLine({ text, offset }: { text: string; offset: number }) {
  return (
    <span aria-hidden="true" className="block whitespace-nowrap">
      {[...text].map((char, index) => (
        <span key={index} className="dawn-letter" style={{ "--i": offset + index } as CSSProperties}>
          {char}
        </span>
      ))}
    </span>
  );
}

export function DawnPoster() {
  const [first, last] = profile.name.split(" ");

  return (
    <Poster slot={slot} className="justify-between">
      <PosterHead slot={slot} title={profile.coordinates} heading={false} />

      <h1
        aria-label={profile.name}
        className="motif my-10 font-display text-[length:18vw] uppercase leading-[0.84] [--stretch-max:100%] md:text-[length:min(15.5vw,25vh)] md:[--stretch-max:125%]"
      >
        <BreathingLine text={first} offset={0} />
        <BreathingLine text={last} offset={first.length} />
      </h1>

      <div className="flex flex-col gap-5">
        <div aria-hidden="true" className="relative h-px bg-accent">
          <span className="absolute bottom-0 left-1/2 h-5 w-10 -translate-x-1/2 rounded-t-full bg-accent" />
        </div>
        <p className="flex flex-wrap justify-between gap-x-8 gap-y-1 font-mono text-[12px] uppercase tracking-[0.2em]">
          <span>{profile.role}</span>
          <span className="opacity-70">{profile.location}</span>
        </p>
      </div>
    </Poster>
  );
}
