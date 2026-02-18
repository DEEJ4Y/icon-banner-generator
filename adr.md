# ADR-001: Icon Banner Generator - Architecture Decisions

**Date:** 2026-02-18
**Status:** Accepted

---

## ADR-001: Use HTML5 Canvas for rendering instead of SVG or a headless browser

### Context

The banner needs to be exported as a PNG at high resolutions (up to 3840x2160). Options considered:

1. **HTML5 Canvas** — draw icons programmatically, export via `toDataURL`
2. **DOM SVG + `html2canvas`** — render a live SVG/HTML layout and screenshot it
3. **Puppeteer / headless browser** — server-side rendering to PNG
4. **`sharp` + `svgexport` on the server** — Node.js image pipeline

### Decision

Use the **HTML5 Canvas API** in the browser (client-side only).

### Rationale

- No server infrastructure needed; the whole pipeline is client-side
- Canvas `toDataURL('image/png')` produces lossless PNGs at any resolution
- Drawing SVG images via `ctx.drawImage(svgImg)` is well-supported across modern browsers
- Avoids a heavy dependency like Puppeteer which would require a server and significantly increase complexity and hosting cost
- `html2canvas` has known issues with SVGs and cross-origin assets — not reliable for this use case

### Trade-offs

- Very large canvases (3840x2160 with many icons) may hit browser memory limits on low-end devices. Acceptable for this tool's target use case (designers on desktop).
- Canvas rendering is imperative vs. declarative SVG. Mitigated by encapsulating all rendering logic in `lib/renderer.ts`.

---

## ADR-002: Use Tabler Icons SVG path data directly instead of the React components

### Context

`@tabler/icons-react` exports React components (e.g. `<IconHome />`). For canvas rendering, React components cannot be drawn directly. Options:

1. **Render React components to a hidden DOM node, then snapshot** — fragile, slow
2. **Use the raw SVG path strings from the Tabler source** — clean and fast
3. **Fetch SVGs from a CDN at runtime** — network dependency, slower

### Decision

Use **raw SVG path data** by importing or statically bundling the Tabler icon metadata (available in the npm package under `icons/` as individual `.svg` files, or via the JSON manifest in the repo).

At build time, generate a `lib/icons.ts` file (or use a Next.js build script) that maps icon names to their SVG path strings.

### Rationale

- No runtime network dependency
- Fast canvas rendering: construct SVG strings in memory, blob them, draw
- Full control over the SVG attributes (stroke, size, color)
- Tabler's SVG files are MIT-licensed and safe to bundle

### Trade-offs

- Build step needed to extract path data. Can be done with a simple Node script that reads from `node_modules/@tabler/icons/icons/*.svg`.
- Bundle will include SVG data for all icons (~5000 icons x ~200 bytes avg = ~1MB). Should be code-split or lazily imported.

---

## ADR-003: Client-side only rendering (no API routes for PNG generation)

### Context

An alternative architecture would push the canvas rendering to a server-side API route using Node Canvas (`node-canvas`) or `sharp`, returning the PNG as a binary response.

### Decision

Keep everything **client-side**. No API routes are used for image generation.

### Rationale

- Simpler deployment (static export or Edge-compatible Next.js)
- No cold-start latency on serverless functions
- No risk of timeout on large canvases (server functions often cap at 10-30s)
- The browser is fully capable of this task

### Trade-offs

- Cannot support server-side rendering of the banner (e.g. for OG image generation pipelines). Out of scope for this tool.
- Safari has historically had minor quirks with SVG-to-canvas. Will need cross-browser testing.

---

## ADR-004: Use Next.js App Router

### Context

Next.js supports both the Pages Router and the App Router. This project is essentially a single-page client app with no server data fetching.

### Decision

Use the **App Router** with `"use client"` on interactive components.

### Rationale

- App Router is the current Next.js default and recommended path
- Since there is no server data fetching, the architectural differences are minor
- `"use client"` boundary is clean: the entire interactive UI is one client component tree

### Trade-offs

- Slightly more boilerplate than Pages Router for a simple SPA. Negligible for this project size.
