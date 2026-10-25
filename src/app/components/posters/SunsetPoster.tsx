import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { skillGroups } from "../../content";
import { Poster, PosterHead } from "../Poster";
import { StaticNoise } from "../StaticNoise";

const slot = slotById.sunset;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@";

// A long shadow cast to the right by a low sun, as stacked text-shadow offsets.
function longShadow(layers: number) {
  const length = 0.42;
  return Array.from({ length: layers }, (_, layer) => {
    const step = ((layer + 1) * length) / layers;
    return `${step.toFixed(3)}em ${(step * 0.36).toFixed(3)}em 0 var(--shade)`;
  }).join(", ");
}

const shadows = { "--long-shadow": longShadow(30), "--long-shadow-sm": longShadow(12) } as CSSProperties;

// Scrambles through random glyphs and resolves left to right, then joins the glitch loop.
function DecodeWord({ text, index, active }: { text: string; index: number; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(text);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setSettled(true);
      return;
    }

    const begin = performance.now() + index * 160;
    let lastStep = -1;
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = now - begin;
      if (elapsed >= 0) {
        const progress = Math.min(1, elapsed / 900);
        if (progress === 1) {
          setShown(text);
          setSettled(true);
          return;
        }
        const step = Math.floor(elapsed / 45);
        if (step !== lastStep) {
          lastStep = step;
          const resolved = Math.floor(progress * text.length);
          setShown(
            [...text]
              .map((char, i) => (i < resolved || !/[a-z0-9]/i.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join(""),
          );
        }
      }
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [active, reduceMotion, index, text]);

  return (
    <span
      aria-hidden="true"
      data-text={text}
      className={`glitch sunset-word block whitespace-nowrap font-display text-[length:min(10vw,6.5rem)] font-extrabold uppercase leading-[0.9] ${
        settled ? "is-on" : ""
      }`}
      style={{ "--glitch-delay": `${1.2 + index * 1.1}s` } as CSSProperties}
    >
      {shown}
    </span>
  );
}

export function SunsetPoster() {
  const listRef = useRef<HTMLUListElement>(null);
  const active = useInView(listRef, { once: true, amount: 0.35 });

  return (
    <Poster
      slot={slot}
      style={{ "--shade": "#A13C17", "--glitch-a": "#2CE5FF", "--glitch-b": "#FFF3C4" } as CSSProperties}
    >
      <StaticNoise on={active} period="7.3s" />
      <PosterHead slot={slot} />

      <ul ref={listRef} className="motif mt-12 flex flex-1 flex-col justify-center gap-7 md:gap-5" style={shadows}>
        {skillGroups.map((group, index) => (
          <li
            key={group.name}
            className="grid items-end gap-x-10 gap-y-2 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
          >
            <DecodeWord text={group.name} index={index} active={active} />
            <p className="font-mono text-[13px] leading-6">
              <span className="sr-only">{group.name}: </span>
              {group.items.join(" · ")}
            </p>
          </li>
        ))}
      </ul>
    </Poster>
  );
}
