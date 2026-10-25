import type { CSSProperties } from "react";
import { motion, type Variants } from "motion/react";
import { slotById } from "../../day";
import { objective, profile, roles } from "../../content";
import { Poster, PosterHead } from "../Poster";

const slot = slotById.sunrise;
const avatar = new URL("../../../../my_picture/my_avatar.jpg", import.meta.url).href;

// Sunrise plays once, in order, then rests: the horizon draws out, the sun rises and its glow
// warms, the roles come up behind it, and the objective settles in last.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const horizon: Variants = {
  hidden: { scaleX: 0 },
  shown: { scaleX: 1, transition: { duration: 1.1, ease: EASE_OUT } },
};

const sun: Variants = {
  hidden: { y: "102%" },
  shown: { y: "6%", transition: { duration: 2.6, ease: EASE_OUT, delay: 0.15 } },
};

const halo: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  shown: { opacity: 1, scale: 1, transition: { duration: 2.8, ease: EASE_OUT, delay: 0.3 } },
};

const role: Variants = {
  hidden: { y: "105%" },
  shown: (index: number) => ({ y: 0, transition: { duration: 1, ease: EASE_OUT, delay: 1 + index * 0.12 } }),
};

const paragraph: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: (index: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay: 1.5 + index * 0.1 } }),
};

export function SunrisePoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} />

      <motion.div
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.35 }}
        className="mt-8 flex flex-1 flex-col"
        style={{ "--sun": "min(64vw, 52vh)" } as CSSProperties}
      >
        <div className="flex flex-1 flex-col justify-end">
          {/* Everything above the horizon line is clipped by it, so the sun and roles rise out of it. */}
          <div className="relative h-[calc(var(--sun)*1.3)] overflow-hidden">
            <motion.div variants={sun} className="absolute inset-x-0 bottom-0 mx-auto aspect-square h-[var(--sun)]">
              <motion.div variants={halo} aria-hidden="true" className="absolute -inset-[45%]">
                <div
                  className="halo motif h-full w-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgb(242 107 29 / 0.34) 0%, rgb(242 107 29 / 0.12) 38%, transparent 68%)",
                  }}
                />
              </motion.div>
              <div className="relative isolate h-full w-full overflow-hidden rounded-full bg-accent">
                <img
                  src={avatar}
                  alt={profile.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover grayscale contrast-125 mix-blend-multiply"
                />
              </div>
            </motion.div>

            <p
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 text-center font-display text-[length:min(9.5vw,12vh)] font-[850] uppercase leading-[0.9] text-sky [-webkit-text-stroke:2.5px_var(--ink)] [font-stretch:75%] [paint-order:stroke_fill]"
            >
              {roles.map((name, index) => (
                <span key={name} className="block overflow-hidden">
                  <motion.span variants={role} custom={index} className="block">
                    {name}
                  </motion.span>
                </span>
              ))}
            </p>
          </div>

          {/* The horizon catches the light right under the sun. */}
          <motion.div
            variants={horizon}
            aria-hidden="true"
            className="h-0.5 origin-center"
            style={{
              background: "linear-gradient(90deg, var(--ink) 0%, var(--ink) 32%, var(--accent) 50%, var(--ink) 68%, var(--ink) 100%)",
            }}
          />
        </div>

        <div className="mt-8 grid gap-4 font-mono text-[14px] leading-7 md:grid-cols-2 md:gap-10">
          {objective.map((line, index) => (
            <motion.p key={line} variants={paragraph} custom={index}>
              {line}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </Poster>
  );
}
