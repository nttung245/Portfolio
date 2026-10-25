import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { slotById } from "../../day";
import { profile } from "../../content";
import { Poster, PosterHead } from "../Poster";
import { StarField } from "../StarField";
import { StaticNoise } from "../StaticNoise";

const slot = slotById.dawn;
const lines = profile.name.toUpperCase().split(" ");
const totalChars = lines.join("").length;

// Types the name in letter by letter; once it is complete the lines join the glitch loop.
function useTyping(active: boolean) {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setTyped(totalChars);
      return;
    }

    let count = 0;
    let timer = window.setTimeout(function tick() {
      count += 1;
      setTyped(count);
      if (count < totalChars) timer = window.setTimeout(tick, 70 + Math.random() * 80);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion]);

  return typed;
}

export function DawnPoster() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(nameRef, { once: true, amount: 0.4 });
  const typed = useTyping(inView);
  const done = typed >= totalChars;
  let lineStart = 0;

  return (
    <Poster
      slot={slot}
      className="justify-between"
      style={{ "--glitch-a": "#FF4FB8", "--glitch-b": "#4FE3FF" } as CSSProperties}
    >
      <StarField
        seed={7}
        count={70}
        className="inset-x-0 top-0 -z-10 h-[80%] [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
      />
      <StaticNoise on={done} />

      <PosterHead slot={slot} title={profile.coordinates} heading={false} />

      <h1
        ref={nameRef}
        aria-label={profile.name}
        className="motif my-10 font-display text-[length:18vw] font-[850] leading-[0.86] [font-stretch:100%] md:text-[length:min(15.5vw,25vh)] md:[font-stretch:112%]"
      >
        {lines.map((line, lineIndex) => {
          const start = lineStart;
          lineStart += line.length;
          const cursorAt = typed - start;
          const isLast = lineIndex === lines.length - 1;
          const hasCursor = (cursorAt >= 0 && cursorAt < line.length) || (isLast && done);

          return (
            <span
              key={line}
              aria-hidden="true"
              data-text={line}
              className={`glitch block whitespace-nowrap ${done ? "is-on" : ""}`}
              style={{ "--glitch-delay": `${lineIndex * 0.09}s` } as CSSProperties}
            >
              {[...line].map((char, index) => (
                <Fragment key={index}>
                  {hasCursor && index === cursorAt && <span className="type-cursor" />}
                  <span className={start + index < typed ? undefined : "invisible"}>{char}</span>
                </Fragment>
              ))}
              {hasCursor && cursorAt >= line.length && <span className="type-cursor" />}
            </span>
          );
        })}
      </h1>

      <div className="relative flex flex-col gap-5">
        {/* First light: a faint glow rising from the horizon. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-4 bottom-full -z-10 h-[45vh] bg-linear-to-t from-accent/20 via-accent/5 to-transparent sm:-inset-x-8"
        />
        <div aria-hidden="true" className="relative h-px bg-accent">
          <span className="absolute bottom-0 left-1/2 h-5 w-10 -translate-x-1/2 rounded-t-full bg-accent" />
        </div>
        <p className="flex flex-wrap justify-between gap-x-8 gap-y-1 font-mono text-[12px] uppercase tracking-[0.2em]">
          <span>{profile.role}</span>
          <span className="opacity-70">{profile.location}</span>
        </p>
      </div>
    </Poster>
  );
}
