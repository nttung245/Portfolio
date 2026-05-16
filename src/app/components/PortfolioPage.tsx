import { Fragment, useEffect } from "react";
import { useLocation } from "react-router";
import { motion } from "motion/react";
import { About } from "./About";
import { Contact } from "./Contact";
import { Education, WorkExperience } from "./ResumeSections";

const sections = [
  { id: "about", marker: "01", label: "profile", Component: About },
  { id: "education", marker: "02", label: "education", Component: Education },
  { id: "experience", marker: "03", label: "work experience", Component: WorkExperience },
  { id: "contact", marker: "04", label: "connect", Component: Contact },
];

function PatternStrip({ label }: { label: string }) {
  return (
    <div className="relative h-9 overflow-hidden border-y border-zinc-200 bg-white/40 dark:border-zinc-800 dark:bg-zinc-950/40">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--stripe-color) 0, var(--stripe-color) 1px, transparent 1px, transparent 9px)",
        }}
      />
      <span className="absolute left-6 top-1/2 -translate-y-1/2 bg-[#faf9f5] px-2 text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:bg-[#09090b] dark:text-zinc-500">
        {label}
      </span>
    </div>
  );
}

export function PortfolioPage() {
  const location = useLocation();

  useEffect(() => {
    const scrollToCurrentHash = (behavior: ScrollBehavior) => {
      const hash = window.location.hash || location.hash;
      const id = hash.replace("#", "") || "about";

      document.getElementById(id)?.scrollIntoView({
        behavior,
        block: "start",
      });
    };

    const hash = window.location.hash || location.hash;
    const timeout = window.setTimeout(() => {
      scrollToCurrentHash(hash ? "smooth" : "auto");
    }, hash ? 80 : 0);

    const handleHashChange = () => scrollToCurrentHash("smooth");
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location.hash, location.pathname]);

  return (
    <div className="relative mx-auto overflow-hidden border-x border-zinc-200 bg-[#faf9f5]/[0.82] shadow-[0_1px_0_rgba(24,24,27,0.04)] dark:border-zinc-800 dark:bg-[#09090b]/[0.82]">
      {sections.map(({ id, marker, label, Component }, index) => (
        <Fragment key={id}>
          <motion.section
            id={id}
            className="relative scroll-mt-20"
            initial={{ opacity: 0.96, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.12 }}
            transition={{ duration: 0.45, delay: index === 0 ? 0 : 0.03, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="pointer-events-none absolute left-4 top-5 hidden text-[10px] uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-700 md:block">
              {marker}
            </span>
            <Component />
          </motion.section>

          {index < sections.length - 1 && <PatternStrip label={label} />}
        </Fragment>
      ))}
    </div>
  );
}
