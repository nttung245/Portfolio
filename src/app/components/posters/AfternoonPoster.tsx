import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { playground, playgroundWorlds, type PlaygroundWorld } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.afternoon;

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
        <span className="absolute right-full top-3 mr-2 bg-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: slot.sky }}>
          Day
        </span>
        <span className="absolute left-full top-3 ml-2 bg-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: slot.sky }}>
          Night
        </span>
      </div>
    </div>
  );
}

const tag = "bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em]";

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
    <div ref={ref} className="relative mt-5 aspect-[8/5] overflow-hidden bg-ink">
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
        <span className={`pointer-events-none absolute bottom-3 left-3 ${tag}`} style={{ color: slot.sky }}>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#5BE38A] align-middle" />
          Live
        </span>
      ) : (
        !load && (
          <button
            type="button"
            onClick={() => setRequested(true)}
            className={`absolute bottom-3 left-3 border border-current transition-colors hover:bg-transparent ${tag}`}
            style={{ color: slot.sky }}
          >
            ▶ Run live
          </button>
        )
      )}
      {load && !ready && (
        <span className={`pointer-events-none absolute bottom-3 left-3 animate-pulse ${tag}`} style={{ color: slot.sky }}>
          Loading live world…
        </span>
      )}
    </div>
  );
}

function World({ world, delay }: { world: PlaygroundWorld; delay: number }) {
  return (
    <article className="border-t-2 border-ink pt-4">
      <h3 className="font-display text-[length:min(17vw,7rem)] font-black uppercase leading-[0.82] [font-stretch:62%] md:text-[length:min(7.6vw,8.5rem)]">
        {world.name}
      </h3>
      <LiveWorld world={world} delay={delay} />
      <p className="mt-5 font-mono text-[14px] leading-6">{world.blurb}</p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
        {world.facts.map((fact) => (
          <li key={fact} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {fact}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function AfternoonPoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} />

      <div className="mt-10 max-w-2xl font-mono text-[14px] leading-6">
        <p>{playground.intro}</p>
        <a
          href={playground.project.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-[12px] uppercase tracking-[0.2em] underline decoration-accent decoration-2 underline-offset-[6px]"
        >
          {playground.project.label} ↗
        </a>
      </div>

      <div className="mt-12 grid gap-14 md:grid-cols-2 md:gap-10">
        {/* Later worlds start first, so the line crosses the row from right to left. */}
        {playgroundWorlds.map((world, index) => (
          <World key={world.name} world={world} delay={(playgroundWorlds.length - 1 - index) * 0.9} />
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-3 border-t border-ink/25 pt-5 font-mono md:flex-row md:items-start md:justify-between md:gap-10">
        <p className="max-w-xl text-[13px] leading-6">{playground.craft}</p>
        <ul className="text-[11px] uppercase leading-5 tracking-[0.2em] opacity-75 md:text-right">
          {playground.credits.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </Poster>
  );
}
