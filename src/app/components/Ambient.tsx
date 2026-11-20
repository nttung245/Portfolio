import { useEffect, useRef } from "react";
import type { MotionValue } from "motion/react";
import { paintSky, timeSlots } from "../day";

// The ambient light behind the Switcher: the Sky of wherever the visitor is in the day, blending
// between two Time slots mid-swipe. A gradient has no detail to lose, so it is painted into a tiny
// canvas that the browser stretches over the screen: a few kilobytes of texture, redrawn only when
// the position changes, instead of full-screen layers or a style change on every frame.
const WIDTH = 96;

export function Ambient({ position }: { position: MotionValue<number> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current!;
    const context = node.getContext("2d", { alpha: false })!;
    let skies: HTMLCanvasElement[] = [];
    let frame = 0;

    const size = () => {
      node.width = WIDTH;
      node.height = Math.max(32, Math.round((WIDTH * window.innerHeight) / window.innerWidth));
      // Each Sky is painted once per size, then blended as a picture.
      skies = timeSlots.map((slot) => {
        const sky = document.createElement("canvas");
        sky.width = node.width;
        sky.height = node.height;
        paintSky(sky.getContext("2d")!, slot.sky, sky.width, sky.height);
        return sky;
      });
    };

    const draw = () => {
      frame = 0;
      const at = Math.min(Math.max(position.get(), 0), timeSlots.length - 1);
      const from = Math.floor(at);
      const mix = at - from;
      context.globalAlpha = 1;
      context.drawImage(skies[from], 0, 0);
      if (mix > 0) {
        context.globalAlpha = mix;
        context.drawImage(skies[from + 1], 0, 0);
      }
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
