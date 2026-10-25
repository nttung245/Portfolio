import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { END_OF_DAY, formatClock, legacyHashes, timeSlots, toMinutes } from "../day";
import { Frame } from "./Frame";
import { DawnPoster } from "./posters/DawnPoster";
import { SunrisePoster } from "./posters/SunrisePoster";
import { MiddayPoster } from "./posters/MiddayPoster";
import { SunsetPoster } from "./posters/SunsetPoster";
import { DuskPoster } from "./posters/DuskPoster";
import { TwilightPoster } from "./posters/TwilightPoster";

const slotMinutes = timeSlots.map((slot) => toMinutes(slot.time));

// Scroll drives the Sky and the Day clock (ADR 0001). The Sky stays flat inside a Poster
// and blends into the next one across a band around each boundary.
function useDayScroll() {
  const { scrollY, scrollYProgress } = useScroll();
  const clock = useMotionValue(timeSlots[0].time);
  const [active, setActive] = useState(0);
  const layout = useRef({ tops: [] as number[], viewport: 0, max: 0 });

  const update = useCallback(
    (y: number) => {
      const { tops, viewport, max } = layout.current;
      if (tops.length === 0) return;

      const center = y + viewport / 2;
      let index = 0;
      tops.forEach((top, i) => {
        if (top <= center) index = i;
      });

      const band = viewport * 0.3;
      const next = tops[index + 1];
      let from = index;
      let to = index;
      let mix = 0;
      if (next !== undefined && next - center < band) {
        to = index + 1;
        mix = (band - (next - center)) / (2 * band);
      } else if (index > 0 && center - tops[index] < band) {
        from = index - 1;
        mix = 0.5 + (center - tops[index]) / (2 * band);
      }

      // A flat Sky gets its exact colour: mixing a near-neutral colour with itself in oklch
      // drops the hue, which browsers then render as a faint pink.
      const fromSky = timeSlots[from].sky;
      const sky = from === to ? fromSky : `color-mix(in oklch, ${timeSlots[to].sky} ${(mix * 100).toFixed(1)}%, ${fromSky})`;
      document.documentElement.style.setProperty("--sky", sky);

      // Each Poster shows its own time when its top meets the top of the screen.
      const points = tops.map((top, i) => [Math.min(top, max), slotMinutes[i]]);
      const last = points[points.length - 1];
      if (max > last[0]) points.push([max, toMinutes(END_OF_DAY)]);

      let minutes = points[0][1];
      for (let i = 1; i < points.length; i++) {
        const [y0, t0] = points[i - 1];
        const [y1, t1] = points[i];
        if (y >= y0) minutes = y1 > y0 ? t0 + (t1 - t0) * Math.min(1, (y - y0) / (y1 - y0)) : t1;
      }

      clock.set(formatClock(minutes));
      setActive(index);
    },
    [clock],
  );

  const measure = useCallback(() => {
    layout.current = {
      tops: timeSlots.map((slot) => {
        const section = document.getElementById(slot.id);
        return section ? section.getBoundingClientRect().top + window.scrollY : 0;
      }),
      viewport: window.innerHeight,
      max: document.documentElement.scrollHeight - window.innerHeight,
    };
    update(window.scrollY);
  }, [update]);

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", timeSlots[active].sky);
  }, [active]);

  return { active, clock, progress: scrollYProgress };
}

export function DayPage() {
  const { active, clock, progress } = useDayScroll();

  useEffect(() => {
    const scrollToHash = (behavior: ScrollBehavior) => {
      const requested = window.location.hash.replace("#", "");
      if (!requested) return;

      const id = legacyHashes[requested] ?? requested;
      if (id !== requested) window.history.replaceState(null, "", `#${id}`);
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
    };

    // Land on the Poster, then land again once the display font has loaded and reflowed the page,
    // unless the visitor has already scrolled away.
    let landedAt = -1;
    const land = () => {
      scrollToHash("instant");
      landedAt = window.scrollY;
    };
    const timeout = window.setTimeout(land, 60);
    document.fonts?.ready.then(() => {
      if (window.scrollY === landedAt) land();
    });
    const handleHashChange = () => scrollToHash("smooth");
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-sky" />
      <Frame active={active} clock={clock} progress={progress} />
      <main className="relative z-10">
        <DawnPoster />
        <SunrisePoster />
        <MiddayPoster />
        <SunsetPoster />
        <DuskPoster />
        <TwilightPoster />
      </main>
    </>
  );
}
