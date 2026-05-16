import { Github, Linkedin, Mail, MapPin, MessageCircle, Send } from "lucide-react";

const socialLinks = [
  { icon: Github, label: "GitHub", value: "https://github.com/nttung245", href: "https://github.com/nttung245" },
  { icon: Linkedin, label: "LinkedIn", value: "https://www.linkedin.com/in/nttung245/", href: "https://www.linkedin.com/in/nttung245/" },
  { icon: Mail, label: "Email", value: "nguyenthanhtung020405@gmail.com", href: "mailto:nguyenthanhtung020405@gmail.com" },
  { icon: MapPin, label: "Location", value: "Ho Chi Minh City, Vietnam", href: "#contact" },
];

const notes = [
  "I am most useful when a project needs both implementation clarity and careful interface judgement.",
  "The work I enjoy tends to sit between product engineering, frontend systems, backend structure, and small UX details.",
  "For new work, I prefer clear scope, honest constraints, and a bias toward shipping something maintainable.",
];

function Label({ index, text }: { index: string; text: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">{index}</span>
      <span className="h-px w-10 bg-zinc-200 dark:bg-zinc-800" />
      <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-600">{text}</span>
    </div>
  );
}

export function Contact() {
  return (
    <div className="bg-[#faf9f5] transition-colors dark:bg-[#09090b]">
      <section className="border-b border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10">
        <Label index="01" text="connect" />
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 className="text-3xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 md:text-5xl">
            Open to practical, well-built products.
          </h2>
          <p className="text-[14px] leading-7 text-zinc-600 dark:text-zinc-400">
            Send a note for product builds, portfolio-level interfaces, internal tools, or technical collaboration.
          </p>
        </div>
      </section>

      <section className="grid border-b border-zinc-200 dark:border-zinc-800 md:grid-cols-2">
        {socialLinks.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="group flex min-h-24 items-center gap-4 border-t border-zinc-200 px-5 py-5 transition-colors hover:bg-white/[0.55] first:border-t-0 dark:border-zinc-800 dark:hover:bg-zinc-950/55 md:border-l md:px-8 md:[&:nth-child(-n+2)]:border-t-0 md:[&:nth-child(odd)]:border-l-0"
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors group-hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500 dark:group-hover:text-zinc-50">
              <Icon size={17} />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-zinc-50">{label}</span>
              <span className="mt-1 block truncate text-[12px] text-zinc-500 dark:text-zinc-500">{value}</span>
            </span>
          </a>
        ))}
      </section>

      <section className="grid border-b border-zinc-200 dark:border-zinc-800 lg:grid-cols-[0.92fr_1.08fr]">
        <div
          className="border-b border-zinc-200 px-5 py-8 dark:border-zinc-800 md:px-8 md:py-10 lg:border-b-0 lg:border-r"
        >
          <Label index="02" text="notes" />
          <div className="space-y-4">
            {notes.map((note) => (
              <p key={note} className="text-[14px] leading-7 text-zinc-700 dark:text-zinc-300">
                {note}
              </p>
            ))}
          </div>
        </div>

        <form
          className="px-5 py-8 md:px-8 md:py-10"
        >
          <Label index="03" text="message" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-[13px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
              placeholder="your name"
            />
            <input
              className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-[13px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
              placeholder="your email"
            />
            <textarea
              rows={6}
              className="min-h-36 resize-none rounded-md border border-zinc-200 bg-white p-3 text-[13px] text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 sm:col-span-2"
              placeholder="write something concise..."
            />
          </div>
          <button
            type="button"
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300"
          >
            <Send size={14} /> Send
          </button>
        </form>
      </section>

      <section
        className="px-5 py-8 md:px-8 md:py-10"
      >
        <Label index="04" text="status" />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 md:text-3xl">Available for selective work.</h2>
            <p className="mt-2 text-[13px] leading-6 text-zinc-500 dark:text-zinc-500">Best fit: product engineering, systems, dashboards, and sharp portfolio builds.</p>
          </div>
          <a
            href="mailto:hello@tung.dev"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-[12px] text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
          >
            <MessageCircle size={14} /> Start a thread
          </a>
        </div>
      </section>
    </div>
  );
}
