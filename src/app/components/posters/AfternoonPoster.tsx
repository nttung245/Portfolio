import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight, Hammer, Moon, Play, Sun } from "lucide-react";
import { slotById } from "../../day";
import { playground, playgroundWorlds, type PlaygroundWorld } from "../../content";
import { Detail, Eyebrow, Hero, Module } from "../Poster";

const slot = slotById.afternoon;
const tag = "glass-dark absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold";

// Playground's Motif: each world drifts from its day render into its night one and back, the
// worlds a few seconds apart. Without motion they rest by day.
function DayNight({ world, index }: { world: PlaygroundWorld; index: number }) {
  return (
    <figure
      className="motif relative aspect-[8/5] overflow-hidden rounded-[22px] shadow-[0_24px_48px_-24px_rgb(0_0_0/0.55)]"
      style={{ "--offset": `${-index * 4}s` } as CSSProperties}
    >
      <img src={world.day} alt={world.dayAlt} width={1440} height={900} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <img
        src={world.night}
        alt=""
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        className="daynight-night absolute inset-0 h-full w-full object-cover"
      />
      <figcaption className={tag}>
        <span aria-hidden="true" className="relative size-3.5">
          <Sun className="daynight-day absolute inset-0 size-3.5" strokeWidth={2.4} />
          <Moon className="daynight-night absolute inset-0 size-3.5" strokeWidth={2.4} />
        </span>
        {world.name}
      </figcaption>
    </figure>
  );
}

export function AfternoonHero() {
  return (
    <Hero slot={slot}>
      <Eyebrow>Playground</Eyebrow>
      <h2 className="lift mt-4 text-[clamp(44px,8vw,112px)] font-extrabold leading-[0.92] tracking-[-0.045em]">{playground.title}</h2>
      <div className="mt-auto grid gap-3 sm:grid-cols-2 sm:gap-4">
        {playgroundWorlds.map((world, index) => (
          <DayNight key={world.name} world={world} index={index} />
        ))}
      </div>
    </Hero>
  );
}

// The world running in Agent Arena's embed mode. The Detail only exists while Playground is open,
// so a world only ever runs then: on desktop at once, on touch screens and under reduced motion
// after a tap. On touch screens an overlay keeps the Poster scrolling instead of turning the camera.
function LiveWorld({ world }: { world: PlaygroundWorld }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const reduceMotion = useReducedMotion();
  const [autoplay] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const load = requested || (autoplay && !reduceMotion);

  useEffect(() => {
    if (!load) return;
    const origin = new URL(world.live).origin;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "agent-arena:ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [load, world.live]);

  return (
    <div className="relative isolate mt-4 aspect-[8/5] overflow-hidden rounded-[18px] bg-black/30">
      <img src={world.day} alt={world.dayAlt} width={1440} height={900} decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      {load && (
        <iframe
          ref={frame}
          src={world.live}
          title={`${world.name}, running live in Agent Arena`}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />
      )}
      {ready && <div aria-hidden="true" className="absolute inset-0 hidden pointer-coarse:block" />}
      {ready ? (
        <span className={`pointer-events-none ${tag}`}>
          <span className="size-2 rounded-full bg-[#34C759]" />
          Live
        </span>
      ) : load ? (
        <span className={`pointer-events-none ${tag}`}>
          <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
          Loading live world…
        </span>
      ) : (
        <button type="button" onClick={() => setRequested(true)} className={`press ${tag}`}>
          <Play aria-hidden="true" className="size-3.5 fill-current" strokeWidth={0} />
          Run live
        </button>
      )}
    </div>
  );
}

// A world's facts ("135 props") as small Weather-style tiles: the number large, the unit below.
function Stats({ facts }: { facts: string[] }) {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {facts.map((fact) => {
        const [, count = fact, unit = ""] = fact.match(/^(\d+)\s+(.*)$/) ?? [];
        return (
          <li key={fact} className="rounded-2xl bg-ink/10 px-3.5 py-3">
            <p className="text-[26px] font-bold leading-none tracking-[-0.02em] tabular-nums">{count}</p>
            <p className="mt-1.5 text-subhead text-ink/65">{unit}</p>
          </li>
        );
      })}
    </ul>
  );
}

export function AfternoonDetail() {
  return (
    <Detail>
      {playgroundWorlds.map((world, index) => (
        <Module key={world.name} index={index}>
          <h3 className="text-[22px] font-bold tracking-[-0.02em]">{world.name}</h3>
          <LiveWorld world={world} />
          <p className="mt-4 text-body text-ink/90">{world.blurb}</p>
          <div className="mt-4">
            <Stats facts={world.facts} />
          </div>
        </Module>
      ))}
      <Module title="How they're made" icon={Hammer} index={playgroundWorlds.length}>
        <p className="text-body text-ink/90">{playground.intro}</p>
        <p className="mt-3 text-body text-ink/90">{playground.craft}</p>
        <ul className="mt-4 space-y-1 text-subhead text-ink/60">
          {playground.credits.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <a
          href={playground.project.href}
          target="_blank"
          rel="noreferrer"
          className="press mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink py-2.5 pl-4 pr-3.5 text-[15px] font-semibold text-[#14243d] hover:bg-ink/90"
        >
          {playground.project.label}
          <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
        </a>
      </Module>
    </Detail>
  );
}
