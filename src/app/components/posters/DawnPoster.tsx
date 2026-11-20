import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { BriefcaseBusiness, Github, GraduationCap, Linkedin, Mail, MapPin, Send, UserRound } from "lucide-react";
import { slotById } from "../../day";
import { education, experiences, profile } from "../../content";
import { useOpener } from "../Card";
import { Detail, Eyebrow, Hero, Module, Row, useCopy } from "../Poster";

const slot = slotById.dawn;
const photo = new URL("../../../../my_picture/profile.webp", import.meta.url).href;
const figure = new URL("../../../../my_picture/profile-figure.webp", import.meta.url).href;
// The photo and the cut-out of the figure pin the same point, so the figure always lands exactly
// on itself, whatever the shape of the screen.
const FOCUS = "50% 40%";
const words = profile.name.split(" ");

// Types the name in at an even pace; each letter settles in rather than popping.
function useTyping(start: boolean, total: number) {
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setTyped(total);
      return;
    }
    let count = 0;
    let timer = window.setTimeout(function tick() {
      count += 1;
      setTyped(count);
      if (count < total) timer = window.setTimeout(tick, 78);
    }, 380);
    return () => window.clearTimeout(timer);
  }, [start, total, reduceMotion]);

  return typed;
}

// Profile's Hero is an iOS Contact Poster: the photo fills the Card and the name stands behind
// the figure's head, as the clock does on a Lock Screen with the depth effect.
export function DawnHero() {
  const name = useRef<HTMLHeadingElement>(null);
  const start = useOpener(name, 0.2);
  const letters = words.join("").length;
  const typed = useTyping(start, letters);
  let index = 0;

  return (
    <Hero slot={slot}>
      {/* The photo dissolves into the Sky at its foot, so an open Poster flows on into its Detail. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <img
          src={photo}
        alt=""
        width={1080}
        height={1440}
        decoding="async"
        {...{ fetchpriority: "high" }}
          className="h-full w-full object-cover"
          style={{ objectPosition: FOCUS }}
        />
      </div>

      <Eyebrow>Profile</Eyebrow>

      <h1
        ref={name}
        aria-label={profile.name}
        className="motif lift absolute inset-x-0 bottom-[58%] z-10 px-4 text-center text-[clamp(64px,19vw,180px)] font-extrabold leading-[0.88] tracking-[-0.045em] md:text-[clamp(96px,11.5vw,210px)]"
      >
        {words.map((word, wordIndex) => (
          <span key={word} aria-hidden="true" className="block md:inline">
            {wordIndex > 0 && <span className="hidden md:inline"> </span>}
            {[...word].map((letter) => {
              const at = index++;
              const shown = at < typed;
              return (
                <span key={at}>
                  <span className={shown ? "type-letter" : "opacity-0"}>{letter}</span>
                  {start && at === Math.max(typed - 1, 0) && (typed < letters || at === letters - 1) && <span className="type-caret" />}
                </span>
              );
            })}
          </span>
        ))}
      </h1>

      <div className="pointer-events-none absolute inset-0 z-20 [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <img
          src={figure}
          alt={`${profile.name} looking out to sea at first light`}
          width={1080}
          height={1440}
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: FOCUS }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-black/55 via-black/25 to-transparent" />
      </div>

      <div className="relative z-30 mt-auto">
        <p className="text-[clamp(22px,2.4vw,30px)] font-semibold tracking-[-0.02em]">{profile.role}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-body text-ink/75">
          <MapPin aria-hidden="true" className="size-4" strokeWidth={2.2} />
          {profile.location}
        </p>
      </div>
    </Hero>
  );
}

export function DawnDetail() {
  const email = useCopy(profile.email);
  const now = experiences[0];

  return (
    <Detail>
      <Module title="About" icon={UserRound} index={0}>
        <ul>
          <Row icon={BriefcaseBusiness} label="Now" value={`${now.role}, ${now.company}`} />
          <Row icon={GraduationCap} label="Studying" value={`${education.short} · ${education.period}`} />
          <Row icon={MapPin} label="Based in" value={profile.location} />
        </ul>
      </Module>
      <Module title="Reach me" icon={Send} index={1}>
        <ul>
          <Row icon={Mail} label="Email" value={email.copied ? "Copied" : profile.email} onClick={email.copy} />
          <Row icon={Github} label="GitHub" value={profile.github.replace("https://github.com/", "")} href={profile.github} />
          <Row icon={Linkedin} label="LinkedIn" value="nttung245" href={profile.linkedin} />
        </ul>
      </Module>
    </Detail>
  );
}
