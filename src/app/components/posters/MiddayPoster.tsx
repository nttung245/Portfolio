import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { experiences, headlineStat, type Experience } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.midday;
const tickerItems = [...new Set(experiences.flatMap((job) => job.tech))];

// Midday borrows from PUMA's "Forever Faster" sequence: heavy italics, paper grain,
// and choppy motion that steps like hand-drawn animation on twos.

const IMPACT_ANGLES = [-162, -144, -126, -108, -90, -72, -54, -36, -18];

function CountUp({ to, onDone }: { to: number; onDone: () => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;

    const begin = performance.now();
    node.textContent = "0";
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - begin) / 1100);
      node.textContent = String(Math.round(to * (1 - (1 - progress) ** 3)));
      if (progress === 1) {
        window.clearInterval(timer);
        done.current();
      }
    }, 83);
    return () => window.clearInterval(timer);
  }, [inView, reduceMotion, to]);

  return <span ref={ref}>{to}</span>;
}

// Short dashes that burst out above the number when the count lands.
function Impact() {
  return (
    <svg aria-hidden="true" viewBox="-100 -100 200 100" className="impact absolute bottom-[0.6em] left-[0.1em] w-[0.55em] overflow-visible">
      {IMPACT_ANGLES.map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={Math.cos(radians) * 46}
            y1={Math.sin(radians) * 46}
            x2={Math.cos(radians) * 92}
            y2={Math.sin(radians) * 92}
            pathLength={1}
            className="stroke-accent"
            strokeWidth="6"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function SlamHeading({ children }: { children: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <h3
      ref={ref}
      className={`slam motif font-display text-[length:min(11vw,9.5rem)] font-black uppercase italic leading-[0.84] [font-stretch:62%] ${
        inView ? "is-in" : ""
      }`}
    >
      {children}
    </h3>
  );
}

function Job({ job }: { job: Experience }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const points = open ? [...job.highlights, ...job.more] : job.highlights;

  return (
    <article className="mt-14 border-t-2 border-ink pt-4">
      <SlamHeading>{job.company}</SlamHeading>
      <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.2em]">
        {job.role} · {job.period}
      </p>
      <ul id={listId} className="mt-6 grid gap-x-8 gap-y-5 font-mono text-[14px] leading-6 md:grid-cols-3">
        {points.map((point) => (
          <li key={point} className="border-l-2 border-accent pl-3">
            {point}
          </li>
        ))}
      </ul>
      {job.more.length > 0 && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="mt-6 font-mono text-[12px] uppercase tracking-[0.2em] underline decoration-accent decoration-2 underline-offset-[6px]"
        >
          {open ? "Show less" : `Show ${job.more.length} more`}
        </button>
      )}
    </article>
  );
}

function Ticker({ items }: { items: string[] }) {
  return (
    <div aria-hidden="true" className="motif -mx-4 mt-16 overflow-hidden bg-ink py-3 sm:-mx-8" style={{ color: slot.sky }}>
      <div className="ticker-track flex w-max font-display text-3xl font-extrabold uppercase italic [font-stretch:62%] md:text-5xl">
        {[0, 1].map((copy) =>
          items.map((item) => (
            <span key={`${copy}-${item}`} className="flex items-center gap-6 pr-6">
              {item}
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export function MiddayPoster() {
  const [impacts, setImpacts] = useState(0);

  return (
    <Poster slot={slot}>
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 z-20" />
      <PosterHead slot={slot} />

      <div className="mt-16 grid items-end gap-6 md:grid-cols-[auto_minmax(0,24rem)] md:gap-10">
        <p
          aria-hidden="true"
          className="relative font-display text-[length:min(36vw,44vh)] font-black italic leading-[0.78] text-accent tabular-nums [font-stretch:62%]"
        >
          {impacts > 0 && <Impact key={impacts} />}
          <CountUp to={headlineStat.value} onDone={() => setImpacts((count) => count + 1)} />%
        </p>
        <p className="font-mono text-[14px] leading-6">
          <span className="sr-only">{headlineStat.value}%: </span>
          {headlineStat.caption}
        </p>
      </div>

      {experiences.map((job) => (
        <Job key={job.company} job={job} />
      ))}

      <Ticker items={tickerItems} />
    </Poster>
  );
}
