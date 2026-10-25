import type { CSSProperties } from "react";
import { slotById } from "../../day";
import { certifications, education } from "../../content";
import { seeded } from "../../random";
import { Poster, PosterHead } from "../Poster";
import { StarField } from "../StarField";

const slot = slotById.dusk;
const RADIUS = 238;
const ringText = `${certifications.map((cert) => cert.ring).join("  ✦  ")}  ✦  `;

// Twilight's Sky, so the city silhouette runs straight into the next Poster.
const NIGHT = "#0B1020";

// A coastal city at dusk: a hill with a mast on the left, the city and one tall tower to the right.
const city = (() => {
  const random = seeded(19);
  const buildings: Array<{ x: number; width: number; height: number }> = [];
  for (let x = 430; x < 1440; ) {
    const width = 16 + random() * 34;
    buildings.push({ x, width, height: 34 + random() * 96 });
    x += width + random() * 5;
  }
  buildings.push({ x: 948, width: 44, height: 182 });

  const windows = buildings.flatMap(({ x, width, height }) =>
    Array.from({ length: Math.round((width * height) / 700) }, () => ({
      x: x + 3 + random() * (width - 9),
      y: 260 - height + 6 + random() * (height - 14),
      warm: random() < 0.72,
      delay: random() * 6,
      duration: 1.4 + random() * 4,
    })),
  );
  const hillLights = [60, 104, 150, 205, 252, 300, 348, 396, 446, 500].map((x) => ({
    x,
    y: 96 + ((x - 40) / 520) * 112 + 8 + random() * 16,
    delay: random() * 6,
  }));
  return { buildings, windows, hillLights };
})();

function Skyline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 260"
      preserveAspectRatio="xMidYMax slice"
      className="motif absolute inset-x-0 bottom-0 h-[clamp(150px,22vw,300px)] w-full"
    >
      <g fill={NIGHT}>
        <path d="M0,96 C110,70 230,78 330,118 C410,150 470,186 560,214 L560,260 L0,260 Z" />
        {city.buildings.map((building, index) => (
          <rect key={index} x={building.x} y={260 - building.height} width={building.width} height={building.height} />
        ))}
        <rect x="0" y="236" width="1440" height="24" />
      </g>
      <line x1="166" y1="82" x2="166" y2="34" stroke={NIGHT} strokeWidth="3" />
      <circle cx="166" cy="32" r="3.5" fill="#FF4A3D" className="beacon" />
      {city.windows.map((light, index) => (
        <rect
          key={index}
          x={light.x}
          y={light.y}
          width="3"
          height="4"
          fill={light.warm ? "#FFD38A" : "#CFE3FF"}
          className="twinkle"
          style={{ "--d": light.delay, "--t": light.duration } as CSSProperties}
        />
      ))}
      {city.hillLights.map((light, index) => (
        <circle
          key={index}
          cx={light.x}
          cy={light.y}
          r="1.8"
          fill="#FFD38A"
          className="twinkle"
          style={{ "--d": light.delay, "--t": 3 } as CSSProperties}
        />
      ))}
    </svg>
  );
}

export function DuskPoster() {
  return (
    <Poster slot={slot}>
      <StarField
        seed={23}
        count={34}
        className="inset-x-0 top-0 -z-10 h-[55%] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
      />
      {/* The evening star, first light of the night. */}
      <span
        aria-hidden="true"
        className="twinkle absolute left-[62%] top-[8%] -z-10 h-[5px] w-[5px] rounded-full bg-[#FFF6E0] shadow-[0_0_8px_3px_rgb(255_246_224/0.55),0_0_22px_8px_rgb(255_214_170/0.22)]"
        style={{ "--d": 0, "--t": 4 } as CSSProperties}
      />

      <PosterHead slot={slot} />

      <div className="mt-10 grid items-center gap-12 md:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[min(86vw,58vh)]">
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
            className="absolute inset-0 flex items-center justify-center font-display text-[length:min(21vw,14vh)] font-black leading-none [font-stretch:112%]"
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

      {/* The afterglow sits on the horizon, under the content, with the city in front of it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mx-4 -mb-28 mt-16 h-[clamp(280px,50vh,540px)] sm:-mx-8"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgb(108 72 124 / 0.5) 28%, rgb(196 96 108 / 0.82) 55%, #EE7038 76%, #D2481E 92%)",
        }}
      >
        <Skyline />
      </div>
    </Poster>
  );
}
