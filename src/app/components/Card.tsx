import {
  createContext,
  memo,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type RefObject,
} from "react";
import { animate, m, useInView, useMotionValue, useReducedMotion, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { skyCss, type TimeSlot } from "../day";

// A Card is a Poster in the Switcher (ADR 0004): its Hero, scaled down. Opening a Card springs
// the Hero to the full screen, and only then builds the Poster's Detail below it (ADR 0005).

type CardState = { live: boolean; open: boolean };

const CardContext = createContext<CardState>({ live: true, open: true });

export function useCard() {
  return useContext(CardContext);
}

// One-off entrances start the first time their part of the Poster is on screen while its Card
// has focus, and never replay.
export function useOpener(ref: RefObject<Element>, amount = 0.35) {
  const { live } = useCard();
  const inView = useInView(ref, { amount });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (live && inView) setStarted(true);
  }, [live, inView]);

  return started;
}

export type CardLayout = {
  vw: number;
  vh: number;
  scale: number;
  width: number;
  height: number;
  gap: number;
  stride: number;
  radius: number;
};

function readLayout(): CardLayout {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const wide = vw >= 768;
  const scale = wide ? 0.64 : 0.8;
  const width = vw * scale;
  const gap = vw * (wide ? 0.025 : 0.03);
  return { vw, vh, scale, width, height: vh * scale, gap, stride: width + gap, radius: wide ? 34 : 30 };
}

export function useCardLayout() {
  const [layout, setLayout] = useState(readLayout);

  useEffect(() => {
    const onResize = () => setLayout(readLayout());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return layout;
}

// How a Card changes state: it zooms between the row and the full screen, fades in when the
// Timeline switches Posters, or changes at once (a link that lands on an open Poster).
export type CardMotion = "zoom" | "switch" | "instant";

// iOS opens an app on a stiff, barely bouncing spring and closes it a little faster.
const GROW = { type: "spring", visualDuration: 0.48, bounce: 0.14 } as const;
const SHRINK = { type: "spring", visualDuration: 0.4, bounce: 0.08 } as const;
const DEPTH = 0.07; // how much smaller a neighbour is; keep in step with card-depth in globals.css

// Where the browser can drive animations from scroll position (Chrome, Edge, Safari 26), a
// Card's depth and tint run on the compositor as scroll-driven CSS animations, in step with the
// swipe and off the main thread. Elsewhere the same effect runs from the scroll position in JS.
const scrollDriven = typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");

type CardProps = {
  index: number;
  slot: TimeSlot;
  layout: CardLayout;
  scrollX: MotionValue<number>;
  focused: boolean;
  open: boolean;
  anyOpen: boolean;
  how: CardMotion;
  onActivate: (index: number) => void;
  onPullClose: () => void;
  Hero: ComponentType;
  Detail: ComponentType;
};

export const Card = memo(function Card({
  index,
  slot,
  layout,
  scrollX,
  focused,
  open,
  anyOpen,
  how,
  onActivate,
  onPullClose,
  Hero,
  Detail,
}: CardProps) {
  const item = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { vw, vh, scale, width, height, stride, radius } = layout;

  // Lifted out of the row: the screen is fixed to the viewport while the Card is open or on its way.
  const [lifted, setLifted] = useState(open);
  const [settled, setSettled] = useState(open);
  const [atTop, setAtTop] = useState(true);
  const openRef = useRef(open);
  openRef.current = open;
  const running = useRef<AnimationPlaybackControls[]>([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const size = useMotionValue(open ? 1 : scale);
  const corner = useMotionValue(open ? 0 : radius / scale);
  const tint = useMotionValue(0);
  const fade = useMotionValue(1);

  const stop = () => {
    running.current.forEach((control) => control.stop());
    running.current = [];
  };

  const to = (target: { x: number; y: number; size: number; corner: number }, spring: typeof GROW | typeof SHRINK) => {
    stop();
    running.current = [
      animate(x, target.x, spring),
      animate(y, target.y, spring),
      animate(size, target.size, spring),
      animate(corner, target.corner, spring),
    ];
    return Promise.all(running.current);
  };

  // In the row, a Card shrinks a little and fills with its own Sky the further it is from the
  // centre. Cards beyond the neighbours are not drawn at all.
  useEffect(() => {
    if (lifted) return;
    const node = item.current!;
    let near: boolean | null = null;
    x.set(0);
    y.set(0);
    size.set(scale);
    corner.set(radius / scale);
    const place = (scrolled: number) => {
      const distance = Math.abs(scrolled - index * stride) / stride;
      if (!scrollDriven) {
        const away = Math.min(distance, 1);
        const depth = 1 - DEPTH * away;
        x.set(((1 - depth) / 2) * width);
        y.set(((1 - depth) / 2) * height);
        size.set(scale * depth);
        tint.set(away);
      }
      if (near !== distance < 1.6) {
        near = distance < 1.6;
        node.style.visibility = near ? "" : "hidden";
      }
    };
    place(scrollX.get());
    return scrollX.on("change", place);
  }, [lifted, index, stride, width, height, scale, radius, scrollX, x, y, size, corner, tint]);

  // Opening: note where the Card sits, lift it out, then grow it from there to the full screen.
  const from = useRef<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (open && !lifted) {
      from.current = item.current!.getBoundingClientRect();
      setLifted(true);
      return;
    }

    if (open && lifted && !from.current) {
      // Reopened while it was still shrinking back.
      to({ x: 0, y: 0, size: 1, corner: 0 }, GROW).then(() => openRef.current && setSettled(true));
      return;
    }

    if (!open && lifted) {
      setSettled(false);
      setAtTop(true);
      screen.current!.scrollTop = 0;
      const back = item.current!.getBoundingClientRect();
      const done = () => {
        if (!openRef.current) setLifted(false);
      };
      if (how !== "zoom" || reduceMotion) {
        stop();
        done();
        return;
      }
      const shrink = back.width / vw;
      to({ x: back.left, y: back.top, size: shrink, corner: radius / shrink }, SHRINK).then(done);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useLayoutEffect(() => {
    if (!lifted || !from.current) return;
    const start = from.current;
    from.current = null;
    tint.set(0);

    if (how === "zoom" && !reduceMotion) {
      const grow = start.width / vw;
      x.set(start.left);
      y.set(start.top);
      size.set(grow);
      corner.set(radius / grow);
      to({ x: 0, y: 0, size: 1, corner: 0 }, GROW).then(() => openRef.current && setSettled(true));
      return;
    }

    x.set(0);
    y.set(0);
    size.set(1);
    corner.set(0);
    setSettled(true);
    if (how === "switch" || reduceMotion) {
      fade.set(0);
      animate(fade, 1, { duration: 0.3, ease: [0.32, 0.72, 0, 1] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifted]);

  // Pulling down past the top of an open Poster shrinks it with the finger; let go far enough
  // and it closes, otherwise it springs back.
  useEffect(() => {
    const node = screen.current;
    if (!open || !settled || !node) return;
    let startY = 0;
    let pull = 0;
    let pulling = false;

    const onStart = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
      pull = 0;
      pulling = false;
    };
    const onMove = (event: TouchEvent) => {
      const delta = event.touches[0].clientY - startY;
      if (!pulling) {
        if (node.scrollTop > 0 || delta < 8) return;
        pulling = true;
        stop();
      }
      event.preventDefault();
      pull = Math.max(0, delta);
      const shrink = 1 - Math.min(pull / 900, 0.22);
      size.set(shrink);
      x.set(((1 - shrink) / 2) * vw);
      y.set(pull * 0.5 + ((1 - shrink) / 2) * vh * 0.4);
      corner.set(Math.min(pull / 3, radius) / shrink);
    };
    const onEnd = () => {
      if (!pulling) return;
      pulling = false;
      if (pull > 110) onPullClose();
      else to({ x: 0, y: 0, size: 1, corner: 0 }, GROW);
    };

    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchmove", onMove, { passive: false });
    node.addEventListener("touchend", onEnd);
    node.addEventListener("touchcancel", onEnd);
    return () => {
      node.removeEventListener("touchstart", onStart);
      node.removeEventListener("touchmove", onMove);
      node.removeEventListener("touchend", onEnd);
      node.removeEventListener("touchcancel", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, settled, vw, vh, radius, onPullClose]);

  // A Card in the row is a picture of its Poster: nothing inside it can be reached until it opens.
  useEffect(() => {
    if (screen.current) screen.current.inert = !open;
  }, [open]);

  // Focus moves into an open Poster, so the keyboard scrolls it, and back to its Card on closing.
  const wasOpen = useRef(open);
  useEffect(() => {
    if (open && !wasOpen.current) screen.current?.focus({ preventScroll: true });
    if (!open && wasOpen.current) item.current?.querySelector<HTMLButtonElement>("button[data-card]")?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  const sky = skyCss(slot.sky);

  return (
    <div
      ref={item}
      className="relative shrink-0 snap-center snap-always transition-opacity duration-200"
      style={{
        width,
        height,
        zIndex: lifted ? 10 : undefined,
        opacity: anyOpen && !lifted ? 0 : 1,
        // The scroll-driven depth and tint read the Card's place in the row from this timeline.
        viewTimelineName: "--card",
        viewTimelineAxis: "inline",
        ["--card-w" as string]: `${width}px`,
        ["--card-h" as string]: `${height}px`,
        // A neighbour sits one stride from the centre: that much of the timeline either side.
        ["--reach" as string]: `${(stride / (vw + width)) * 100}%`,
      }}
    >
      <m.div
        ref={screen}
        tabIndex={-1}
        onScroll={settled ? (event) => setAtTop(event.currentTarget.scrollTop < 24) : undefined}
        className={`card-screen left-0 top-0 outline-none ${lifted ? "fixed" : "absolute"} ${
          settled ? "overflow-y-auto overscroll-contain" : "overflow-hidden"
        }`}
        style={{
          width: vw,
          height: vh,
          x,
          y,
          scale: size,
          originX: 0,
          originY: 0,
          borderRadius: corner,
          opacity: fade,
          // The Sky stays still while an open Poster scrolls over it.
          background: lifted ? sky : undefined,
          willChange: lifted && !settled ? "transform" : undefined,
          boxShadow: lifted ? undefined : `0 ${36 / scale}px ${80 / scale}px -${30 / scale}px rgb(0 0 0 / 0.42)`,
        }}
      >
        {/* Behind the Hero, the Card's own Sky fills in as it leaves the centre, so its colour
            pours into the ambient light behind the row as it arrives. */}
        {!lifted && (
          <m.div
            aria-hidden="true"
            className="card-tint pointer-events-none absolute inset-0"
            style={{ background: sky, opacity: scrollDriven ? undefined : tint }}
          />
        )}

        <CardContext.Provider value={{ live: focused || open, open }}>
          <Hero />
          {open && settled && <Detail />}
        </CardContext.Provider>

        {/* The glass edge of a Card in the row. */}
        {!lifted && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-40"
            style={{
              borderRadius: "inherit",
              boxShadow: `inset 0 0 0 ${1.2 / scale}px rgb(255 255 255 / 0.2), inset 0 ${1.5 / scale}px 0 rgb(255 255 255 / 0.18)`,
            }}
          />
        )}
      </m.div>

      {/* An open Poster hints that there is more below its Hero. */}
      {open && settled && atTop && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-[86px] z-20 flex justify-center">
          <ChevronDown className="scroll-hint size-6 text-ink/80" strokeWidth={2.2} />
        </div>
      )}

      {!anyOpen && (
        <button
          type="button"
          data-card=""
          onClick={() => onActivate(index)}
          aria-label={focused ? `Open ${slot.topic}` : slot.topic}
          className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-offset-[6px]"
          style={{ borderRadius: radius }}
        >
          <span
            aria-hidden="true"
            className={`glass absolute bottom-3.5 right-3.5 inline-flex items-center gap-1 rounded-full py-2 pl-3.5 pr-3 text-[13px] font-semibold tracking-[-0.01em] text-ink transition-[opacity,transform] duration-300 ${
              focused ? "opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            Open
            <ArrowUpRight className="size-3.5" strokeWidth={2.6} />
          </span>
        </button>
      )}
    </div>
  );
});
