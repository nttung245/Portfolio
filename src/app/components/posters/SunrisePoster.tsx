import { useEffect, useId, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Compass, Sparkles, UserRound } from "lucide-react";
import { slotById } from "../../day";
import { objective, objectiveFocus, roles } from "../../content";
import { useOpener } from "../Card";
import { Chips, Detail, Eyebrow, Hero, Module } from "../Poster";

const slot = slotById.sunrise;

// The sun's path across the day, as the Weather app draws it: bright above the horizon, faint
// below it. Its ends sit at Sunrise and Sunset, the day's own Time slots.
const PATH = "M 0 132 C 70 132, 120 18, 200 18 C 280 18, 330 132, 400 132";
const HORIZON = 96;

// Objective's Motif: the sun climbs the path from the dark and stops just clear of the horizon,
// where the Day clock says 06:30.
function SunPath() {
  const reduceMotion = useReducedMotion();
  const box = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const sun = useRef<SVGGElement>(null);
  const start = useOpener(box, 0.5);
  const ids = useId();

  useEffect(() => {
    const line = path.current;
    const dot = sun.current;
    if (!line || !dot) return;
    const total = line.getTotalLength();
    // The first point on the rising side that clears the horizon.
    let rise = 0;
    while (rise < total / 2 && line.getPointAtLength(rise).y > HORIZON - 6) rise += 1;
    const place = (length: number) => {
      const point = line.getPointAtLength(length);
      dot.setAttribute("transform", `translate(${point.x} ${point.y})`);
    };
    if (!start || reduceMotion) {
      place(start || reduceMotion ? rise : 0);
      return;
    }
    const control = animate(0, rise, { duration: 2.2, ease: [0.22, 1, 0.36, 1], onUpdate: place });
    return () => control.stop();
  }, [start, reduceMotion]);

  return (
    <div>
      <svg ref={box} aria-hidden="true" viewBox="0 0 400 150" className="w-full overflow-visible">
        <defs>
          <clipPath id={`${ids}-day`}>
            <rect x="-20" y="-40" width="440" height={HORIZON + 40} />
          </clipPath>
          <clipPath id={`${ids}-night`}>
            <rect x="-20" y={HORIZON} width="440" height="100" />
          </clipPath>
          <radialGradient id={`${ids}-glow`}>
            <stop offset="0" stopColor="#FFE2A8" stopOpacity="0.75" />
            <stop offset="1" stopColor="#FFE2A8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path ref={path} d={PATH} fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#${ids}-day)`} />
        <path d={PATH} fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" clipPath={`url(#${ids}-night)`} />
        <line x1="0" x2="400" y1={HORIZON} y2={HORIZON} stroke="white" strokeOpacity="0.35" strokeWidth="1" />
        <g ref={sun} transform="translate(0 132)">
          <circle r="30" fill={`url(#${ids}-glow)`} />
          <circle r="7" fill="#FFF6DA" />
        </g>
      </svg>
      <div className="mt-3 flex justify-between text-subhead">
        <p>
          <span className="block text-ink/65">Sunrise</span>
          <span className="font-semibold tabular-nums">{slot.time}</span>
        </p>
        <p className="text-right">
          <span className="block text-ink/65">Sunset</span>
          <span className="font-semibold tabular-nums">{slotById.sunset.time}</span>
        </p>
      </div>
    </div>
  );
}

export function SunriseHero() {
  return (
    <Hero slot={slot}>
      <Eyebrow>Objective</Eyebrow>
      <div className="mt-8 w-full max-w-xl self-center md:mt-10">
        <SunPath />
      </div>
      <div className="mt-auto">
        <h2 className="hand lift text-[clamp(72px,18vw,204px)] leading-[0.85] md:text-[clamp(92px,11.5vw,192px)]">
          {roles.map((role) => (
            <span key={role} className="block">
              {role}.
            </span>
          ))}
        </h2>
        <p className="lift mt-5 max-w-xl text-[clamp(17px,1.6vw,20px)] leading-[1.45] text-ink/90">{objective[0]}</p>
      </div>
    </Hero>
  );
}

export function SunriseDetail() {
  return (
    <Detail>
      <Module title="About me" icon={UserRound} index={0}>
        <p className="text-[19px] leading-[1.5] tracking-[-0.015em]">{objective[0]}</p>
      </Module>
      <Module title="Looking for" icon={Compass} index={1}>
        <p className="text-[19px] leading-[1.5] tracking-[-0.015em]">{objective[1]}</p>
      </Module>
      <Module title="Focus" icon={Sparkles} index={2}>
        <Chips items={objectiveFocus} />
      </Module>
    </Detail>
  );
}
