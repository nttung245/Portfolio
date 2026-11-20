import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { slotById } from "../../day";
import { playground, playgroundWorlds, type PlaygroundWorld } from "../../content";
import { Poster, PosterHead } from "../Poster";
import { Reveal } from "../Reveal";

const slot = slotById.afternoon;
const lineTag = "glass-dark absolute top-3 rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold leading-none";

// Afternoon's Motif is nightfall: a terminator line sweeps each world from its day render to
// its night one and back, the same day the visitor scrolls through. The static frame holds the
// line at the centre, so both renders still show. It plays until the live world is ready.
function Nightfall({ world, delay }: { world: PlaygroundWorld; delay: number }) {
  return (
    <div className="nightfall motif absolute inset-0" style={{ "--nightfall-delay": `${delay}s` } as CSSProperties}>
      <img
        src={world.day}
        alt={world.dayAlt}
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={world.night}
        alt={world.nightAlt}
        width={1440}
        height={900}
        loading="lazy"
        decoding="async"
        className="nightfall-night absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="nightfall-line absolute inset-y-0 w-0.5 -translate-x-1/2 shadow-[0_0_12px_2px_rgb(242_196_107/0.55)]"
        style={{ background: slot.sky }}
      >
        <span className={`right-full mr-2 ${lineTag}`}>Day</span>
        <span className={`left-full ml-2 ${lineTag}`}>Night</span>
      </div>
    </div>
  );
}

// Controls over a world are smoked glass, as on the iOS camera.
const tag = "glass-dark absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-sans text-[13px] font-semibold tracking-[-0.01em]";

// The world itself, running in Agent Arena's embed mode. On desktop it loads as it nears the
// screen; on touch screens and under reduced motion it waits for a tap, and on touch screens an
// overlay keeps the page scrolling instead of turning the camera.
function LiveWorld({ world, delay }: { world: PlaygroundWorld; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const near = useInView(ref, { once: true, margin: "0px 0px 400px 0px" });
  const reduceMotion = useReducedMotion();
  const [autoplay] = useState(() => window.matchMedia("(pointer: fine)").matches);
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const load = requested || (near && autoplay && !reduceMotion);

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
    <div
      ref={ref}
      className="relative isolate mt-5 aspect-[8/5] overflow-hidden rounded-[28px] bg-ink shadow-[0_32px_64px_-32px_rgb(30_20_6/0.6)] ring-1 ring-ink/10"
    >
      <Nightfall world={world} delay={delay} />
      {load && (
        <iframe
          ref={frame}
          src={world.live}
          title={`${world.name}, running live in Agent Arena`}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ${
            ready ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}
      {ready && <div aria-hidden="true" className="absolute inset-0 hidden pointer-coarse:block" />}
      {ready ? (
        <span className={`pointer-events-none ${tag}`}>
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#34C759] opacity-60 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-[#34C759]" />
          </span>
          Live
        </span>
      ) : (
        !load && (
          <button type="button" onClick={() => setRequested(true)} className={`press hover:bg-[rgb(18_18_22/0.6)] ${tag}`}>
            <Play aria-hidden="true" className="size-3.5 fill-current" strokeWidth={0} />
            Run live
          </button>
        )
      )}
      {load && !ready && (
        <span className={`pointer-events-none ${tag}`}>
          <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />
          Loading live world…
        </span>
      )}
    </div>
  );
}

function World({ world, delay, index }: { world: PlaygroundWorld; delay: number; index: number }) {
  return (
    <Reveal delay={index * 0.12} className="border-t-2 border-ink pt-4">
      <h3 className="font-display text-[length:min(17vw,7rem)] font-black uppercase leading-[0.82] [font-stretch:62%] md:text-[length:min(7.6vw,8.5rem)]">
        {world.name}
      </h3>
      <LiveWorld world={world} delay={delay} />
      <p className="mt-5 font-sans text-body">{world.blurb}</p>
      <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
        {world.facts.map((fact) => (
          <li key={fact} className="flex items-center gap-2 rounded-full bg-ink/[0.08] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {fact}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function AfternoonPoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} />

      <Reveal className="mt-10 max-w-2xl font-sans text-body md:text-[17px]">
        <p>{playground.intro}</p>
        <a
          href={playground.project.href}
          target="_blank"
          rel="noreferrer"
          className="press mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink py-2.5 pl-4 pr-3.5 text-[15px] font-semibold tracking-[-0.01em] hover:opacity-85"
          style={{ color: slot.sky }}
        >
          {playground.project.label}
          <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2.4} />
        </a>
      </Reveal>

      <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
        {/* Later worlds start first, so the line crosses the row from right to left. */}
        {playgroundWorlds.map((world, index) => (
          <World key={world.name} world={world} index={index} delay={(playgroundWorlds.length - 1 - index) * 0.9} />
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-ink/25 pt-5 md:flex-row md:items-start md:justify-between md:gap-10">
        <p className="max-w-xl font-sans text-subhead">{playground.craft}</p>
        <ul className="font-mono text-[11px] uppercase leading-5 tracking-[0.2em] opacity-75 md:text-right">
          {playground.credits.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </Poster>
  );
}
