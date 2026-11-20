import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { AnimatePresence, motion, type MotionValue, type Transition } from "motion/react";
import {
  BriefcaseBusiness,
  Cpu,
  Gamepad2,
  GraduationCap,
  Mail,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { timeSlots } from "../day";
import { profile } from "../content";

type FrameProps = {
  active: number;
  clock: MotionValue<string>;
  progress: MotionValue<number>;
};

// The Frame is the site's iOS layer: Liquid Glass chrome that floats over the Posters.
const SPRING: Transition = { type: "spring", bounce: 0.28, duration: 0.6 };

// Each Topic's icon, which stands in for its name in the Timeline on small screens.
const topicIcons: Record<string, LucideIcon> = {
  dawn: UserRound,
  sunrise: Target,
  midday: BriefcaseBusiness,
  afternoon: Gamepad2,
  sunset: Cpu,
  dusk: GraduationCap,
  twilight: Mail,
};

const ISLAND = {
  compact: { width: 100, height: 36, borderRadius: 18 },
  expanded: { width: 228, height: 48, borderRadius: 24 },
};

function jumpTo(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };
}

// Opens briefly whenever the visitor reaches a new Poster, like a Live Activity.
function useAnnounce(active: number) {
  const [open, setOpen] = useState(false);
  const shown = useRef(active);

  useEffect(() => {
    if (shown.current === active) return;
    shown.current = active;
    setOpen(true);
    const timer = window.setTimeout(() => setOpen(false), 1900);
    return () => window.clearTimeout(timer);
  }, [active]);

  return open;
}

function DayRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[17px] -rotate-90">
      <circle cx="10" cy="10" r="7.5" className="fill-none stroke-ink/20" strokeWidth="3" />
      <motion.circle
        cx="10"
        cy="10"
        r="7.5"
        className="fill-none stroke-accent"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

const swap = {
  initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
  transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
} as const;

// The Day clock, in a capsule that grows to name the Topic when the visitor arrives at a new Poster.
function DayClock({ active, clock, progress, open }: FrameProps & { open: boolean }) {
  const slot = timeSlots[active];
  const Icon = topicIcons[slot.id];

  return (
    <motion.div
      className="glass relative overflow-hidden"
      initial={false}
      animate={open ? ISLAND.expanded : ISLAND.compact}
      transition={SPRING}
    >
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="expanded"
            {...swap}
            className="absolute left-1/2 top-0 flex h-12 w-[228px] -translate-x-1/2 items-center gap-2.5 pl-2 pr-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent" style={{ color: slot.sky }}>
              <Icon aria-hidden="true" className="size-4" strokeWidth={2.3} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold tracking-[-0.01em]">{slot.topic}</span>
            <motion.span className="text-[17px] font-semibold tabular-nums tracking-[-0.01em]">{clock}</motion.span>
          </motion.div>
        ) : (
          <motion.div
            key="compact"
            {...swap}
            className="absolute left-1/2 top-0 flex h-9 w-[100px] -translate-x-1/2 items-center justify-center gap-2"
          >
            <DayRing progress={progress} />
            <motion.span aria-label="Time of day" className="text-[14px] font-semibold tabular-nums tracking-[-0.01em]">
              {clock}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Frame({ active, clock, progress }: FrameProps) {
  const slot = timeSlots[active];
  const open = useAnnounce(active);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 font-sans text-ink transition-colors duration-500"
      style={{ "--ink": slot.ink, "--accent": slot.accent } as CSSProperties}
    >
      {/* Scroll edges: the Posters soften and blur as they slide under the glass. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-sky/75 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_40%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-sky/60 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_35%,transparent)]"
      />

      <header className="absolute inset-x-0 top-3 flex h-9 items-center justify-between px-4 sm:px-8">
        {/* While the island is open on a phone, it takes the whole bar, as on iOS. */}
        <a
          href="#dawn"
          onClick={jumpTo("dawn")}
          className={`press pointer-events-auto text-[14px] font-semibold tracking-[-0.01em] min-[380px]:text-[15px] transition-opacity duration-300 ${
            open ? "max-md:opacity-0" : ""
          }`}
        >
          {profile.name}
        </a>
        <p
          className={`text-[13px] font-medium tabular-nums opacity-60 transition-opacity duration-300 ${
            open ? "max-md:opacity-0" : ""
          }`}
        >
          N°{String(active + 1).padStart(2, "0")}
          <span className="opacity-60">/{String(timeSlots.length).padStart(2, "0")}</span>
        </p>
      </header>

      <div className="absolute inset-x-0 top-3 flex justify-center">
        <DayClock active={active} clock={clock} progress={progress} open={open} />
      </div>

      <nav
        aria-label="Timeline"
        className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(14px,env(safe-area-inset-bottom))]"
      >
        <ol className="glass pointer-events-auto flex items-center rounded-full p-1 md:gap-0.5 md:p-1.5">
          {timeSlots.map((item, index) => {
            const isActive = index === active;
            const Icon = topicIcons[item.id];

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={jumpTo(item.id)}
                  aria-label={item.topic}
                  aria-current={isActive ? "step" : undefined}
                  className={`press relative flex h-10 w-10 items-center justify-center rounded-full min-[400px]:w-11 md:h-9 md:w-auto md:px-4 ${
                    isActive ? "text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="timeline-lens"
                      transition={SPRING}
                      className="absolute inset-0 bg-ink/12 shadow-[inset_0_1px_0_rgb(255_255_255/0.28)]"
                      style={{ borderRadius: 999 }}
                    />
                  )}
                  <Icon aria-hidden="true" className="relative size-[21px] md:hidden" strokeWidth={isActive ? 2.2 : 1.8} />
                  {/* One weight for every tab, so the bar keeps its width as the lens moves. */}
                  <span className="relative hidden text-[13px] font-medium tracking-[-0.01em] md:inline">{item.topic}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
