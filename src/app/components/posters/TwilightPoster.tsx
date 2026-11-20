import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Github, Linkedin, Send } from "lucide-react";
import { slotById } from "../../day";
import { composeLinks, profile } from "../../content";
import { Poster, PosterHead } from "../Poster";
import { Reveal } from "../Reveal";

const slot = slotById.twilight;

// The constellation traces the TN monogram; the loose stars around it are scenery.
const constellation = [
  "120,112 250,98 382,114",
  "250,98 258,262 268,432",
  "560,440 575,252 590,110 700,272 812,432 826,270 840,106",
];

const stars: Array<[x: number, y: number, r: number, delay: number]> = [
  [120, 112, 4, 0.2],
  [250, 98, 5, 0],
  [382, 114, 4, 0.4],
  [258, 262, 3, 0.8],
  [268, 432, 4.5, 1.1],
  [560, 440, 4, 1.4],
  [575, 252, 3, 1.6],
  [590, 110, 5, 1.8],
  [700, 272, 3, 2.1],
  [812, 432, 4.5, 2.3],
  [826, 270, 3, 2.5],
  [840, 106, 4, 2.7],
  [60, 300, 1.8, 0.6],
  [420, 330, 1.5, 1.3],
  [470, 60, 2, 0.9],
  [680, 64, 1.6, 2],
  [930, 210, 2.2, 1.5],
  [904, 478, 1.6, 2.9],
  [360, 508, 1.8, 0.3],
  [140, 470, 1.5, 2.4],
  [980, 52, 1.4, 1.7],
  [700, 512, 2, 3.1],
];

// Copies the address and says so for a moment, the way iOS confirms a copy.
function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(profile.email).then(() => setCopied(true))}
      className={`${button} bg-ink/10 hover:bg-ink/15`}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? "copied" : "copy"}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(4px)" }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.45 }}
          className="inline-flex items-center gap-2"
        >
          {copied ? <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={2.6} /> : <Copy aria-hidden="true" className="size-4" strokeWidth={2.2} />}
          {copied ? "Copied" : "Copy email"}
        </motion.span>
      </AnimatePresence>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </button>
  );
}

const button =
  "press inline-flex h-11 items-center gap-2 rounded-full px-5 font-sans text-[15px] font-semibold tracking-[-0.01em]";

export function TwilightPoster() {
  return (
    <Poster slot={slot}>
      <PosterHead slot={slot} />

      <svg aria-hidden="true" viewBox="0 0 1000 560" className="motif mt-8 w-full max-w-3xl self-end overflow-visible">
        {constellation.map((points) => (
          <polyline
            key={points}
            points={points}
            pathLength={1}
            className="star-line fill-none stroke-accent"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        ))}
        {stars.map(([x, y, r, delay]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="star fill-current" style={{ "--d": delay } as CSSProperties} />
        ))}
      </svg>

      <Reveal className="mt-auto pt-10">
        <p className="font-display text-[length:min(11vw,9rem)] font-thin uppercase leading-[0.9] [font-stretch:125%]">
          Let's talk
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block font-display text-[length:min(5.4vw,3rem)] font-medium [font-stretch:82%] [overflow-wrap:anywhere] underline decoration-accent decoration-2 underline-offset-8"
        >
          {profile.email}
        </a>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {composeLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`${button} ${index === 0 ? "bg-accent hover:opacity-90" : "bg-ink/10 hover:bg-ink/15"}`}
              style={index === 0 ? { color: slot.sky } : undefined}
            >
              {index === 0 && <Send aria-hidden="true" className="size-4" strokeWidth={2.2} />}
              Compose in {link.label}
            </a>
          ))}
          <CopyEmail />
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-5">
          <ul className="flex gap-2">
            {[
              { label: "GitHub", href: profile.github, Icon: Github },
              { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin },
            ].map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="press inline-flex h-10 items-center gap-2 rounded-full bg-ink/[0.07] px-4 font-sans text-[14px] font-medium hover:bg-ink/[0.13]"
                >
                  <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] opacity-70">{profile.location}</p>
        </div>
      </Reveal>
    </Poster>
  );
}
