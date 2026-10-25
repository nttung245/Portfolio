import { slotById } from "../../day";
import { certifications, education } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.dusk;
const RADIUS = 238;
const ringText = `${certifications.map((cert) => cert.ring).join("  ✦  ")}  ✦  `;

export function DuskPoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} title="Education" />

      <div className="mt-10 grid flex-1 items-center gap-12 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[min(86vw,62vh)]">
          <svg aria-hidden="true" viewBox="0 0 600 600" className="motif absolute inset-0 h-full w-full">
            <defs>
              <path
                id="dusk-ring"
                d={`M 300,300 m -${RADIUS},0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 -${RADIUS * 2},0`}
              />
            </defs>
            <g className="orbit" style={{ transformOrigin: "300px 300px" }}>
              <text className="fill-current font-mono text-[15px] uppercase tracking-[0.1em]">
                <textPath href="#dusk-ring" textLength={2 * Math.PI * RADIUS} lengthAdjust="spacing">
                  {ringText}
                </textPath>
              </text>
            </g>
            <circle cx="300" cy="300" r="204" className="fill-none stroke-accent" strokeWidth="1.5" />
          </svg>
          <p
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-display text-[length:min(21vw,15vh)] font-black leading-none [font-stretch:112%]"
          >
            {education.short}
          </p>
        </div>

        <div className="flex flex-col gap-10 font-mono">
          <div>
            <h3 className="font-display text-3xl font-bold leading-tight [font-stretch:88%] md:text-5xl">
              {education.school}
            </h3>
            <p className="mt-4 text-[14px]">{education.degree}</p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.2em] opacity-75">
              {education.period} · GPA {education.gpa}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] opacity-75">Certifications</h3>
            <ul className="mt-4 divide-y divide-ink/20 border-y border-ink/20">
              {certifications.map((cert) => (
                <li key={cert.name} className="flex justify-between gap-6 py-3 text-[14px]">
                  <span>{cert.name}</span>
                  <span className="shrink-0 tabular-nums text-accent">{cert.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Poster>
  );
}
