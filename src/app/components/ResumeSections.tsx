import { BriefcaseBusiness, CalendarDays, GraduationCap, Layers3 } from "lucide-react";

const education = {
  school: "VNU-HCM University of Information Technology",
  period: "2023 - 2027",
  degree: "Computer Network and Data Communication",
  meta: ["GPA: 3.5 / 4", "Ho Chi Minh City, Vietnam"],
};

const experiences = [
  {
    company: "Hilab Technology",
    role: "AI Engineer",
    period: "May 2026 - Present",
    current: true,
    points: [
      "Built and deployed an AI-powered design personalization pipeline automating approximately 48% of daily business orders, covering order ingestion, source resolution, personalization, AI editing, QA, and final design upload.",
      "Evaluated self-hosted image AI approaches including Qwen-Image-Layered, SAM2, LaMa, and diffusion/LoRA across VRAM constraints, latency, layer separation, mask fidelity, and text preservation; findings informed a hybrid local/cloud architecture.",
      "Developed hybrid image-editing workflows using Gemini/OpenAI, deterministic typography, OCR/CV, region detection, and mask-based compositing, with human review for uncertain outputs.",
      "Engineered asynchronous batch processing and production reliability with FastAPI, Celery, Redis, PostgreSQL, and Docker, including scheduling, retries, recovery, audit trails, and actionable failure classification.",
      "Developing a multi-tenant enterprise knowledge and BI platform that unifies warehouse data, internal documents, and knowledge graphs into a conversational interface with traceable sources. This platform is in development.",
      "Contributed to governed routing across semantic metrics, graph traversal, document retrieval, and grounded LLM synthesis, alongside document ingestion, belief memory, tenant isolation, and evaluation.",
      "Working across a distributed Go/Python/Next.js stack backed by PostgreSQL, ClickHouse, FalkorDB, Elasticsearch, and Redis.",
    ],
    tech: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "Docker", "Gemini/OpenAI", "Go", "Next.js", "ClickHouse", "FalkorDB", "Elasticsearch"],
  },
  {
    company: "IEC Research Group",
    role: "AI Researcher",
    period: "2024 - Present",
    current: true,
    points: [
      "Contributed to small-scale multi-agent research projects using AutoGen, Flowise, and CrewAI.",
      "Explored Airflow and MLflow for ResNet50 model experimentation and workflow management.",
      "Collaborated with a professor to propose new ideas and improve ongoing research projects.",
      "Architected a multi-LLM orchestration layer supporting Google Gemini, Groq, and MetaClaw proxy with LangChain.",
      "Reduced AI hallucination risk by implementing an auth contamination prevention system.",
    ],
    tech: ["MetaClaw", "Docker", "LlamaIndex", "LangChain", "FastAPI", "ChromaDB"],
  },
];

function SectionLabel({ index, eyebrow }: { index: string; eyebrow: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{index}</span>
      <span className="h-px w-10 bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">{eyebrow}</span>
    </div>
  );
}

function TechList({ items }: { items: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md border border-zinc-200 bg-white/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function Education() {
  return (
    <div className="bg-[#faf9f5] transition-colors dark:bg-[#09090b]">
      <section className="border-b border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10">
        <SectionLabel index="01" eyebrow="education" />
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Education
          </h2>
          <p className="text-[14px] leading-7 text-zinc-600 dark:text-zinc-400">
            Academic foundation in networking, data communication, and applied software systems.
          </p>
        </div>
      </section>

      <article className="grid gap-5 border-b border-zinc-200 px-5 py-6 dark:border-zinc-800 md:grid-cols-[4rem_1fr_auto] md:px-8">
        <div className="flex items-center gap-3 md:block">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
            <GraduationCap size={18} />
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-bold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 md:text-2xl">
            {education.school}
          </h3>
          <p className="mt-2 text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">{education.degree}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {education.meta.map((item) => (
              <span
                key={item}
                className="rounded-md border border-zinc-200 bg-white/70 px-2.5 py-1 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-zinc-500 dark:text-zinc-500 md:items-start md:justify-end">
          <CalendarDays size={14} />
          <span>{education.period}</span>
        </div>
      </article>
    </div>
  );
}

export function WorkExperience() {
  return (
    <div className="bg-[#faf9f5] transition-colors dark:bg-[#09090b]">
      <section className="border-b border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10">
        <SectionLabel index="01" eyebrow="experience" />
        <div className="flex max-w-3xl flex-col gap-3">
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Work Experience
          </h2>
          <p className="text-[14px] leading-7 text-zinc-600 dark:text-zinc-400">
            AI engineering and research work across agent systems, LLM tooling, deployment, and internal automation.
          </p>
        </div>
      </section>

      <div>
        {experiences.map((experience, index) => (
          <article
            key={experience.company}
            className="grid gap-5 border-b border-zinc-200 px-5 py-6 transition-colors hover:bg-white/[0.55] dark:border-zinc-800 dark:hover:bg-zinc-950/55 md:grid-cols-[4rem_1fr_auto] md:px-8"
          >
            <div className="flex items-center gap-3 md:block">
              <span className="text-[12px] text-zinc-400 dark:text-zinc-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="hidden md:mt-5 md:block md:h-px md:w-8 md:bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="min-w-0">
              <div>
                <div className="flex min-w-0 items-center gap-2">
                  <h3 className="text-xl font-bold tracking-[-0.04em] text-zinc-950 dark:text-zinc-50 md:text-2xl">
                    {experience.company}
                  </h3>
                  {experience.current && (
                    <span
                      className="relative inline-flex h-2.5 w-2.5 shrink-0"
                      title="Currently working here"
                      aria-label="Currently working here"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky-500 shadow-[0_0_14px_rgba(14,165,233,0.75)]" />
                    </span>
                  )}
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                  <BriefcaseBusiness size={12} /> {experience.role}
                </span>
              </div>

              <ul className="mt-4 space-y-2">
                {experience.points.map((point) => (
                  <li
                    key={point}
                    className="grid grid-cols-[1rem_1fr] gap-2 text-[13px] leading-6 text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="text-zinc-300 dark:text-zinc-700">-</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <TechList items={experience.tech} />
            </div>

            <div className="flex items-start gap-2 text-[12px] text-zinc-500 dark:text-zinc-500 md:justify-end">
              <Layers3 size={14} className="mt-0.5 shrink-0" />
              <span>{experience.period}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
