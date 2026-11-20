import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { AnimatePresence, animate, m, useMotionValue, type MotionValue } from "motion/react";
import {
  BriefcaseBusiness,
  Cpu,
  Gamepad2,
  GraduationCap,
  Mail,
  Target,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { slotHash, timeSlots } from "../day";
import { profile } from "../content";

type FrameProps = {
  active: number;
  clock: MotionValue<string>;
  progress: MotionValue<number>;
  /** Whether a Poster is open, rather than the Switcher showing. */
  open: boolean;
  onSelect: (index: number) => void;
  onClose: () => void;
};

// The Frame floats Liquid Glass controls over the Switcher and over an open Poster, as iOS 26
// floats its bars: there is no bar behind them.
const SPRING = { type: "spring", visualDuration: 0.42, bounce: 0.2 } as const;

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

// Plain links underneath, so a Topic still opens in a new tab; a normal click stays in the page.
function choose(index: number, onSelect: (index: number) => void) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onSelect(index);
  };
}

function DayRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-[17px] -rotate-90">
      <circle cx="10" cy="10" r="7.5" className="fill-none stroke-ink/25" strokeWidth="3" />
      <m.circle
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

// The lens slides to the active Topic on a spring. It is placed from measurements rather than a
// shared layout animation, which keeps motion's layout engine out of the bundle.
function useLens(active: number) {
  const tabs = useRef<Array<HTMLAnchorElement | null>>([]);
  const x = useMotionValue(0);
  const width = useMotionValue(0);
  const placed = useRef(false);

  useLayoutEffect(() => {
    const place = (smooth: boolean) => {
      const tab = tabs.current[active];
      if (!tab) return;
      if (smooth) {
        animate(x, tab.offsetLeft, SPRING);
        animate(width, tab.offsetWidth, SPRING);
      } else {
        x.set(tab.offsetLeft);
        width.set(tab.offsetWidth);
      }
    };
    place(placed.current);
    placed.current = true;
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, x, width]);

  return { tabs, x, width };
}

const pill = "glass pointer-events-auto flex h-9 items-center rounded-full";

export function Frame({ active, clock, progress, open, onSelect, onClose }: FrameProps) {
  const lens = useLens(active);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 text-ink">
      <header className="absolute inset-x-0 top-3 flex h-9 items-center justify-between px-4 sm:px-8">
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <m.button
              key="close"
              type="button"
              onClick={onClose}
              aria-label="Back to all Posters"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={SPRING}
              className={`${pill} press -ml-1 w-9 justify-center`}
            >
              <X aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
            </m.button>
          ) : (
            <m.a
              key="name"
              href="/"
              onClick={choose(0, onSelect)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="press lift pointer-events-auto text-[15px] font-semibold tracking-[-0.01em]"
            >
              {profile.name}
            </m.a>
          )}
        </AnimatePresence>
        <p className={`${pill} px-3 text-[13px] font-semibold tabular-nums`}>
          {String(active + 1).padStart(2, "0")}
          <span className="text-ink/55">/{String(timeSlots.length).padStart(2, "0")}</span>
        </p>
      </header>

      <div className="absolute inset-x-0 top-3 flex justify-center">
        <p className={`${pill} gap-2 px-3.5`}>
          <DayRing progress={progress} />
          <m.span aria-label="Time of day" className="text-[14px] font-semibold tabular-nums tracking-[-0.01em]">
            {clock}
          </m.span>
        </p>
      </div>

      <nav aria-label="Timeline" className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-[max(14px,env(safe-area-inset-bottom))]">
        <ol className="glass pointer-events-auto relative flex items-center rounded-full p-1 md:gap-0.5 md:p-1.5">
          <m.span
            aria-hidden="true"
            className="absolute inset-y-1 left-0 rounded-full bg-ink/22 shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] md:inset-y-1.5"
            style={{ x: lens.x, width: lens.width }}
          />
          {timeSlots.map((item, index) => {
            const isActive = index === active;
            const Icon = topicIcons[item.id];

            return (
              <li key={item.id}>
                <a
                  ref={(node) => {
                    lens.tabs.current[index] = node;
                  }}
                  href={`#${slotHash(item)}`}
                  onClick={choose(index, onSelect)}
                  aria-label={item.topic}
                  aria-current={isActive ? "step" : undefined}
                  className={`press relative flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 min-[400px]:w-11 md:h-9 md:w-auto md:px-4 ${
                    isActive ? "text-ink" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-[21px] md:hidden" strokeWidth={isActive ? 2.2 : 1.8} />
                  {/* One weight for every tab, so the bar keeps its width as the lens moves. */}
                  <span className="hidden text-[13px] font-semibold tracking-[-0.01em] md:inline">{item.topic}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
