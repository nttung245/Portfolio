import type { CSSProperties, MouseEvent } from "react";
import { motion, type MotionValue } from "motion/react";
import { timeSlots } from "../day";
import { profile } from "../content";

type FrameProps = {
  active: number;
  clock: MotionValue<string>;
  progress: MotionValue<number>;
};

function jumpTo(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };
}

export function Frame({ active, clock, progress }: FrameProps) {
  const slot = timeSlots[active];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 font-mono text-ink transition-colors duration-500"
      style={{ "--ink": slot.ink, "--accent": slot.accent } as CSSProperties}
    >
      <header className="pointer-events-auto absolute inset-x-0 top-0 flex h-14 items-center justify-between bg-linear-to-b from-sky from-40% to-transparent px-4 text-[11px] uppercase tracking-[0.2em] sm:px-8">
        <a href="#dawn" onClick={jumpTo("dawn")} className="font-semibold">
          {profile.name}
        </a>
        <p className="flex items-center gap-4 tabular-nums">
          <span className="hidden opacity-70 sm:inline">
            N°{String(active + 1).padStart(2, "0")}/{String(timeSlots.length).padStart(2, "0")}
          </span>
          <motion.span aria-label="Time of day" className="text-[13px] tracking-[0.12em]">
            {clock}
          </motion.span>
        </p>
      </header>

      <nav
        aria-label="Time of day"
        className="pointer-events-auto absolute inset-x-0 bottom-0 bg-linear-to-t from-sky from-50% to-transparent px-4 pb-3 pt-8 sm:px-8"
      >
        <div className="relative h-px bg-ink/20">
          <motion.div className="absolute inset-0 origin-left bg-ink" style={{ scaleX: progress }} />
        </div>

        <ol
          className="mt-3 hidden gap-4 md:grid"
          style={{ gridTemplateColumns: `repeat(${timeSlots.length}, minmax(0, 1fr))` }}
        >
          {timeSlots.map((item, index) => {
            const isActive = index === active;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={jumpTo(item.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-45 hover:opacity-80"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-accent" : "bg-ink/40"}`} />
                  {item.topic}
                </a>
              </li>
            );
          })}
        </ol>

        <div className="mt-2 flex items-center justify-between md:hidden">
          <p className="text-[10px] uppercase tracking-[0.2em]">{slot.topic}</p>
          <ol className="-mr-1.5 flex items-center">
            {timeSlots.map((item, index) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={jumpTo(item.id)}
                  aria-label={item.topic}
                  aria-current={index === active ? "step" : undefined}
                  className="flex h-7 w-7 items-center justify-center"
                >
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors ${index === active ? "bg-accent" : "bg-ink/35"}`} />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </div>
  );
}
