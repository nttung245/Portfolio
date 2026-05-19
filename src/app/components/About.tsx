import {
  BadgeCheck,
  Code2,
  Cpu,
  Database,
  Github,
  Linkedin,
  Mail,
  Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
const profileAvatar = new URL("../../../my_picture/my_avatar.jpg", import.meta.url).href;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const roles = ["Full-Stack Engineer", "AI Engineer"];

const profileLinks = [
  { icon: Github, label: "GitHub", value: "nttung245", href: "https://github.com/nttung245" },
  { icon: Linkedin, label: "LinkedIn", value: "nttung245", href: "https://www.linkedin.com/in/nttung245/" },
  { icon: Mail, label: "Gmail", value: "nguyenthanhtung020405@gmail.com", href: "mailto:nguyenthanhtung020405@gmail.com" },
];

const aboutBullets = [
  "Full-stack and AI engineer focused on clean architecture, readable systems, and interfaces that feel direct rather than decorated.",
  "Comfortable across frontend, backend, databases, deployment, AI-assisted workflows, and the small interaction details that make a product feel finished.",
  "I prefer simple surfaces, strong hierarchy, predictable components, and practical automation that helps products move faster.",
  "Currently exploring better product systems, AI integrations, and pragmatic ways to ship polished ideas faster.",
];

const technologies = [
  { icon: Code2, label: "React" },
  { icon: Cpu, label: "TypeScript" },
  { icon: Terminal, label: "Node.js" },
  { icon: Database, label: "PostgreSQL" },
  { icon: Terminal, label: "Rust" },
  { icon: Cpu, label: "Go" },
  { icon: Database, label: "Docker" },
  { icon: Code2, label: "gRPC" },
  { icon: Terminal, label: "Vite" },
  { icon: Code2, label: "Tailwind" },
  { icon: Database, label: "Redis" },
  { icon: Cpu, label: "System Design" },
];

const stats = [
  { label: "Focus", value: "Product + AI systems" },
  { label: "Mode", value: "Build, refine, ship" },
  { label: "Taste", value: "Minimal, technical" },
];

function SectionTitle({
  index,
  title,
  eyebrow,
}: {
  index: string;
  title: string;
  eyebrow?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-zinc-200 pb-3 dark:border-zinc-800">
      <div>
        <div className="mb-2 flex items-center gap-3">
          <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{index}</span>
          <span className="h-px w-10 bg-zinc-200 dark:bg-zinc-800" />
          {eyebrow && <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">{eyebrow}</span>}
        </div>
        <h2 className="text-2xl font-bold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 md:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

function PixelHeroMark() {
  return (
    <div className="inline-flex items-end gap-0.5" aria-hidden="true">
      <span className="text-7xl font-black leading-none tracking-[-0.24em] text-zinc-950 dark:text-zinc-50 md:text-8xl">
        TN
      </span>
      <motion.span
        className="relative -top-[0.2cm] left-[0.2cm] mb-[0.12em] h-3 w-3 bg-zinc-950 dark:bg-zinc-50"
        animate={{ opacity: [1, 0.25, 1], scale: [1, 0.78, 1] }}
        transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function RoleSwitcher() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const role = roles[roleIndex];

  useEffect(() => {
    const isComplete = displayText === role;
    const isEmpty = displayText.length === 0;
    const delay = isComplete && !isDeleting ? 1400 : isDeleting ? 46 : 82;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isComplete) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
        return;
      }

      setDisplayText((text) => {
        const nextLength = isDeleting ? text.length - 1 : text.length + 1;
        return role.slice(0, Math.max(0, nextLength));
      });
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [displayText, isDeleting, role]);

  return (
    <span
      className="relative block h-7 w-[14.5rem] max-w-full overflow-hidden text-[12px] font-semibold uppercase leading-none tracking-[0.18em] text-zinc-950 dark:text-zinc-50"
      aria-label={role}
    >
      <span className="invisible block whitespace-nowrap leading-none">Full-Stack Engineer</span>
      <motion.span
        className="absolute left-0 top-1/2 block -translate-y-1/2 whitespace-nowrap leading-none"
        animate={{ opacity: displayText ? 1 : 0.65 }}
        transition={{ duration: 0.2 }}
      >
        {displayText || "\u00a0"}
      </motion.span>
    </span>
  );
}

export function About() {
  return (
    <div className="bg-[#faf9f5] transition-colors dark:bg-[#09090b]">
      <motion.section variants={stagger} initial="hidden" animate="show">
        <div className="relative flex min-h-[15rem] items-center justify-center overflow-hidden border-b border-zinc-200 bg-white/35 px-6 py-12 dark:border-zinc-800 dark:bg-zinc-950/35">
          <div className="telegram-doodle-pattern absolute inset-0 opacity-28 dark:opacity-24" />
          <motion.div className="relative z-10" variants={fadeUp}>
            <PixelHeroMark />
          </motion.div>
        </div>

        <div className="relative border-b border-zinc-200 dark:border-zinc-800">
          <div
            className="h-24 border-b border-zinc-200 bg-white/30 dark:border-zinc-800 dark:bg-zinc-950/30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--stripe-color) 0, var(--stripe-color) 1px, transparent 1px, transparent 9px)",
            }}
          />

          <div className="grid gap-6 px-5 pb-6 pt-0 md:grid-cols-[9.5rem_1fr] md:px-8">
            <motion.div
              className="-mt-12 flex h-28 w-28 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-[0_1px_0_rgba(24,24,27,0.05)] dark:border-zinc-800 dark:bg-zinc-950 md:h-32 md:w-32"
              variants={fadeUp}
            >
              <img
                src={profileAvatar}
                alt="Tung Nguyen avatar"
                className="h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] rounded-full object-cover object-center"
              />
            </motion.div>

            <div className="-mt-2 md:mt-0 md:pt-3">
              <motion.div className="flex flex-wrap items-center gap-2" variants={fadeUp}>
                <h1 className="text-3xl font-bold tracking-[-0.075em] text-zinc-950 dark:text-zinc-50 md:text-5xl">Tung Nguyen</h1>
                <BadgeCheck size={25} className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.45)]" />
              </motion.div>
              <motion.div className="mt-3 h-7" variants={fadeUp}>
                <RoleSwitcher />
              </motion.div>
              <motion.p className="mt-3 max-w-2xl text-[14px] leading-7 text-zinc-600 dark:text-zinc-400" variants={fadeUp}>
                Clean product engineering with a practical full-stack base, AI workflow fluency, restrained visual taste, and enough technical detail to feel credible.
              </motion.p>
              <motion.div className="mt-5 grid gap-2 sm:grid-cols-3" variants={stagger}>
                {profileLinks.map(({ icon: Icon, label, value, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group flex min-w-0 items-center gap-2 rounded-md border border-zinc-200 bg-white/65 px-3 py-2 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/65 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-950 dark:hover:text-zinc-50"
                    variants={fadeUp}
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors group-hover:text-zinc-950 dark:border-zinc-800 dark:bg-[#09090b] dark:text-zinc-500 dark:group-hover:text-zinc-50">
                      <Icon size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-950 dark:text-zinc-50">{label}</span>
                      <span className="mt-0.5 block truncate text-[11px] text-zinc-500 dark:text-zinc-500">{value}</span>
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="px-5 py-8 md:px-8 md:py-10">
        <SectionTitle index="01" title="About" eyebrow="profile" />
        <ul className="space-y-4">
          {aboutBullets.map((item) => (
            <li key={item} className="grid grid-cols-[1rem_1fr] gap-3 text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
              <span className="pt-1.5 text-zinc-300 dark:text-zinc-700">-</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10">
        <SectionTitle index="02" title="Stack" eyebrow="tools" />
        <div className="flex flex-wrap gap-2">
          {technologies.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-200 bg-white/70 px-3 text-[12px] text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              <Icon size={14} className="text-zinc-400 dark:text-zinc-600" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="grid border-t border-zinc-200 dark:border-zinc-800 md:grid-cols-3">
        {stats.map((item) => (
          <div key={item.label} className="border-t border-zinc-200 px-5 py-6 first:border-t-0 dark:border-zinc-800 md:border-l md:border-t-0 md:px-8 md:first:border-l-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">{item.label}</p>
            <p className="mt-3 text-[15px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
