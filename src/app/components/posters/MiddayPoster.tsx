import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { slotById } from "../../day";
import { experiences, headlineStat, type Experience } from "../../content";
import { useOpener } from "../Card";
import { Chips, Detail, Eyebrow, Hero, Module } from "../Poster";

const slot = slotById.midday;
const [current, alongside] = experiences;

// An Activity ring, as in Apple Fitness: it closes to the headline share while the number counts
// up with it, on one curve, so the two never drift apart.
function Ring({ value, start }: { value: number; start: boolean }) {
  const reduceMotion = useReducedMotion();
  const number = useRef<HTMLSpanElement>(null);
  const progress = useMotionValue(reduceMotion ? value : 0);
  const length = useTransform(progress, (count) => count / 100);
  const shown = useTransform(progress, (count) => (count > 0.2 ? 1 : 0));
  const gradient = useId();

  useEffect(() => {
    if (!start) return;
    const write = (count: number) => {
      if (number.current) number.current.textContent = String(Math.round(count));
    };
    if (reduceMotion) {
      progress.set(value);
      write(value);
      return;
    }
    const control = animate(progress, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    return () => control.stop();
  }, [start, reduceMotion, value, progress]);

  return (
    <div className="relative aspect-square w-[min(66vw,40vh)] shrink-0 md:w-[min(30vw,50vh)]">
      <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFE58F" />
            <stop offset="1" stopColor="#FFA93A" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="84" fill="none" stroke="rgb(255 255 255 / 0.16)" strokeWidth="20" />
        <m.circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke={`url(#${gradient})`}
          strokeWidth="20"
          strokeLinecap="round"
          style={{ pathLength: length, opacity: shown }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-[clamp(52px,15vw,120px)] font-extrabold leading-none tracking-[-0.05em] tabular-nums md:text-[clamp(64px,7vw,128px)]">
          <span ref={number}>{reduceMotion ? value : 0}</span>
          <span className="text-[0.5em] tracking-[-0.02em]">%</span>
        </p>
        <p className="mt-1 text-subhead font-medium text-ink/75">{headlineStat.unit}</p>
      </div>
    </div>
  );
}

export function MiddayHero() {
  const stage = useRef<HTMLDivElement>(null);
  const start = useOpener(stage, 0.4);

  return (
    <Hero slot={slot}>
      <Eyebrow>Experience</Eyebrow>
      <div
        ref={stage}
        className="flex flex-1 flex-col items-center justify-center gap-8 md:flex-row md:justify-center md:gap-[6vw]"
      >
        <Ring value={headlineStat.value} start={start} />
        <div className="max-w-md text-center md:text-left">
          <p className="sr-only">{headlineStat.caption}</p>
          <p aria-hidden="true" className="lift text-[clamp(22px,2.5vw,34px)] font-bold leading-[1.15] tracking-[-0.025em]">
            {headlineStat.headline}
          </p>
          <p className="mt-4 text-body font-medium text-ink/80">
            {current.role} · {current.company}
          </p>
          <p className="mt-0.5 text-subhead text-ink/60">
            Also {alongside.role} at {alongside.company}
          </p>
        </div>
      </div>
    </Hero>
  );
}

function Point({ children }: { children: string }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-accent" />
      <span>{children}</span>
    </li>
  );
}

function Job({ job, index }: { job: Experience; index: number }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <Module index={index}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-[22px] font-bold tracking-[-0.02em]">{job.company}</h3>
        <p className="text-subhead text-ink/60">{job.period}</p>
      </div>
      <p className="mt-0.5 text-body text-ink/75">{job.role}</p>

      <div id={listId} className="mt-5 text-body text-ink/90">
        <ul className="space-y-3">
          {job.highlights.map((point) => (
            <Point key={point}>{point}</Point>
          ))}
        </ul>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              key="more"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, visualDuration: 0.4 }}
              className="overflow-hidden"
            >
              <ul className="space-y-3 pt-3">
                {job.more.map((point) => (
                  <Point key={point}>{point}</Point>
                ))}
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {job.more.length > 0 && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((value) => !value)}
          className="press mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink/14 py-2 pl-4 pr-3 text-subhead font-semibold hover:bg-ink/20"
        >
          {open ? "Show less" : `Show ${job.more.length} more`}
          <ChevronDown
            aria-hidden="true"
            className={`size-4 transition-transform duration-500 ease-spring ${open ? "rotate-180" : ""}`}
            strokeWidth={2.6}
          />
        </button>
      )}

      <div className="mt-5 border-t border-ink/12 pt-4">
        <Chips items={job.tech} />
      </div>
    </Module>
  );
}

export function MiddayDetail() {
  return (
    <Detail>
      {experiences.map((job, index) => (
        <Job key={job.company} job={job} index={index} />
      ))}
    </Detail>
  );
}
