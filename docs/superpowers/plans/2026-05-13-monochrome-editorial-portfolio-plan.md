# Monochrome Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio from a Spotify-themed music app aesthetic to a monochrome editorial developer portfolio with cold obsidian + stars background, professional dev sections, and a separate playlist page for songs.

**Architecture:** Modify 6 files across the existing project — CSS theme file for background/variables, Root.tsx for orbs/glow, and 3 page components (About, Projects, Contact) plus Navbar. No new files needed.

**Tech Stack:** React 18, Vite, Tailwind CSS v4, motion/react, lucide-react, JetBrains Mono font

---

## File Map

| File | Responsibility | Change Level |
|------|---------------|-------------|
| `src/styles/theme.css` | CSS variables, body background, stars, Tailwind theme | **Rewrite** — colors, background, body styles |
| `src/app/components/Root.tsx` | Background orbs, mouse glow, noise, cursor, layout shell | **Modify** — orb colors/count, glow color |
| `src/app/components/Navbar.tsx` | Floating nav pill, logo, nav links | **Modify** — logo text, active indicator color |
| `src/app/components/About.tsx` | About/hero, tech stack, projects, principles | **Rewrite** — new 4-section editorial layout |
| `src/app/components/Projects.tsx` | Playlist page (music tracks metaphor) | **Minor** — accent color swap only |
| `src/app/components/Contact.tsx` | Contact page, social links, form | **Modify** — numbered sections, remove bottom image, cold accent |

---

### Task 1: Update CSS Theme — Colors, Background, Stars

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Update color variables in `:root` and `.dark`**

Replace the warm gray variables with cold obsidian palette:

```css
:root {
  --font-size: 16px;
  --background: #0a0a10;
  --foreground: #e8e8e8;
  --card: rgba(17,17,17,0.6);
  --card-foreground: #e8e8e8;
  --popover: #0a0a10;
  --popover-foreground: #e8e8e8;
  --primary: #e8e8e8;
  --primary-foreground: #0a0a10;
  --secondary: #1a1a20;
  --secondary-foreground: #e8e8e8;
  --muted: #171720;
  --muted-foreground: #9a9892;
  --accent: #38bdf8;
  --accent-foreground: #0a0a10;
  --destructive: #8f8f8f;
  --destructive-foreground: #ffffff;
  --border: rgba(255,255,255,0.1);
  --input: rgba(255,255,255,0.06);
  --input-background: rgba(0,0,0,0.2);
  --switch-background: #343434;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: rgba(56,189,248,0.45);
  --chart-1: #38bdf8;
  --chart-2: #8b5cf6;
  --chart-3: #06b6d4;
  --chart-4: #3b82f6;
  --chart-5: #343434;
  --radius: 0.9rem;
}

.dark {
  --background: #0a0a10;
  --foreground: #e8e8e8;
  --card: rgba(17,17,17,0.6);
  --card-foreground: #e8e8e8;
  --popover: #0a0a10;
  --popover-foreground: #e8e8e8;
  --primary: #e8e8e8;
  --primary-foreground: #0a0a10;
  --secondary: #1a1a20;
  --secondary-foreground: #e8e8e8;
  --muted: #171720;
  --muted-foreground: #9a9892;
  --accent: #38bdf8;
  --accent-foreground: #0a0a10;
  --destructive: #8f8f8f;
  --destructive-foreground: #ffffff;
  --border: rgba(255,255,255,0.1);
  --input: rgba(255,255,255,0.06);
  --ring: rgba(56,189,248,0.45);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
}
```

- [ ] **Step 2: Replace the body background with cold obsidian + stars**

Replace the entire `body` block in `@layer base`:

```css
  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background:
      radial-gradient(ellipse at 30% 20%, #111118 0%, #0a0a10 50%, #060608 100%),
      conic-gradient(from 180deg at 70% 10%, rgba(56,189,248,0.04), rgba(139,92,246,0.03), rgba(6,182,212,0.02), rgba(56,189,248,0.04)),
      linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 15%);
    background-attachment: fixed;
    position: relative;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 1;
    background-image:
      radial-gradient(circle 1.5px at 15% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(circle 1px at 45% 12%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(circle 1px at 72% 35%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(circle 1px at 28% 55%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(circle 2px at 82% 65%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(circle 1px at 55% 80%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(circle 1px at 18% 78%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(circle 3px at 60% 18%, rgba(255,255,255,0.8) 0%, transparent 100%);
    box-shadow:
      0 0 6px rgba(255,255,255,0.3) 60% 18% 0 3px,
      0 0 4px rgba(255,255,255,0.2) 82% 65% 0 2px;
  }
```

Note: CSS `box-shadow` on pseudo-elements for star glow requires `inset` or `box-shadow` on the element itself — the above approach won't work for multiple glows. Instead, add the hero star glows as inline divs in the JSX of Root.tsx. For the CSS-only stars, keep just the `background-image` radial-gradient dots (7 dots total, most are 1px). The 2-3 hero stars with glow will be placed in Root.tsx JSX.

Simplified CSS body::before (just the subtle static stars):

```css
  body::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 1;
    background-image:
      radial-gradient(circle 1px at 15% 20%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(circle 1px at 45% 12%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(circle 1px at 72% 35%, rgba(255,255,255,0.25) 0%, transparent 100%),
      radial-gradient(circle 1px at 28% 55%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(circle 1.5px at 82% 65%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(circle 1px at 55% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
      radial-gradient(circle 1px at 18% 78%, rgba(255,255,255,0.2) 0%, transparent 100%);
  }
```

- [ ] **Step 3: Verify `@theme inline` section**

Keep the font declarations and all `--color-*` mappings as-is. They reference the CSS variables we just updated. No changes needed to the mapping layer — only the variable values changed.

- [ ] **Step 4: Commit**

```bash
git add src/styles/theme.css
git commit -m "style: cold obsidian theme with stars background"
```

---

### Task 2: Update Root.tsx — Orbs, Mouse Glow

**Files:**
- Modify: `src/app/components/Root.tsx`

- [ ] **Step 1: Replace the mouse-follow glow color**

Line 36 — change from green to cold blue, lower opacity:

```tsx
const glowBg = useMotionTemplate`radial-gradient(400px circle at ${glowX}px ${glowY}px, rgba(56,189,248,0.06), transparent 68%)`;
```

- [ ] **Step 2b: Add hero stars (visible divs with glow)**

Add 3 hero star divs inside the `div.min-h-screen` wrapper, at the top level, positioned absolutely with `fixed` and `pointer-events-none`. Place them after the noise overlay line (line 84 area):

```tsx
{/* Hero stars */}
<div className="fixed inset-0 z-[2] pointer-events-none">
  <div className="absolute top-[18%] left-[35%] h-[3px] w-[3px] rounded-full bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
  <div className="absolute top-[40%] right-[18%] h-[2.5px] w-[2.5px] rounded-full bg-white/70 shadow-[0_0_4px_rgba(255,255,255,0.3)]" />
  <div className="absolute bottom-[28%] left-[20%] h-[2px] w-[2px] rounded-full bg-white/60 shadow-[0_0_3px_rgba(255,255,255,0.2)]" />
</div>
```

- [ ] **Step 3: Replace the 3 animated orbs with a single subtle cold ambient glow**

Replace lines 64-82 (the three orbs + overlays) with:

```tsx
<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
  <motion.div
    className="absolute -top-48 right-[-10%] h-[40rem] w-[40rem] rounded-full bg-[#38bdf8]/06 blur-3xl"
    animate={{ opacity: [0.06, 0.12, 0.06] }}
    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
  />
  <motion.div
    className="absolute bottom-[-10rem] left-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#8b5cf6]/04 blur-3xl"
    animate={{ opacity: [0.04, 0.08, 0.04] }}
    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
  />
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_65%,rgba(0,0,0,0.8)_100%)]" />
</div>
```

Key changes:
- Green `#1ed760` orb → cold blue `#38bdf8` at 6% opacity
- Purple `#8b5cf6` orb stays but at 4% opacity
- Orange `#f97316` orb removed entirely
- Opacity ranges lowered significantly
- Removed the top white gradient overlay line

- [ ] **Step 4: Update noise opacity to 0.035**

Existing noise texture line — change `opacity-[0.045]` → `opacity-[0.035]`:

```tsx
<div className="fixed inset-0 z-[100] opacity-[0.035] pointer-events-none bg-[url('data:image/svg+xml;base64,...')] />
```

- [ ] **Step 5: Update the main background color**

Line 39 — change `bg-[#050505]` → `bg-[#0a0a10]` and `text-stone-200` → `text-[#e8e8e8]`:

```tsx
<div className="min-h-screen bg-[#0a0a10] text-[#e8e8e8] font-sans relative overflow-x-hidden selection:bg-stone-100 selection:text-black [cursor:none]">
```

- [ ] **Step 6: Commit**

```bash
git add src/app/components/Root.tsx
git commit -m "style: cold obsidian orbs and subtle blue mouse glow"
```

---

### Task 3: Update Navbar.tsx — Logo, Active Indicator

**Files:**
- Modify: `src/app/components/Navbar.tsx`

- [ ] **Step 1: Change logo text**

Line 29 — change `Mono.fm` to `TIM.DEV`:

```tsx
<span className="hidden sm:inline">TIM.DEV</span>
```

- [ ] **Step 2: Update active indicator color**

Line 49 — change the active nav pill from stone/green to cold accent:

```tsx
<motion.span
  layoutId="nav-pill"
  className="absolute inset-0 rounded-xl border border-[#38bdf8]/30 bg-[#38bdf8]/08 shadow-[0_0_28px_rgba(56,189,248,0.12)]"
  transition={{ type: "spring", stiffness: 420, damping: 38 }}
/>
```

- [ ] **Step 3: Update logo icon shadow**

Line 25 — change the logo icon shadow from green to cold:

```tsx
className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-black shadow-[0_0_34px_rgba(56,189,248,0.15)] transition-transform duration-300"
```

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Navbar.tsx
git commit -m "style: TIM.DEV logo, cold accent nav indicator"
```

---

### Task 4: Rewrite About.tsx — Full Monochrome Editorial

**Files:**
- Modify: `src/app/components/About.tsx`

- [ ] **Step 1: Rewrite the entire About component**

Replace the entire file content with:

```tsx
import { ArrowRight, Code2, Cpu, Database, Terminal } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { Link } from "react-router";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const technologies = [
  { icon: Code2, label: "React" },
  { icon: Cpu, label: "TypeScript" },
  { icon: Database, label: "PostgreSQL" },
  { icon: Terminal, label: "Node.js" },
  { icon: Code2, label: "Rust" },
  { icon: Cpu, label: "Go" },
  { icon: Terminal, label: "Docker" },
  { icon: Database, label: "gRPC" },
];

const projects = [
  {
    id: "01",
    title: "Neural Engine DB",
    desc: "High-performance data layer for fast search and signal processing",
    tech: ["Rust", "PostgreSQL", "gRPC"],
  },
  {
    id: "02",
    title: "Null Protocol",
    desc: "Encrypted messaging concept with private-room UX",
    tech: ["Go", "WebSockets", "React"],
  },
  {
    id: "03",
    title: "Void Terminal",
    desc: "Terminal experience remixed into a rounded modern shell",
    tech: ["TypeScript", "Node.js", "Redis"],
  },
  {
    id: "04",
    title: "Mono Portfolio",
    desc: "Music-app inspired portfolio with grayscale UI and motion accents",
    tech: ["React", "Motion", "Tailwind", "Vite"],
  },
];

const principles = [
  "Simple but expressive interfaces — clarity over cleverness",
  "Reliable structure — readable, maintainable, predictable",
  "Motion as rhythm — subtle, intentional, never decorative",
  "Every interaction earns its place on the screen",
];

export function About() {
  return (
    <div className="space-y-16 pb-8">
      {/* Section 01 — Hero */}
      <motion.section
        className="relative"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">01</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <motion.span
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#38bdf8]/80 mb-6"
          variants={fadeUp}
        >
          Initialize_
        </motion.span>

        <motion.h1
          className="font-mono text-5xl font-bold leading-[0.92] tracking-[-0.04em] text-[#e8e8e8] md:text-7xl lg:text-8xl"
          variants={fadeUp}
        >
          Tung Nguyen
        </motion.h1>

        <motion.p
          className="mt-4 font-mono text-sm text-[#666] md:text-base"
          variants={fadeUp}
        >
          Full-stack developer · Clean systems, alive interfaces
        </motion.p>

        <motion.div className="mt-8 flex flex-wrap gap-3" variants={fadeUp}>
          <Link
            to="/playlist"
            className="inline-flex items-center gap-2 rounded-lg border border-[#38bdf8]/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[#38bdf8] transition-colors hover:bg-[#38bdf8]/08"
          >
            View Projects <ArrowRight size={14} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-stone-300 transition-colors hover:bg-white/[0.04]"
          >
            Contact
          </Link>
        </motion.div>
      </motion.section>

      {/* Section 02 — Technology */}
      <motion.section
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">02</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-4">
          TECHNOLOGY
        </h2>

        <div className="flex flex-wrap gap-1.5">
          {technologies.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] px-3.5 py-1.5 font-mono text-[11px] text-[#e8e8e8] transition-colors hover:border-white/25 hover:bg-white/[0.03]"
            >
              <Icon size={12} className="text-[#666]" />
              {label}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Section 03 — Selected Work */}
      <motion.section
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">03</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-4">
          SELECTED WORK
        </h2>

        <div className="divide-y divide-white/[0.08]">
          {projects.map((p) => (
            <motion.div
              key={p.id}
              className="group flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between md:gap-6"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[#666]">{p.id}</span>
                  <h3 className="font-mono text-[14px] font-medium text-[#e8e8e8] group-hover:text-white transition-colors">
                    {p.title}
                  </h3>
                </div>
                <p className="font-mono text-[10px] text-[#666] mt-1 ml-6 md:ml-8">
                  {p.desc}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 ml-8 md:ml-0">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded border border-white/[0.08] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#9a9892]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 04 — Principles */}
      <motion.section
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">04</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-6">
          PRINCIPLES
        </h2>

        <div className="space-y-4">
          {principles.map((item, index) => (
            <motion.div
              key={item}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <span className="font-mono text-xs text-[#666] mt-0.5 shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-mono text-[14px] leading-7 text-[#9a9892]">
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/About.tsx
git commit -m "feat: rewrite About page as monochrome editorial layout"
```

---

### Task 5: Update Projects.tsx — Cold Accent Colors

**Files:**
- Modify: `src/app/components/Projects.tsx`

- [ ] **Step 1: Update project accent colors to cold palette**

Change the accent values in the `projects` array:

```tsx
const projects = [
  {
    id: "01",
    title: "Neural Engine DB",
    desc: "A high-performance data layer shaped for fast search, memory, and signal processing.",
    tech: ["Rust", "PostgreSQL", "gRPC", "Docker"],
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=85&w=1080",
    accent: "#38bdf8",  // was #1ed760
    length: "3:42",
  },
  {
    id: "02",
    title: "Null Protocol",
    desc: "An encrypted messaging concept with low-light energy and private-room UX.",
    tech: ["Go", "WebSockets", "React", "Crypto"],
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=85&w=1080",
    accent: "#8b5cf6",  // keep purple
    length: "4:08",
  },
  {
    id: "03",
    title: "Void Terminal",
    desc: "A terminal experience remixed into a rounded modern shell with dynamic feedback.",
    tech: ["TypeScript", "Node.js", "xterm.js", "Redis"],
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=85&w=1080",
    accent: "#06b6d4",  // was #f97316
    length: "2:59",
  },
  {
    id: "04",
    title: "Mono Portfolio",
    desc: "A scrollable music-app inspired portfolio with grayscale UI and colorful motion accents.",
    tech: ["React", "Motion", "Tailwind", "Vite"],
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=85&w=1080",
    accent: "#3b82f6",  // was #38bdf8
    length: "3:31",
  },
];
```

- [ ] **Step 2: Update hero green accents to cold blue**

The hero section uses `#1ed760` (green) in several places. Replace:
- Line 64: `bg-[#1ed760]/20` → `bg-[#38bdf8]/12`
- Line 65: `bg-[#8b5cf6]/18` → keep as-is (purple is cold)

- [ ] **Step 3: Update play button accent**

In the hero artwork card (around line 101), if there's a green play button shadow, change from green to cold:
- `shadow-[0_0_38px_rgba(30,215,96,0.35)]` → `shadow-[0_0_38px_rgba(56,189,248,0.2)]`

- [ ] **Step 4: Commit**

```bash
git add src/app/components/Projects.tsx
git commit -m "style: cold accent colors for playlist projects"
```

---

### Task 6: Rewrite Contact.tsx — Minimal, Numbered

**Files:**
- Modify: `src/app/components/Contact.tsx`

- [ ] **Step 1: Rewrite the Contact component**

Replace the entire file content with:

```tsx
import { Github, Instagram, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { motion, type Variants } from "motion/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const socialLinks = [
  { icon: Github, label: "GitHub", value: "github.com/your-handle", href: "https://github.com/" },
  { icon: Instagram, label: "Instagram", value: "@your.instagram", href: "https://instagram.com/" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/your-profile", href: "https://linkedin.com/" },
  { icon: Mail, label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
];

const deepIntro = [
  "I like building things that feel personal. Not just pages that render correctly, but small digital spaces with pacing, hierarchy, atmosphere, and a reason for every interaction.",
  "My taste leans toward classic, simple, mysterious visuals: mostly black, white, and grey for the interface, then color used like light from music artwork or a quiet stage effect.",
  "When I work, I care about the invisible layer too: readable components, predictable data flow, maintainable structure, and details that future-me can still understand.",
];

export function Contact() {
  return (
    <div className="space-y-16 pb-8">
      {/* Section 01 — Connect */}
      <motion.section
        className="relative"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">01</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <motion.h1
          className="font-mono text-5xl font-bold leading-[0.92] tracking-[-0.04em] text-[#e8e8e8] md:text-7xl"
          variants={fadeUp}
        >
          Let's connect,
          <br />
          <span className="text-[#666] italic">not just network.</span>
        </motion.h1>

        <motion.p
          className="mt-6 max-w-xl font-mono text-sm leading-8 text-[#9a9892] md:text-base"
          variants={fadeUp}
        >
          Social links and collaboration. Replace the placeholder handles with your real accounts.
        </motion.p>
      </motion.section>

      {/* Section 02 — Social Links */}
      <motion.section
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">02</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-4">
          SOCIAL
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {socialLinks.map(({ icon: Icon, label, value, href }) => (
            <motion.a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="group rounded-lg border border-white/[0.08] bg-black/20 p-5 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.04]"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-stone-300 transition-colors group-hover:text-white">
                <Icon size={16} />
              </span>
              <p className="font-mono text-sm text-[#e8e8e8]">{label}</p>
              <p className="mt-1.5 font-mono text-xs text-[#666]">{value}</p>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Section 03 — Introduction */}
      <motion.section
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-[#666] tracking-[0.15em]">03</span>
            <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
          </div>

          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-5">
            INTRODUCTION
          </h2>

          <div className="space-y-4 font-mono text-[14px] leading-7 text-[#9a9892]">
            {deepIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-[#666] tracking-[0.15em]">04</span>
            <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
          </div>

          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#666] mb-5">
            MESSAGE
          </h2>

          <form className="space-y-4">
            <input
              className="w-full rounded-lg border border-white/[0.1] bg-[rgba(0,0,0,0.2)] px-4 py-3 font-mono text-sm text-[#e8e8e8] outline-none transition-colors placeholder:text-[#666] focus:border-[#38bdf8]/30"
              placeholder="your name"
            />
            <input
              className="w-full rounded-lg border border-white/[0.1] bg-[rgba(0,0,0,0.2)] px-4 py-3 font-mono text-sm text-[#e8e8e8] outline-none transition-colors placeholder:text-[#666] focus:border-[#38bdf8]/30"
              placeholder="your email"
            />
            <textarea
              rows={5}
              className="w-full resize-none rounded-xl border border-white/[0.1] bg-[rgba(0,0,0,0.2)] p-4 font-mono text-sm text-[#e8e8e8] outline-none transition-colors placeholder:text-[#666] focus:border-[#38bdf8]/30"
              placeholder="write something meaningful..."
            />
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/08 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#38bdf8] transition-all hover:bg-[#38bdf8]/14"
            >
              <Send size={14} /> send
            </button>
          </form>
        </div>
      </motion.section>

      {/* Section 05 — Final Note */}
      <motion.section
        className="rounded-lg border border-white/[0.06] p-6 md:p-8"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[#666] tracking-[0.15em]">05</span>
          <span className="h-px w-10 bg-[rgba(255,255,255,0.1)]" />
        </div>

        <div className="font-mono">
          <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#666]">final note</p>
          <h2 className="text-2xl font-semibold tracking-[-0.06em] text-[#e8e8e8] md:text-4xl">
            Open to thoughtful projects.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9a9892]">
            If the project needs a mix of engineering, UI taste, and atmosphere, that is the kind of work I want to keep getting better at.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/Contact.tsx
git commit -m "feat: rewrite Contact page as minimal numbered sections"
```

---

### Task 7: Visual Verification

**Files:** All modified files

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open browser and verify each page**

Navigate to:
- `http://localhost:5173/` — About page: cold obsidian bg, stars, numbered sections, hero, tech tags, project list, principles
- `http://localhost:5173/playlist` — Playlist: music player metaphor with cold accent colors
- `http://localhost:5173/contact` — Contact: numbered sections, social links, form, final note

Verify:
- Background is cold obsidian with visible stars
- No green accents remain (except where intentionally part of playlist music theme)
- Navbar shows "TIM.DEV" with cold blue active indicator
- Cursor and mouse glow work with cold colors
- All page transitions animate correctly

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: visual verification adjustments"
```

---

## Summary of Changes

| # | Task | Files Changed | Estimated Time |
|---|------|--------------|----------------|
| 1 | CSS theme update | `theme.css` | 10 min |
| 2 | Root orbs/glow | `Root.tsx` | 10 min |
| 3 | Navbar updates | `Navbar.tsx` | 5 min |
| 4 | About rewrite | `About.tsx` | 20 min |
| 5 | Projects accent colors | `Projects.tsx` | 5 min |
| 6 | Contact rewrite | `Contact.tsx` | 15 min |
| 7 | Visual verification | All | 10 min |
