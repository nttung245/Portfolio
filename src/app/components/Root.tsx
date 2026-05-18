import { Outlet } from "react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";

type Theme = "light" | "dark";

export function Root() {
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";

    const saved = window.localStorage.getItem("portfolio-theme");
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#faf9f5] text-zinc-950 selection:bg-zinc-950 selection:text-white transition-colors duration-300 dark:bg-[#09090b] dark:text-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-950">
      <motion.div
        className="fixed left-0 top-0 z-[80] h-[2px] w-full origin-left bg-zinc-950 dark:bg-zinc-100"
        style={{ scaleX: progressScaleX }}
      />

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-14 border-b border-zinc-200/80 bg-white/70 backdrop-blur-xl dark:border-zinc-800/90 dark:bg-[#09090b]/78" />
        <div
          className="absolute inset-0 opacity-80 dark:opacity-65"
          style={{
            backgroundImage: "radial-gradient(var(--dot-color) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="absolute inset-y-0 left-[calc(50%-40rem)] hidden w-px bg-zinc-200/80 dark:bg-zinc-800/80 xl:block" />
        <div className="absolute inset-y-0 right-[calc(50%-40rem)] hidden w-px bg-zinc-200/80 dark:bg-zinc-800/80 xl:block" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar theme={theme} onToggleTheme={() => setTheme((value) => (value === "dark" ? "light" : "dark"))} />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
