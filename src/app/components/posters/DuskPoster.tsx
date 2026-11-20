import { useRef } from "react";
import { m, useReducedMotion } from "motion/react";
import { Award, CalendarRange, Gauge, GraduationCap } from "lucide-react";
import { slotById } from "../../day";
import { certifications, education } from "../../content";
import { useOpener } from "../Card";
import { Detail, Eyebrow, Hero, Module, Row, Stars } from "../Poster";

const slot = slotById.dusk;
const [first, last] = education.period.split(/\D+/).filter(Boolean).map(Number);
// Where today falls between the first and the last year of the degree.
const now = (() => {
  const start = new Date(first, 0, 1).getTime();
  const end = new Date(last + 1, 0, 1).getTime();
  return Math.min(Math.max((Date.now() - start) / (end - start), 0), 1);
})();

// Education's Motif, after the Weather app's ten-day bars: the years of the degree as one range,
// filling in to today.
function Years() {
  const bar = useRef<HTMLDivElement>(null);
  const start = useOpener(bar, 0.5);
  const reduceMotion = useReducedMotion();
  const shown = start || reduceMotion;
  const spring = { type: "spring", visualDuration: 1.1, bounce: 0.08, delay: 0.2 } as const;

  return (
    <div ref={bar} className="module px-5 pb-4 pt-8">
      <div className="flex items-center gap-4 text-body font-semibold tabular-nums">
        <span className="text-ink/60">{first}</span>
        <div className="relative h-1.5 flex-1 rounded-full bg-ink/18">
          <m.div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-linear-to-r from-[#9AA8FF] to-[#FF9C8A]"
            initial={false}
            animate={{ scaleX: shown ? now : 0 }}
            transition={spring}
          />
          <m.span
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_3px_rgb(16_20_52/0.6)]"
            initial={false}
            animate={{ left: shown ? `${now * 100}%` : "0%", opacity: shown ? 1 : 0 }}
            transition={spring}
          >
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink/75">
              Now
            </span>
          </m.span>
        </div>
        <span>{last}</span>
      </div>
    </div>
  );
}

export function DuskHero() {
  return (
    <Hero slot={slot}>
      <Stars seed={23} count={44} className="inset-x-0 top-0 -z-10 h-[60%]" />
      <Eyebrow>Education</Eyebrow>
      <div className="mt-auto">
        <h2 aria-label={education.school} className="text-[clamp(120px,36vw,300px)] font-extrabold leading-[0.82] tracking-[-0.06em] md:text-[clamp(140px,20vw,300px)]">
          {education.short}
        </h2>
        <p className="mt-4 max-w-xl text-[clamp(20px,2vw,26px)] font-semibold leading-tight tracking-[-0.02em]">{education.school}</p>
        <p className="mt-1.5 text-body text-ink/75">
          {education.degree} · GPA {education.gpa}
        </p>
        <div className="mt-6 max-w-xl">
          <Years />
        </div>
      </div>
    </Hero>
  );
}

export function DuskDetail() {
  return (
    <Detail>
      <Module title="Degree" icon={GraduationCap} index={0}>
        <ul>
          <Row icon={GraduationCap} label="Programme" value={education.degree} />
          <Row icon={CalendarRange} label="Years" value={education.period} />
          <Row icon={Gauge} label="GPA" value={education.gpa} />
        </ul>
      </Module>
      <Module title="Certifications" icon={Award} index={1}>
        <ul>
          {certifications.map((cert) => (
            <Row key={cert.name} icon={Award} label={cert.name} value={cert.year} />
          ))}
        </ul>
      </Module>
    </Detail>
  );
}
