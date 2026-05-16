import { Link } from "react-router";
import { motion, useMotionValue, useSpring, type Variants } from "motion/react";
import { Pause, Play, Shuffle, SkipForward } from "lucide-react";
import { useRef } from "react";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const playlist = [
  { title: "About You", mood: "dream pop", time: "4:22" },
  { title: "Soft Systems", mood: "r&b interface", time: "3:48" },
  { title: "Grey Room", mood: "nostalgic mono", time: "2:57" },
];

function MagneticLink({
  to,
  className,
  children,
}: {
  to: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28 });
  const sy = useSpring(y, { stiffness: 260, damping: 28 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.16);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.16);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={to} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}

export function Home() {
  return (
    <div className="relative min-h-[calc(100vh-14rem)] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#111]/82 shadow-[0_30px_120px_rgba(0,0,0,0.48)] backdrop-blur-xl">
      {/* Colored album-effect layer. Component surface remains grayscale. */}
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#1ed760]/24 blur-3xl" />
        <div className="absolute right-[-8rem] top-8 h-[28rem] w-[28rem] rounded-full bg-[#8b5cf6]/20 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#f97316]/16 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.045] via-transparent to-black/45" />
      </div>

      <div className="relative z-10 grid min-h-[calc(100vh-14rem)] grid-cols-1 gap-10 p-6 md:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
        {/* Main content */}
        <motion.div
          className="flex flex-col justify-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="mb-7 flex items-center gap-4" variants={fadeUp}>
            <span className="rounded-full border border-white/10 bg-black/35 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-300 backdrop-blur-xl">
              verified portfolio playlist
            </span>
          </motion.div>

          <motion.h1
            className="mb-7 max-w-4xl font-mono text-5xl font-semibold leading-[0.98] tracking-[-0.09em] text-stone-100 md:text-7xl lg:text-8xl"
            variants={fadeUp}
          >
            Modern code,
            <br />
            <span className="text-stone-400 italic">late-night sound.</span>
          </motion.h1>

          <motion.p
            className="mb-9 max-w-2xl font-mono text-sm leading-8 text-stone-300 md:text-base"
            variants={fadeUp}
          >
            A Spotify-inspired portfolio mix: grayscale app surfaces, rounded playlist cards, colored artwork, nostalgic dream-pop atmosphere, and modern product polish.
          </motion.p>

          <motion.div className="mb-10 flex flex-wrap items-center gap-4" variants={fadeUp}>
            <MagneticLink
              to="/projects"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#1ed760] px-7 py-4 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-black shadow-[0_18px_60px_rgba(30,215,96,0.26)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#25f46e]"
            >
              <Play size={15} fill="currentColor" /> play work
            </MagneticLink>
            <MagneticLink
              to="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/35 px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-stone-300 backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
            >
              view artist
            </MagneticLink>
          </motion.div>

          <motion.div
            className="max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/38 p-2 backdrop-blur-xl"
            variants={fadeUp}
          >
            {playlist.map((track, index) => (
              <div
                key={track.title}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.25rem] px-4 py-3 transition-colors hover:bg-white/[0.06]"
              >
                <span className="font-mono text-xs text-stone-500">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0 font-mono">
                  <p className="truncate text-sm text-stone-100">{track.title}</p>
                  <p className="truncate text-[10px] uppercase tracking-[0.18em] text-stone-500">{track.mood}</p>
                </div>
                <span className="font-mono text-xs text-stone-500">{track.time}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Album / player card */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={{ opacity: 0, x: 34, filter: "blur(12px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative w-full max-w-md rounded-[2.25rem] border border-white/10 bg-black/46 p-4 shadow-[0_35px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="absolute -inset-8 -z-10 rounded-full bg-[#1ed760]/18 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=900"
              alt="Colored concert album artwork"
              className="aspect-square w-full rounded-[1.8rem] object-cover shadow-[0_30px_80px_rgba(30,215,96,0.18)]"
            />
            <div className="p-4 font-mono">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.06em] text-stone-100">About You / Dev Mix</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">dream pop • r&b • nostalgic UI</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-[0_0_38px_rgba(30,215,96,0.35)]">
                  <Pause size={18} fill="currentColor" />
                </span>
              </div>

              <div className="mb-5 flex h-12 items-end gap-1.5">
                {Array.from({ length: 34 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-full rounded-full bg-stone-100/80"
                    animate={{ height: [`${18 + (i % 7) * 5}%`, `${40 + (i % 5) * 10}%`, `${18 + (i % 7) * 5}%`] }}
                    transition={{ duration: 1.8 + (i % 6) * 0.18, repeat: Infinity, ease: "easeInOut" }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-stone-400">
                <Shuffle size={16} />
                <div className="h-1.5 flex-1 mx-4 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-[#1ed760]"
                    initial={{ width: "24%" }}
                    animate={{ width: ["24%", "78%", "24%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <SkipForward size={16} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
