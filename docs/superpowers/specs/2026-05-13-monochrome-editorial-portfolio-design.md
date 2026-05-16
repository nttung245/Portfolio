---
name: monochrome-editorial-portfolio
description: Redesign portfolio to monochrome editorial style with cold obsidian + stars background, professional dev sections, and playlist page for songs
date: 2026-05-13
---

# Monochrome Editorial Portfolio — Design Spec

## Overview

Transform the current Spotify-themed portfolio into a monochrome editorial developer portfolio. The aesthetic is confident, anti-clutter, type-led — closer to Linear.app or a brutalist agency brief than a music player. The Playlist page remains as an intentional personality contrast.

Inspiration: xirothedev.site + Cyberpunk 2077 "I Really Want to Stay At Your House" lonely night sky vibe.

---

## Background System (All Pages)

**Base:** Cold obsidian gradient — `#0a0a10` primary with a subtle conic gradient overlay:
- Conic from 180deg: sky blue `#38bdf8` at 4%, violet `#8b5cf6` at 3%, cyan `#06b6d4` at 2%
- Filter: `blur(60px)`, positioned top-right, 50% width/height
- Top-to-bottom white-to-transparent gradient at 1.5% opacity for depth

**Stars layer:** 5-8 white dots per viewport, randomly distributed:
- Sizes: 1px, 1.5px, 2px, 3px (most are 1px)
- Opacity range: 0.2 – 0.8
- 2-3 "hero" stars get `box-shadow: 0 0 Xpx rgba(255,255,255,0.3)`
- Static positions (no animation) — they should feel like a real night sky, not a screensaver

**Mouse-follow glow:** `radial-gradient` at cursor position, `rgba(56,189,248,0.06)`, 400px radius — much lower opacity than current green version.

**Noise overlay:** SVG noise texture at 0.035 opacity, pointer-events-none.

**Animated cursor:** Keep current ring + dot with spring physics.

**Animated orbs:** Remove the 3 large colored orbs (green/purple/orange). Replace with a single subtle cold ambient glow if needed, but keep it barely visible.

---

## Navbar

- Keep the floating pill shape (`max-w-6xl`, `top-5`, `rounded-2xl`, `bg-black/70`, `backdrop-blur-2xl`)
- Logo text: change from "Mono.fm" to "TIM.DEV"
- Active indicator: change `bg-stone-100` green glow to cold accent — `border: 1px solid rgba(56,189,248,0.3)`, background `rgba(56,189,248,0.08)`
- Font and spacing stay the same

---

## About Page (`/`)

### Section 01 — Hero
- Numbered section label: `01` with a horizontal divider line
- Giant heading: "TUNG NGUYEN" — `font-mono`, `text-5xl md:text-7xl lg:text-8xl`, `font-weight: 700`, `letter-spacing: -0.04em`
- Subtitle: "Full-stack developer · Clean systems, alive interfaces" — `text-sm`, `color: #666`
- "Initialize_" badge before the heading — terminal-style, monospace, `font-size: 10px`, `letter-spacing: 0.25em`, `text-transform: uppercase`, `color: #38bdf8`
- Two CTA buttons: primary (outlined border with cold accent), secondary (subtle, white text on transparent)

### Section 02 — Technology
- Label: `02` + "TECHNOLOGY" (uppercase, tracking, `color: #666`)
- Tech tags as bordered pills only — NO icons, NO cards:
  `React | TypeScript | PostgreSQL | Node.js | Rust | Go | Docker | gRPC`
- Style: `border: 1px solid rgba(255,255,255,0.12)`, `padding: 6px 14px`, `font-size: 11px`, `color: #e8e8e8`
- Flex-wrap, 6px gap
- Remove the current 4-icon-card grid entirely

### Section 03 — Selected Work
- Label: `03` + "SELECTED WORK"
- Project list as editorial index rows:
  - Each row: `border-top: 1px solid rgba(255,255,255,0.1)`
  - Left side: project number (`01`, `02`...) + project name (14px) + one-line subtitle (10px, muted)
  - Right side: tech tags (9px, bordered, same style as section 02 but smaller)
  - Hover: subtle background lighten, `cursor: pointer`
- Remove: album artwork, equalizer bars, mood tags from this section
- No images — pure typography and structure

### Section 04 — Principles
- Label: `04` + "PRINCIPLES"
- Numbered list: `01`, `02`, `03`, `04` with clean text
- No cards, no borders — just typography with numbering
- Style: `color: #9a9892`, `font-size: 14px`, generous line-height

---

## Playlist Page (`/playlist`)

- **Keep the full music-player metaphor** — this is the personality page
- Tracklist with album artwork, equalizer bars, playback controls, mood tags
- Project cards styled like music tracks
- Same cold obsidian + stars background
- Hero section: "Playlist" label, "queued like tracks" heading, featured artwork image
- Bottom feature cards: "Shuffle-ready", "Responsive", "Animated"
- This page intentionally contrasts the serious About page

---

## Contact Page (`/contact`)

- Numbered sections like About page
- **Social links:** Simple bordered cards — no colored icons, no hover lifts. `border: 1px solid rgba(255,255,255,0.08)`, hover adds subtle lighten.
- **Introduction section:** Clean text block with personal intro paragraphs
- **Message form:** Inputs with cold obsidian style — `border: 1px solid rgba(255,255,255,0.1)`, `background: rgba(0,0,0,0.2)`, `font-mono`
- **Remove** the bottom decorative image section entirely — just text and form
- Send button: cold accent border, not solid white

---

## Typography System

- Font: JetBrains Mono (keep existing)
- Headings: `font-weight: 700`, `letter-spacing: -0.04em`, tight line-height
- Labels: `font-size: 10px`, `letter-spacing: 0.25em`, `text-transform: uppercase`, `color: #666`
- Body text: `font-size: 14px`, `color: #9a9892`
- Muted text: `color: #666`
- Primary text: `color: #e8e8e8`
- Accent: `#38bdf8` (sky blue) for terminal-style elements only

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0a10` | Page background |
| `--bg-surface` | `rgba(17,17,17,0.6)` | Card surfaces |
| `--text-primary` | `#e8e8e8` | Headings, important text |
| `--text-muted` | `#9a9892` | Body paragraphs |
| `--text-secondary` | `#666` | Labels, secondary text |
| `--border` | `rgba(255,255,255,0.1)` | Borders, dividers |
| `--border-strong` | `rgba(255,255,255,0.12)` | Active/hover states |
| `--accent` | `#38bdf8` | Cold accent (links, badges, active nav) |
| `--accent-dim` | `rgba(56,189,248,0.08)` | Subtle accent backgrounds |

---

## File Changes

**Modified files:**
- `src/styles/globals.css` — Rewrite background system, add star layer, update CSS variables
- `src/app/components/Root.tsx` — Update background orbs, mouse glow color, noise opacity
- `src/app/components/Navbar.tsx` — Update logo text, active indicator color
- `src/app/components/About.tsx` — Full rewrite: hero, tech tags, project list, principles
- `src/app/components/Projects.tsx` — Keep mostly intact (playlist metaphor), update to cold accent colors
- `src/app/components/Contact.tsx` — Rewrite: numbered sections, minimal cards, remove bottom image

---

## Animation Behavior

- Scroll-triggered fade-up animations: keep, but faster (0.45s → 0.5s, not 0.65s+)
- Mouse-follow glow: subtle cold blue, lower intensity
- Hover on project rows: slight background lighten, no y-shift
- Nav active pill: spring animation stays
- Cursor ring + dot: keep current behavior
- Stars: **static**, no twinkle animation (they should feel distant and still)
