import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { Check, Copy, Github, Linkedin, Mail, MapPin, Send, Waypoints } from "lucide-react";
import { slotById } from "../../day";
import { composeLinks, contact, profile } from "../../content";
import { useOpener } from "../Card";
import { Detail, Eyebrow, Hero, Module, Row, Stars, useCopy } from "../Poster";

const slot = slotById.twilight;
const button = "press inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-semibold tracking-[-0.01em]";
const bubble = "rounded-[22px] rounded-bl-md bg-ink/16 shadow-[inset_0_1px_0_rgb(255_255_255/0.14)]";

// Contact's Motif: an incoming iMessage. The typing indicator shows for a moment, then the
// message lands with a spring. The message is always laid out, so nothing below it moves.
function Message({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const start = useOpener(box, 0.6);
  const reduceMotion = useReducedMotion();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!start) return;
    if (reduceMotion) {
      setSent(true);
      return;
    }
    const timer = window.setTimeout(() => setSent(true), 1500);
    return () => window.clearTimeout(timer);
  }, [start, reduceMotion]);

  const typing = start && !sent;

  return (
    <div ref={box} className="relative mt-6 max-w-md">
      <m.p
        className={`${bubble} px-4 py-2.5 text-[17px] leading-[1.4] tracking-[-0.01em]`}
        style={{ originX: 0, originY: 1 }}
        initial={false}
        animate={sent || reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
        transition={{ type: "spring", visualDuration: 0.45, bounce: 0.3 }}
      >
        {text}
      </m.p>
      <m.div
        aria-hidden="true"
        className={`${bubble} absolute bottom-0 left-0 flex gap-1.5 px-4 py-3.5`}
        style={{ originX: 0, originY: 1 }}
        initial={false}
        animate={typing ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={{ type: "spring", visualDuration: 0.3, bounce: 0.25 }}
      >
        <span className="typing-dot size-2 rounded-full bg-ink" />
        <span className="typing-dot size-2 rounded-full bg-ink" />
        <span className="typing-dot size-2 rounded-full bg-ink" />
      </m.div>
    </div>
  );
}

export function TwilightHero() {
  const email = useCopy(profile.email);

  return (
    <Hero slot={slot}>
      <Stars seed={41} count={64} className="inset-0 -z-10" />
      <Eyebrow>Contact</Eyebrow>
      <div className="mt-auto">
        <h2 className="text-[clamp(64px,15vw,180px)] font-extrabold leading-[0.9] tracking-[-0.05em]">{contact.title}</h2>
        <Message text={contact.note} />
        <a href={`mailto:${profile.email}`} className="mt-6 inline-block text-[clamp(18px,2.2vw,26px)] font-semibold tracking-[-0.02em] [overflow-wrap:anywhere]">
          {profile.email}
        </a>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {composeLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={`${button} ${index === 0 ? "bg-ink text-[#0a1125] hover:bg-ink/90" : "bg-ink/14 hover:bg-ink/20"}`}
            >
              {index === 0 && <Send aria-hidden="true" className="size-4" strokeWidth={2.2} />}
              Compose in {link.label}
            </a>
          ))}
          <button type="button" onClick={email.copy} className={`${button} bg-ink/14 hover:bg-ink/20`}>
            {email.copied ? <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={2.6} /> : <Copy aria-hidden="true" className="size-4" strokeWidth={2.2} />}
            {email.copied ? "Copied" : "Copy email"}
            <span role="status" className="sr-only">
              {email.copied ? "Email address copied" : ""}
            </span>
          </button>
        </div>
      </div>
    </Hero>
  );
}

export function TwilightDetail() {
  const email = useCopy(profile.email);

  return (
    <Detail>
      <Module title="Elsewhere" icon={Waypoints}>
        <ul>
          <Row icon={Mail} label="Email" value={email.copied ? "Copied" : profile.email} onClick={email.copy} />
          <Row icon={Github} label="GitHub" value={profile.github.replace("https://github.com/", "")} href={profile.github} />
          <Row icon={Linkedin} label="LinkedIn" value="nttung245" href={profile.linkedin} />
          <Row icon={MapPin} label="Based in" value={profile.location} />
        </ul>
      </Module>
    </Detail>
  );
}
