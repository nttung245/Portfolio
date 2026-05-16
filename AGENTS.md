# AGENTS.md

## Project Overview

This is a Vite + React portfolio app. Source code lives under `src/`, static entry HTML is `index.html`, and Vite configuration is in `vite.config.ts`.

## Package Manager

Use Bun for all package tasks.

- Install dependencies: `bun install`
- Start dev server: `bun run dev`
- Build production assets: `bun run build`

Do not add npm, yarn, or pnpm lockfiles. Commit `bun.lock` when dependencies change.

## Development Notes

- Keep UI changes consistent with the existing component and styling patterns in `src/app`.
- Use the existing Vite aliases, including `@` for `src`.
- Do not remove the React or Tailwind Vite plugins from `vite.config.ts`; this project depends on both.
- Treat `dist/`, `node_modules/`, local logs, and local automation state as generated files.

## Verification

Before handing off frontend changes, run:

```sh
bun run build
```
