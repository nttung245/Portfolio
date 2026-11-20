import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { mixSky, paintSky, timeSlots } from "../day";

// The ambient light behind the Switcher: the Sky of wherever the visitor is in the day. Mid-swipe it
// is the blend of two Time slots' Skies (mixSky), painted afresh, so the horizon slides and the sun
// glides rather than one picture fading into another. A gradient has no detail to lose, so it is
// painted into a tiny canvas that the browser stretches over the screen: a few kilobytes of
// texture, redrawn only when the position changes, instead of full-screen layers or a style change
// on every frame.
const WIDTH = 96;

export function Ambient({ position }: { position: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current!;
    const context = node.getContext("2d", { alpha: false })!;
    let frame = 0;

    const size = () => {
      node.width = WIDTH;
      node.height = Math.max(32, Math.round((WIDTH * window.innerHeight) / window.innerWidth));
    };

    const draw = () => {
      frame = 0;
      const at = Math.min(Math.max(position.get(), 0), timeSlots.length - 1);
      const from = Math.floor(at);
      const mix = at - from;
      const sky = mix > 0 ? mixSky(timeSlots[from].sky, timeSlots[from + 1].sky, mix) : timeSlots[from].sky;
      paintSky(context, sky, node.width, node.height);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onResize = () => {
      size();
      draw();
    };

    size();
    draw();
    const unsubscribe = position.on("change", schedule);
    window.addEventListener("resize", onResize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, [position]);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
