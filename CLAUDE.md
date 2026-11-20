# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Shared agent rules (Bun only, keep both Vite plugins, verify with `bun run build`) live in AGENTS.md:

@AGENTS.md

## Commands

The only scripts are `bun run dev` and `bun run build`. The repo has no test runner, linter, formatter, or `tsconfig.json`, so the build is the only automated check. Vite strips TypeScript types without checking them, which means code with type errors still builds. To serve the production bundle locally, run `bunx vite preview` after building.

If `bun run dev` exits with `ENOSPC`, the machine has run out of inotify watchers; `CHOKIDAR_USEPOLLING=true bun run dev` works around it.

## Design language

The site is "A Day in Type": seven Posters that run from Dawn to night as the visitor swipes through them, told in the language of iOS (ADR 0005). Each Time slot's Sky is a soft gradient with a glow, in the style of the iOS Weather app. Every Sky carries white Ink and one sunlight Accent, set in San Francisco (Inter elsewhere). The Posters sit side by side as Cards in a Switcher, like the iOS app switcher (ADR 0004). `GLOSSARY.md` defines the vocabulary (Poster, Hero, Detail, Card, Switcher, Motif, Time slot, Topic, Sky, Ambient light, Ink, Accent, Frame, Day clock, Timeline); use those words in code and conversation. `docs/adr/` records decisions that are easy to undo by accident: the day cycle replaces a light/dark toggle (0002), the Switcher replaces one long scroll (0004), and one iOS language replaces the earlier poster type and gritty Motifs (0005). 0001 and 0003 are superseded.

## Architecture

**One page, no router.** `main.tsx` rewrites paths from older versions of the site (`/about`, `/experience`, `/contact`, …) to the matching Poster's hash before rendering, and sends any other path to `/`. `App.tsx` wraps `DayPage` in `LazyMotion` (`domAnimation`, `strict`) and `MotionConfig reducedMotion="user"`. Use `m.div` and friends, never `motion.div`, and nothing that needs motion's layout engine (`layout`, `layoutId`). An open Poster's address is its Topic (`#experience`); the bare address is the Switcher. `slotIndexFromHash` in `day.ts` also accepts old hashes (Time slot ids such as `#midday`, and `#about`), which `DayPage` rewrites to the Topic. `vercel.json` rewrites every path to `index.html` and caches the hashed files in `/assets/` for a year.

**Data lives in two files.**
- `src/app/day.ts`: the seven Time slots in order, each with its id, Topic, time and Sky. A Sky is data (colour stops plus glows as ellipses), painted to CSS by `skyCss` for Cards and to a canvas by `paintSky` for the ambient light, so the two match. Time slots are never named on screen: each Poster is labelled by its Topic only. The Frame's Poster count and the Timeline follow the list's length.
- `src/app/content.ts`: all portfolio text, including the short lines on the Heroes. Edit copy there, not in the Posters.

**`DayPage` is the Switcher.** The page itself never scrolls. `DayPage` renders a fixed, sideways-scrolling row (CSS scroll snap) with one `Card` per Poster. On every scroll it:
- moves `skyAt`, the position in the day that `Ambient` paints. When the Timeline swaps open Posters, `skyAt` glides there instead of jumping.
- sets the Day clock and the progress ring by interpolating between the Posters' times.
- tracks the focused Card, which sets the `theme-color` meta tag.

It also owns the rest of the Switcher. Opening a Card pushes its hash, and closing steps back (or replaces the hash after a link landed straight on a Poster), so Back and Forward follow along. ← → move the focus, Enter opens and Esc closes. A mouse wheel turns one Card per step. On a first visit (once per session) the row nudges left and springs back.

**Ambient light.** `Ambient.tsx` paints the Sky into a 96px-wide canvas that the browser stretches over the screen, blending two Skies mid-swipe. A gradient loses nothing at that size, and redrawing it costs a few kilobytes of texture. Never drive colour through a CSS variable on `<html>` per scroll frame: that restyles the whole page.

**Cards.** `Card.tsx` sizes the row from the viewport (`useCardLayout`: a Card is 80% of the screen on phones and 64% from 768px). Each Card renders its Poster's Hero at full viewport size and scales it down.
- **In the row:** away from the centre, a Card shrinks a little and fills with its own Sky, so swiping looks like colour pouring from the Card into the ambient light. Where `animation-timeline: view()` is supported, the depth and tint are scroll-driven CSS animations on the compositor (`card-depth`, `card-tint` in `globals.css`, reading `--card-w`, `--card-h` and `--reach` set on the Card); elsewhere they run from the scroll position in JS. Cards beyond the neighbours are hidden so they are not drawn.
- **Opening:** opening measures the Card, fixes its screen to the viewport and springs it from the Card's rect to the full screen (FLIP). Only then does the Card build the Poster's Detail below the Hero. The open Poster scrolls inside itself over its Sky, which stays still, and a chevron hints at the Detail.
- **Closing:** the Detail is removed and the screen springs back to its Card, as it also does when the visitor pulls down past the top on a touch screen, which shrinks it with the finger first. The Timeline swaps open Posters with a fade.
- **State for Posters:** a Card's content is `inert` until it opens. Posters read `useCard()` for whether they are live (focused or open) and open. `useOpener(ref)` starts a one-off entrance the first time that part of the Hero is on screen while its Card has focus.

**Posters.** Each file in `components/posters/` exports a Hero and a Detail (`DawnHero`, `DawnDetail`, …), built from the parts in `Poster.tsx`:
- `Hero` (one screen, marks itself `data-live`) and `Eyebrow` (the Topic above the title).
- `Detail` and `Module`, Weather-style modules that rise in one after another.
- `Row`, an iOS Settings row for inset grouped lists.
- `Chips`, `Stars` (still stars painted as radial gradients, one layer) and `useCopy`.

Each Hero has one smooth Motif borrowed from iOS. One-off Motifs start from `useOpener`; loops sit in a `motif` element.
- **Profile:** an iOS Contact Poster with the depth effect. The photo, the name, then a cut-out of the figure on top (`my_picture/profile.webp` and `profile-figure.webp`), all pinned to the same `object-position`, so the name stands behind the head. The name types in letter by letter.
- **Objective:** the Weather app's sun path. The sun climbs from below the horizon and stops just clear of it at 06:30, between the Sunrise and Sunset slots' times.
- **Experience:** an Activity ring closes to 48% while the number counts up on the same curve.
- **Playground:** each world drifts from its day render into its night one and back, a few seconds apart (`daynight` keyframes). The Detail shows each world's facts as Weather-style stat tiles.
- **Skills:** each stack's name rises from behind its own line, one after another.
- **Education:** the years of the degree as one of the Weather app's ten-day bars, filling in to a Now marker at today's date.
- **Contact:** an incoming iMessage. The typing indicator shows, then the message lands. The message is always laid out, so nothing below it moves.

**Styles.** `theme.css` holds the iOS tools:
- `glass` is Liquid Glass for the Frame only, where moving content passes underneath. `glass-dark` is smoked glass for controls on a picture.
- `module` is the translucent pane for Detail modules: over a smooth gradient a blur changes nothing you can see, so it has none.
- `eyebrow` and `lift` (a soft shadow for white type on pale Skies), and `press`, which makes a control sink and spring back.
- `ease-spring` and `ease-bounce` are springs sampled into `linear()`, and `text-body` and `text-subhead` are the reading sizes.

`globals.css` holds the few keyframes. Loops run only inside a `motif` element, pause unless the Card is live, and stop under `prefers-reduced-motion`.

**Frame.** Floating glass controls with no bar behind them, as in iOS 26: the name (or a ✕ while a Poster is open), the Day clock with its progress ring, the Poster count, and the Timeline tab bar, whose lens is placed from measured tab positions rather than a layout animation.

**Assets and loading.** Inter comes from `@fontsource-variable/inter` (only the subsets a page needs download, and none on Apple devices, which use San Francisco). There is no third-party request before first paint. `index.html` preloads the Profile photo. The Playground renders in `playground/` load lazily, and the live Agent Arena worlds (`live` in `content.ts`, served by GitHub Pages from the `nttung245/agent-arena` fork) exist only inside the open Playground Detail: on desktop they load at once, and on touch screens or under reduced motion they wait for a tap. `my_avatar.jpg`, the CV PDF, `music/`, `portfolio-assets/` and `abdul-reference.html` stay in the repo, but the site does not use them.
