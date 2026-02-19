# Banner Gen

Try it out: [https://icon-banner-generator.vercel.app/](https://icon-banner-generator.vercel.app/)

A browser-based tool for generating and downloading PNG banners made of evenly distributed [Tabler Icons](https://tabler.io/icons) on a white background. No server, no sign-up — configure and export entirely in the browser.

## Docs

- [`tech-spec.md`](./tech-spec.md) — architecture, component breakdown, grid logic, and rendering pipeline
- [`adr.md`](./adr.md) — key architectural decisions and trade-offs

## Getting Started

```bash
npm install
npm run dev
```

The `predev` script runs the icon extraction step automatically before the dev server starts.

## How It Works

A prebuild script reads every outline SVG from `node_modules/@tabler/icons/` and generates a static `src/lib/icon-data.ts` map of icon name to SVG path data. This map is what the canvas renderer uses at runtime — no network calls, no dynamic imports.

The banner is rendered onto an HTML5 Canvas at the target resolution, then exported as a PNG via `canvas.toDataURL('image/png')`. The live preview in the UI is the same canvas pipeline, just CSS-scaled down.

## Options

| Option        | Default               |
| ------------- | --------------------- |
| Resolution    | 1080p (1920x1080)     |
| Icons         | None (min 1 required) |
| Icon Size     | 24px                  |
| Icon Spacing  | 16px                  |
| Outer Padding | 0px                   |
| Icon Color    | `#d1d5db`             |

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- `@tabler/icons-react` + `@tabler/icons` (raw SVGs)
- HTML5 Canvas API
