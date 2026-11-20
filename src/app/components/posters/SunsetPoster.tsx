import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { skillGroups } from "../../content";
import { useOpener } from "../Card";
import { Chips, Detail, Eyebrow, Hero, Module } from "../Poster";

const slot = slotById.sunset;
const toolCount = skillGroups.reduce((sum, group) => sum + group.items.length, 0);

// Skills' Motif: each stack rises into place from behind its own line, one after another, the
// way iOS sets text in motion.
export function SunsetHero() {
  const list = useRef<HTMLUListElement>(null);
  const start = useOpener(list, 0.3);
  const reduceMotion = useReducedMotion();
  const shown = start || reduceMotion;

  return (
    <Hero slot={slot}>
      <Eyebrow>Skills</Eyebrow>
      <div className="mt-auto">
        <ul ref={list} className="lift text-[clamp(46px,10.5vw,124px)] font-extrabold leading-[0.96] tracking-[-0.045em]">
          {skillGroups.map((group, index) => (
            <li key={group.name} className="-mb-[0.08em] overflow-hidden pb-[0.08em]">
              <m.span
                className="block"
                initial={false}
                animate={shown ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
                transition={{ type: "spring", visualDuration: 0.7, bounce: 0.1, delay: 0.09 * index }}
              >
                {group.name}
                <sup className="ml-2 align-super text-[0.26em] font-semibold tracking-normal text-ink/60">{group.items.length}</sup>
              </m.span>
            </li>
          ))}
        </ul>
        <p className="lift mt-6 text-[clamp(17px,1.6vw,20px)] text-ink/85">
          {toolCount} tools across {skillGroups.length} stacks.
        </p>
      </div>
    </Hero>
  );
}

export function SunsetDetail() {
  return (
    <Detail>
      {skillGroups.map((group, index) => (
        <Module key={group.name} index={index}>
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-[22px] font-bold tracking-[-0.02em]">{group.name}</h3>
            <p className="text-subhead text-ink/60">{group.items.length} tools</p>
          </div>
          <Chips items={group.items} />
        </Module>
      ))}
    </Detail>
  );
}
