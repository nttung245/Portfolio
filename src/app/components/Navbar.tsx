import { Github, Mail, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";
import { MusicPlayer } from "./MusicPlayer";

const links = [
  { id: "about", label: "Portfolio" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

function PixelMark() {
  return (
    <span className="inline-flex items-end gap-0.5" aria-hidden="true">
      <span className="font-mono text-[1.45rem] font-black leading-none tracking-[-0.22em] text-zinc-950 dark:text-zinc-50">
        TN
      </span>
      <span className="mb-0.5 h-1.5 w-1.5 bg-zinc-950 dark:bg-zinc-50" />
    </span>
  );
}

type NavbarProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function Navbar({ theme, onToggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-26% 0px -60% 0px", threshold: [0.12, 0.32, 0.56] }
    );

    links.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    const syncHash = () => {
      const id = window.location.hash.replace("#", "");
      if (links.some((link) => link.id === id)) setActiveSection(id);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);

  const handleNav = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveSection(id);
    setIsOpen(false);

    const target = document.getElementById(id);
    if (!target) return;

    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/90 bg-[#faf9f5]/[0.9] backdrop-blur-xl transition-colors dark:border-zinc-800/90 dark:bg-[#09090b]/[0.9]">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#about"
          onClick={handleNav("about")}
          className="group inline-flex items-center gap-3 focus-visible:outline-none"
          aria-label="Home"
        >
          <PixelMark />
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 transition-colors group-hover:text-zinc-950 dark:text-zinc-500 dark:group-hover:text-zinc-50 sm:inline">
            portfolio
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.id;

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleNav(link.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative py-4 text-[13px] font-medium transition-colors focus-visible:outline-none ${
                  isActive
                    ? "text-zinc-950 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-line"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-zinc-950 dark:bg-zinc-50"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <MusicPlayer />
          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white/70 text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="https://github.com/nttung245"
            target="_blank"
            rel="noreferrer"
            title="GitHub"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white/70 text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50 md:inline-flex"
          >
            <Github size={16} />
          </a>
          <a
            href="mailto:nguyenthanhtung020405@gmail.com"
            title="Email"
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white/70 text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50 md:inline-flex"
          >
            <Mail size={16} />
          </a>

          <motion.button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white/80 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-50 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.92 }}
            aria-label="Toggle navigation"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.16 }}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mx-auto flex max-w-5xl flex-col border-t border-zinc-200 bg-[#faf9f5] px-4 py-2 dark:border-zinc-800 dark:bg-[#09090b] sm:px-6 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {links.map((link, index) => {
              const isActive = activeSection === link.id;

              return (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={handleNav(link.id)}
                  className={`border-b border-zinc-200 py-3 text-[12px] uppercase tracking-[0.18em] last:border-b-0 ${
                    isActive
                      ? "text-zinc-950 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-500"
                  }`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.18 }}
                >
                  {link.label}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
