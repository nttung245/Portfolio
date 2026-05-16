import { ArrowUpRight, CalendarDays, ExternalLink, Github } from "lucide-react";

const projects = [
  {
    id: "01",
    title: "Neural Engine DB",
    period: "2026",
    type: "Data layer",
    desc: "High-performance search and signal-processing layer with typed service boundaries.",
    points: ["Query path tuned for low-latency reads", "Service contract documented with gRPC", "Deployment-ready Docker workflow"],
    tech: ["Rust", "PostgreSQL", "gRPC", "Docker"],
  },
  {
    id: "02",
    title: "Null Protocol",
    period: "2025",
    type: "Secure messaging",
    desc: "Private-room messaging concept with realtime delivery and a quiet, focused interface.",
    points: ["Encrypted channel model", "Presence and message state over WebSockets", "React dashboard for conversation flows"],
    tech: ["Go", "WebSockets", "React", "Crypto"],
  },
  {
    id: "03",
    title: "Void Terminal",
    period: "2025",
    type: "Developer tool",
    desc: "A browser terminal experience with command feedback, sessions, and persistent state.",
    points: ["Command parser and session history", "Redis-backed state for fast restores", "Accessible keyboard-first controls"],
    tech: ["TypeScript", "Node.js", "xterm.js", "Redis"],
  },
  {
    id: "04",
    title: "Mono Portfolio",
    period: "2026",
    type: "Portfolio system",
    desc: "Minimal developer portfolio rebuilt around scan-friendly structure and restrained motion.",
    points: ["One-page anchor navigation", "Reusable content sections", "Responsive dossier-style layout"],
    tech: ["React", "Motion", "Tailwind", "Vite"],
  },
];

function SectionHeader() {
  return (
    <div className="border-b border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[11px] text-zinc-400 dark:text-zinc-600">01</span>
        <span className="h-px w-10 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">selected work</span>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 md:text-5xl">Projects</h2>
          <p className="mt-3 max-w-2xl text-[14px] leading-7 text-zinc-600 dark:text-zinc-400">
            A compact index of systems, tools, and interface work. The layout stays plain so the content is easier to scan.
          </p>
        </div>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center gap-2 self-start rounded-md border border-zinc-200 bg-white px-3 text-[12px] text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50 md:self-auto"
        >
          GitHub <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <div className="bg-[#faf9f5] transition-colors dark:bg-[#09090b]">
      <SectionHeader />

      <div>
        {projects.map((project) => (
          <article
            key={project.id}
            className="group grid gap-5 border-b border-zinc-200 px-5 py-6 transition-colors hover:bg-white/[0.55] dark:border-zinc-800 dark:hover:bg-zinc-950/55 md:grid-cols-[4rem_1fr_auto] md:px-8"
          >
            <div className="flex items-center gap-3 md:block">
              <span className="text-[12px] text-zinc-400 dark:text-zinc-600">{project.id}</span>
              <span className="hidden md:mt-5 md:block md:h-px md:w-8 md:bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-xl font-bold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 md:text-2xl">{project.title}</h3>
                <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                  {project.type}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-500">
                <CalendarDays size={14} />
                <span>{project.period}</span>
              </div>

              <p className="mt-4 max-w-3xl text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">{project.desc}</p>

              <ul className="mt-4 space-y-2">
                {project.points.map((point) => (
                  <li key={point} className="grid grid-cols-[1rem_1fr] gap-2 text-[12px] leading-6 text-zinc-500 dark:text-zinc-500">
                    <span className="text-zinc-300 dark:text-zinc-700">-</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="rounded-md border border-zinc-200 bg-white/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 md:justify-end">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                title={`View source for ${project.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
              >
                <Github size={15} />
              </a>
              <a
                href="#contact"
                title={`Discuss ${project.title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
