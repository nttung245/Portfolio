# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Shared agent rules (Bun only, keep both Vite plugins, verify with `bun run build`) live in AGENTS.md:

@AGENTS.md

## Commands

The only scripts are `bun run dev` and `bun run build`. The repo has no test runner, linter, formatter, or `tsconfig.json`, so the build is the only automated check. Vite strips TypeScript types without checking them, which means code with type errors still builds. To serve the production bundle locally, run `bunx vite preview` after building.

If `bun run dev` exits with `ENOSPC`, the machine has run out of inotify watchers; `CHOKIDAR_USEPOLLING=true bun run dev` works around it.

## Design language

The site is "A Day in Type": six kinetic-type Posters that run from Dawn to Twilight as the visitor scrolls, after Sara Benoist's Olympic Series posters, with Midday borrowing from Mat Voyce's PUMA "Forever Faster" sequence. `GLOSSARY.md` defines the vocabulary (Poster, Motif, Time slot, Topic, Sky, Ink, Accent, Frame, Day clock, Timeline); use those words in code and conversation. `docs/adr/` records decisions that are easy to undo by accident: Posters loop on their own instead of scroll-jacking, and the day cycle replaces a light/dark toggle.

## Architecture

**One page.** `routes.tsx` has a single `Root` layout, which only adds `MotionConfig reducedMotion="user"`, with `DayPage` as its index route. Paths from older versions of the site (`/about`, `/experience`, `/contact`, …) redirect to the matching Poster's hash, and old hashes (`#about`, `#experience`, …) are mapped through `legacyHashes` in `day.ts`. Unknown paths go to `/`. `vercel.json` rewrites every path to `index.html`.

**Data lives in two files.**
- `src/app/day.ts`: the six Time slots in order, each with its id, English and Vietnamese labels, Topic, time, and Sky/Ink/Accent colours.
- `src/app/content.ts`: all portfolio text, including profile and contact links, bio, experience, skills, education and certifications. Edit copy there, not in the Posters.

**`DayPage` owns scrolling.** Its `useDayScroll` hook measures each Poster's top and, on every scroll:
- writes `--sky` on `<html>`. Inside a Poster this is the slot's exact colour; near a boundary it is a `color-mix(in oklch, …)` of the two slots. The exact colour matters because oklch renders a near-neutral colour mixed with itself with a pink cast.
- sets the Day clock, a motion value that `Frame` renders, by interpolating between the Posters' times.
- tracks the active Time slot, which sets the Frame's Ink and Accent and the `theme-color` meta tag.

It also scrolls to the URL hash on load, and again once the web fonts have reflowed the page.

**Posters.** Each file in `components/posters/` wraps its content in `<Poster slot={…}>` from `Poster.tsx`. That component sets the slot's `--ink` and `--accent` and marks the section `data-live` while it is on screen. `@theme inline` in `theme.css` exposes the variables as Tailwind colours (`text-ink`, `bg-accent`, `bg-sky`, …). The fonts are `font-display` (Archivo variable, roman and italic, `wdth` 62–125, `wght` 100–900) and `font-mono` (JetBrains Mono, also the body font), both loaded by a `<link>` in `index.html`.

**Motifs.** Every looping animation is a set of keyframes in `src/styles/globals.css` and only runs inside an element with the `motif` class. It pauses while its Poster is off screen and is switched off under `prefers-reduced-motion`, pseudo-elements included, so each Motif's base, non-animated style has to work as a static frame.
- Dawn types the name in, and Sunset decodes its words through random glyphs. Both then loop a cyberpunk glitch: `.glitch` copies the text from `data-text` into tinted, sliced pseudo-elements (`--glitch-a`/`--glitch-b`) while `StaticNoise` flashes scanlines and grain.
- Sunrise plays once, then rests. Motion variants on one `whileInView` parent run it in order: horizon, sun, glow, roles, objective. Only the glow keeps breathing.
- Midday follows PUMA "Forever Faster": italic Archivo, a paper-grain overlay, a counter that steps on twos, an impact burst when it lands, and company names that slam in.
- Dawn and Dusk scatter `StarField` stars. Dusk ends in an afterglow and a generated city skyline drawn in Twilight's Sky colour, so it runs straight into the next Poster.
- `random.ts` seeds the stars and city lights so they stay put between renders.

**Assets.** `SunrisePoster.tsx` imports `my_picture/my_avatar.jpg` with `new URL(…, import.meta.url)`. `music/`, `portfolio-assets/`, `abdul-reference.html` and the CV PDF in `my_picture/` stay in the repo but the site does not use them.
