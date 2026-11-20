import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { formatClock, skyTop, slotHash, slotIndexFromHash, timeSlots, toMinutes } from "../day";
import { Ambient } from "./Ambient";
import { Card, useCardLayout, type CardMotion } from "./Card";
import { Frame } from "./Frame";
import { DawnDetail, DawnHero } from "./posters/DawnPoster";
import { SunriseDetail, SunriseHero } from "./posters/SunrisePoster";
import { MiddayDetail, MiddayHero } from "./posters/MiddayPoster";
import { AfternoonDetail, AfternoonHero } from "./posters/AfternoonPoster";
import { SunsetDetail, SunsetHero } from "./posters/SunsetPoster";
import { DuskDetail, DuskHero } from "./posters/DuskPoster";
import { TwilightDetail, TwilightHero } from "./posters/TwilightPoster";

// In Time slot order: each Poster's Hero (its Card) and Detail (built only while it is open).
const posters: Array<{ Hero: ComponentType; Detail: ComponentType }> = [
  { Hero: DawnHero, Detail: DawnDetail },
  { Hero: SunriseHero, Detail: SunriseDetail },
  { Hero: MiddayHero, Detail: MiddayDetail },
  { Hero: AfternoonHero, Detail: AfternoonDetail },
  { Hero: SunsetHero, Detail: SunsetDetail },
  { Hero: DuskHero, Detail: DuskDetail },
  { Hero: TwilightHero, Detail: TwilightDetail },
];
const slotMinutes = timeSlots.map((slot) => toMinutes(slot.time));
const LAST = timeSlots.length - 1;

const clamp = (index: number) => Math.min(Math.max(index, 0), LAST);
const hashOf = (index: number) => `#${slotHash(timeSlots[index])}`;

type View = { open: number | null; how: CardMotion };

// The Switcher (ADR 0004): the Posters sit side by side as Cards. Swiping along the row moves the
// Sky and the Day clock through the day; opening a Card zooms its Poster to the full screen.
export function DayPage() {
  const layout = useCardLayout();
  const reduceMotion = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  // Where the ambient light is in the day: it follows the row, and glides when the Timeline swaps
  // one open Poster for another.
  const skyAt = useMotionValue(0);
  const gliding = useRef(false);
  const clock = useMotionValue(timeSlots[0].time);
  const progress = useMotionValue(0);

  const [view, setView] = useState<View>(() => {
    const index = slotIndexFromHash(window.location.hash);
    return { open: index >= 0 ? index : null, how: "instant" };
  });
  const [active, setActive] = useState(() => Math.max(slotIndexFromHash(window.location.hash), 0));

  const viewRef = useRef(view);
  viewRef.current = view;
  const activeRef = useRef(active);
  activeRef.current = active;
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  // The Card the row is on its way to, so a second wheel step or key press goes one further.
  const target = useRef<number | null>(null);
  // Whether opening added a history entry, so closing can step back out of it.
  const pushed = useRef(false);

  const follow = useCallback(
    (left: number) => {
      // Scroll offsets round to whole pixels, so a settled Card can sit a hair short of its slot.
      const raw = Math.min(Math.max(left / layoutRef.current.stride, 0), LAST);
      const position = Math.abs(raw - Math.round(raw)) < 0.004 ? Math.round(raw) : raw;
      const from = Math.floor(position);
      const to = Math.min(from + 1, LAST);
      const mix = position - from;

      if (!gliding.current) skyAt.set(position);
      clock.set(formatClock(slotMinutes[from] + (slotMinutes[to] - slotMinutes[from]) * mix));
      progress.set(position / LAST);
      setActive(Math.round(position));
      if (Number.isInteger(position) && position === target.current) target.current = null;
    },
    [clock, progress, skyAt],
  );

  const jump = useCallback(
    (index: number) => {
      const node = scroller.current!;
      node.scrollLeft = index * layoutRef.current.stride;
      scrollX.set(node.scrollLeft);
      follow(node.scrollLeft);
    },
    [follow, scrollX],
  );

  const centre = useCallback(
    (index: number) => {
      target.current = index;
      scroller.current?.scrollTo({ left: index * layoutRef.current.stride, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion],
  );

  const openCard = useCallback(
    (index: number, how: CardMotion) => {
      if (how === "switch") {
        gliding.current = true;
        animate(skyAt, index, { duration: 0.5, ease: [0.32, 0.72, 0, 1] }).then(() => {
          gliding.current = false;
        });
      }
      jump(index);
      setView({ open: index, how });
    },
    [jump, skyAt],
  );

  const requestOpen = useCallback(
    (index: number) => {
      window.history.pushState(null, "", hashOf(index));
      pushed.current = true;
      openCard(index, "zoom");
    },
    [openCard],
  );

  const requestClose = useCallback(() => {
    if (viewRef.current.open === null) return;
    if (pushed.current) {
      window.history.back(); // The popstate handler closes it.
      return;
    }
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setView({ open: null, how: "zoom" });
  }, []);

  // The Timeline centres a Card in the Switcher, or swaps one open Poster for another.
  const select = useCallback(
    (index: number) => {
      const open = viewRef.current.open;
      if (open === null) {
        centre(index);
        return;
      }
      if (index === open) return;
      window.history.replaceState(null, "", hashOf(index));
      openCard(index, "switch");
    },
    [centre, openCard],
  );

  const activate = useCallback(
    (index: number) => {
      if (index === activeRef.current) requestOpen(index);
      else centre(index);
    },
    [centre, requestOpen],
  );

  // Keep the row in step with the scroller, and keep the focused Card centred through resizes.
  useEffect(() => {
    const node = scroller.current!;
    const onScroll = () => {
      scrollX.set(node.scrollLeft);
      follow(node.scrollLeft);
    };
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => node.removeEventListener("scroll", onScroll);
  }, [follow, scrollX]);

  useLayoutEffect(() => {
    jump(viewRef.current.open ?? activeRef.current);
  }, [layout, jump]);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", skyTop(timeSlots[active].sky));
  }, [active]);

  // An address names an open Poster: rewrite older ones, and follow Back and Forward.
  useEffect(() => {
    const tidy = () => {
      const index = slotIndexFromHash(window.location.hash);
      if (index >= 0 && window.location.hash !== hashOf(index)) window.history.replaceState(null, "", hashOf(index));
      else if (index < 0 && window.location.hash) window.history.replaceState(null, "", window.location.pathname);
      return index;
    };
    tidy();

    const onPop = () => {
      const next = tidy();
      const open = viewRef.current.open;
      if (next < 0) {
        pushed.current = false;
        if (open !== null) setView({ open: null, how: "zoom" });
      } else if (next !== open) {
        openCard(next, open === null ? "zoom" : "switch");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openCard]);

  // Keys: ← → move along the row, Enter opens the focused Card, Esc closes an open Poster.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (viewRef.current.open !== null) {
        if (event.key === "Escape") requestClose();
        return;
      }
      const from = target.current ?? activeRef.current;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        centre(clamp(from + (event.key === "ArrowRight" ? 1 : -1)));
      } else if (event.key === "Enter" && (event.target === document.body || event.target === scroller.current)) {
        requestOpen(activeRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [centre, requestClose, requestOpen]);

  // A mouse wheel turns the row one Card per step. Sideways trackpad swipes scroll natively.
  useEffect(() => {
    const node = scroller.current!;
    let total = 0;
    let locked = false;
    let quiet = 0;
    const onWheel = (event: WheelEvent) => {
      if (viewRef.current.open !== null || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      event.preventDefault();
      window.clearTimeout(quiet);
      quiet = window.setTimeout(() => {
        locked = false;
        total = 0;
      }, 180);
      if (locked) return;
      total += event.deltaY;
      if (Math.abs(total) < 30) return;
      locked = true;
      centre(clamp((target.current ?? activeRef.current) + Math.sign(total)));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      node.removeEventListener("wheel", onWheel);
      window.clearTimeout(quiet);
    };
  }, [centre]);

  // On a first visit, once the name has been written out, the row leans left and springs back to show it moves.
  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem("switcher-nudged") !== null;
    } catch {
      // Storage can be blocked; skip the hint rather than repeat it.
    }
    if (seen || reduceMotion || viewRef.current.open !== null) return;

    let touched = false;
    const touch = () => {
      touched = true;
    };
    const events = ["pointerdown", "wheel", "keydown", "touchstart"] as const;
    events.forEach((name) => window.addEventListener(name, touch, { passive: true }));
    const timer = window.setTimeout(async () => {
      if (touched || viewRef.current.open !== null || activeRef.current !== 0) return;
      try {
        sessionStorage.setItem("switcher-nudged", "1");
      } catch {
        // Ignore.
      }
      const node = scroller.current!;
      await animate(node, { x: -56 }, { duration: 0.42, ease: [0.32, 0.72, 0, 1] });
      await animate(node, { x: 0 }, { type: "spring", bounce: 0.5, duration: 0.8 });
      node.style.transform = "";
    }, 2600);

    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, touch));
    };
  }, [reduceMotion]);

  const spacer = (layout.vw - layout.width) / 2 - layout.gap;

  return (
    <>
      <Ambient position={skyAt} />
      <main
        ref={scroller}
        className={`fixed inset-0 z-10 flex snap-x snap-mandatory items-center overflow-y-hidden overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          view.open === null ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
        style={{ gap: layout.gap }}
      >
        <div aria-hidden="true" className="h-px shrink-0" style={{ width: spacer }} />
        {posters.map(({ Hero, Detail }, index) => (
          <Card
            key={timeSlots[index].id}
            index={index}
            slot={timeSlots[index]}
            layout={layout}
            scrollX={scrollX}
            focused={index === active}
            open={view.open === index}
            anyOpen={view.open !== null}
            how={view.how}
            onActivate={activate}
            onPullClose={requestClose}
            Hero={Hero}
            Detail={Detail}
          />
        ))}
        <div aria-hidden="true" className="h-px shrink-0" style={{ width: spacer }} />
      </main>
      <Frame
        active={active}
        clock={clock}
        progress={progress}
        open={view.open !== null}
        onSelect={select}
        onClose={requestClose}
      />
    </>
  );
}
