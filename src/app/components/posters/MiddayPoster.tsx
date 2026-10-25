import { useEffect, useId, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { experiences, headlineStat, type Experience } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.midday;
const tickerItems = [...new Set(experiences.flatMap((job) => job.tech))];

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;

    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = String(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to]);

  return <span ref={ref}>{to}</span>;
}

function Job({ job }: { job: Experience }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const points = open ? [...job.highlights, ...job.more] : job.highlights;

  return (
    <article className="mt-14 border-t-2 border-ink pt-4">
      <h3 className="font-display text-[length:min(11vw,9.5rem)] font-black uppercase leading-[0.84] [font-stretch:62%]">
        {job.company}
      </h3>
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
    <div aria-hidden="true" className="motif -mx-4 mt-16 overflow-hidden border-y-2 border-ink py-3 sm:-mx-8">
      <div className="ticker-track flex w-max font-display text-3xl font-extrabold uppercase [font-stretch:62%] md:text-5xl">
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
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} title="Work" />

      <div className="mt-8 grid items-end gap-6 md:grid-cols-[auto_minmax(0,24rem)] md:gap-10">
        <p
          aria-hidden="true"
          className="font-display text-[length:min(36vw,44vh)] font-black leading-[0.78] text-accent tabular-nums [font-stretch:62%]"
        >
          <CountUp to={headlineStat.value} />%
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
