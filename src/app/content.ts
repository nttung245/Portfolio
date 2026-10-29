export const profile = {
  name: "Tung Nguyen",
  role: "Applied AI Engineer",
  location: "Ho Chi Minh City, Vietnam",
  coordinates: "10.8°N 106.7°E",
  email: "nguyenthanhtung020405@gmail.com",
  github: "https://github.com/nttung245",
  linkedin: "https://www.linkedin.com/in/nttung245/",
};

export const roles = ["Full-stack", "AI engineer"];

export const objective = [
  "IT major focused on software engineering and applied AI. Experienced in building reliable services, integrating APIs, and automating workflows with LLMs.",
  "Comfortable with system design, data flows, and deployment practices. Seeking software or AI engineering roles where I can deliver production-ready features and measurable impact.",
];

export const headlineStat = {
  value: 48,
  caption:
    "Roughly this share of Hilab's daily business orders is now automated by the AI design-personalization pipeline I built and deployed.",
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  more: string[];
  tech: string[];
};

export const experiences: Experience[] = [
  {
    company: "Hilab Technology",
    role: "AI Engineer",
    period: "May 2026 – Present",
    highlights: [
      "Built and deployed an AI-powered design personalization pipeline automating approximately 48% of daily business orders, covering order ingestion, source resolution, personalization, AI editing, QA, and final design upload.",
      "Engineered asynchronous batch processing and production reliability with FastAPI, Celery, Redis, PostgreSQL, and Docker, including scheduling, retries, recovery, audit trails, and actionable failure classification.",
      "Developing a multi-tenant enterprise knowledge and BI platform that unifies warehouse data, internal documents, and knowledge graphs into a conversational interface with traceable sources. This platform is in development.",
    ],
    more: [
      "Evaluated self-hosted image AI approaches including Qwen-Image-Layered, SAM2, LaMa, and diffusion/LoRA across VRAM constraints, latency, layer separation, mask fidelity, and text preservation; findings informed a hybrid local/cloud architecture.",
      "Developed hybrid image-editing workflows using Gemini/OpenAI, deterministic typography, OCR/CV, region detection, and mask-based compositing, with human review for uncertain outputs.",
      "Contributed to governed routing across semantic metrics, graph traversal, document retrieval, and grounded LLM synthesis, alongside document ingestion, belief memory, tenant isolation, and evaluation.",
      "Working across a distributed Go/Python/Next.js stack backed by PostgreSQL, ClickHouse, FalkorDB, Elasticsearch, and Redis.",
    ],
    tech: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "Docker", "Gemini/OpenAI", "Go", "Next.js", "ClickHouse", "FalkorDB", "Elasticsearch"],
  },
  {
    company: "IEC Research Group",
    role: "AI Researcher",
    period: "2024 – Present",
    highlights: [
      "Architected a multi-LLM orchestration layer supporting Google Gemini, Groq, and MetaClaw proxy with LangChain.",
      "Reduced AI hallucination risk by implementing an auth contamination prevention system.",
      "Contributed to small-scale multi-agent research projects using AutoGen, Flowise, and CrewAI.",
    ],
    more: [
      "Explored Airflow and MLflow for ResNet50 model experimentation and workflow management.",
      "Collaborated with a professor to propose new ideas and improve ongoing research projects.",
    ],
    tech: ["MetaClaw", "Docker", "LlamaIndex", "LangChain", "FastAPI", "ChromaDB"],
  },
];

export type PlaygroundWorld = {
  name: string;
  blurb: string;
  facts: string[];
  /** The world running live: Agent Arena's embed mode on the GitHub Pages deploy of my fork. */
  live: string;
  day: string;
  night: string;
  dayAlt: string;
  nightAlt: string;
};

const arena = "https://nttung245.github.io/agent-arena/";

export const playground = {
  intro:
    "Worlds I built for Agent Arena, an open-source playground where LLM agents live on a 3D map and chat. Each one is a single map file on a CC0 model kit I adapted, with its own light, props, and named places the agents can talk about. Both run live below: drag to look around.",
  project: { label: "Agent Arena", href: "https://github.com/nttung245/agent-arena" },
  craft:
    "Baked glow maps into the models so jack-o'-lanterns and the greenhouse light up at night, and gave each kit one shared scale so modular pieces keep their true proportions.",
  credits: [
    "Three.js · React Three Fiber · glTF",
    "Worlds: Kenney Graveyard and Space kits (CC0)",
    "Characters: J-Toastie · vulture: Poly by Google (CC BY 3.0)",
  ],
};

export const playgroundWorlds: PlaygroundWorld[] = [
  {
    name: "Halloween",
    blurb:
      "A haunted hollow: an iron-fenced graveyard and mausoleum, a pumpkin patch of jack-o'-lanterns, and a cauldron on a campfire, with a ghost, a skeleton, a zombie and a vampire on the loose.",
    facts: ["135 props", "19 lights", "5 places"],
    live: `${arena}?embed&map=halloween&time=cycle`,
    day: new URL("../../playground/halloween-day.webp", import.meta.url).href,
    night: new URL("../../playground/halloween-night.webp", import.meta.url).href,
    dayAlt: "The Halloween world by day: a graveyard with a mausoleum, a pumpkin patch and crooked pines under a dusky purple sky.",
    nightAlt: "The Halloween world at night: jack-o'-lanterns, lanterns, fire baskets and a ghost glowing in the dark.",
  },
  {
    name: "Mars",
    blurb:
      "A red-planet base: hab and greenhouse domes, a rocket on its launch pad, a solar field and impact craters, with astronauts at work and something small and green by the biggest crater.",
    facts: ["77 props", "11 lights", "5 places"],
    live: `${arena}?embed&map=red_planet&time=cycle`,
    day: new URL("../../playground/mars-day.webp", import.meta.url).href,
    night: new URL("../../playground/mars-night.webp", import.meta.url).href,
    dayAlt: "The Mars world by day: white domes, a rocket beside its gantry, solar panels and craters on rust-red ground.",
    nightAlt: "The Mars world at night: the greenhouse dome glowing pink, blue beacons around the floodlit rocket pad.",
  },
];

export const skillGroups = [
  { name: "Languages", items: ["Python", "TypeScript", "JavaScript", "Go", "Rust", "SQL", "Bash", "C++"] },
  { name: "AI · LLM", items: ["LangChain", "LlamaIndex", "Gemini / OpenAI", "AutoGen", "CrewAI", "ChromaDB"] },
  { name: "Web", items: ["React", "Next.js", "Node.js", "Express", "FastAPI", "Celery", "gRPC", "Vite", "Tailwind"] },
  { name: "Data", items: ["PostgreSQL", "Redis", "ClickHouse", "Elasticsearch", "FalkorDB"] },
  { name: "Infra", items: ["Docker", "Docker Compose", "Airflow", "MLflow", "Grafana", "GitHub Actions", "Jenkins", "AWS", "GCP", "System design"] },
];

export const education = {
  school: "VNU-HCM University of Information Technology",
  short: "UIT",
  degree: "Computer Network and Data Communication",
  period: "2023 – 2027",
  gpa: "3.5 / 4",
};

export const certifications = [
  { name: "Machine Learning in Production", ring: "Machine Learning in Production · 2026", year: "2026" },
  { name: "AWS Cloud Technical Essentials", ring: "AWS Cloud Technical Essentials · 2025", year: "2025" },
  { name: "IBM AI Engineering with Python, PyTorch & TensorFlow", ring: "IBM AI Engineering · 2024", year: "2024" },
  { name: "IELTS 6.5", ring: "IELTS 6.5", year: "2023 – 2025" },
];

function composeUrl(base: string, params: Record<string, string>) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

const subject = "Portfolio inquiry";

export const composeLinks = [
  {
    label: "Gmail",
    href: composeUrl("https://mail.google.com/mail/", { view: "cm", fs: "1", to: profile.email, su: subject }),
  },
  {
    label: "Outlook",
    href: composeUrl("https://outlook.live.com/mail/0/deeplink/compose", { to: profile.email, subject }),
  },
];
