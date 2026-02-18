# Tech Spec: Icon Banner Generator

## Overview

A Next.js web app that allows users to configure and download a PNG banner made of evenly distributed Tabler Icons on a white background.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR + API routes in one project |
| Language | TypeScript | Type safety for icon config and canvas logic |
| Icons | `@tabler/icons-react` + raw SVGs | React components for UI; raw SVGs for canvas rendering |
| Canvas rendering | Native HTML5 Canvas API | No extra deps; sufficient for this use case |
| SVG-to-canvas | SVG drawn via `Image` + `drawImage` | Browser-native, no canvg needed |
| Styling | Tailwind CSS | Fast utility-first styling |
| Icon search/select | `cmdk` or custom combobox | Multi-select with search |
| Download | Canvas `toDataURL('image/png')` | Simple, no server needed |

---

## Pages

### `/` (Home)

Single-page app. No routing needed beyond the root.

---

## UI Components

### `<ControlPanel />`

Left or top sidebar containing all inputs.

**Inputs:**

| Input | Type | Options / Default |
|---|---|---|
| Resolution | Dropdown (single select) | 2160p (3840x2160), 1440p (2560x1440), 1080p (1920x1080) — default: 1080p |
| Icons | Multi-select combobox | Search + select from full Tabler icon list — min 1 required |
| Icon Size | Number input | Default: 24px |
| Icon Spacing | Number input | Default: 16px |
| Outer Padding | Number input | Default: 0px |
| Rotation | Number input (degrees) | Default: 0 |
| Icon Color | Color picker or hex input | Default: `#d1d5db` (Tailwind gray-300) |

### `<BannerPreview />`

- Renders a scaled-down live preview of the canvas using an `<canvas>` element
- Updates on any input change (debounced ~200ms)
- Aspect ratio locked to the selected resolution

### `<DownloadButton />`

- Triggers full-resolution canvas render off-screen
- Calls `canvas.toDataURL('image/png')` and programmatically clicks a download link
- Disabled if no icons selected

---

## Core Logic

### Icon Data

Tabler provides a JSON manifest of all icons. At build time (or as a static import), load the list of icon names from `@tabler/icons-react` exports or from the public icon list at:

```
https://raw.githubusercontent.com/tabler/tabler-icons/master/icons.json
```

Each icon has a name and an SVG path string. Build a local static map of `iconName -> svgPathData` used during canvas rendering.

### Grid Calculation

Given:
- `canvasWidth`, `canvasHeight` (from resolution)
- `padding` (outer padding, px)
- `iconSize` (px)
- `spacing` (px between icons)

Usable area:
```
usableWidth  = canvasWidth  - 2 * padding
usableHeight = canvasHeight - 2 * padding
```

Columns and rows:
```
cols = floor(usableWidth  / (iconSize + spacing))
rows = floor(usableHeight / (iconSize + spacing))
```

Centering offset (to center the grid inside the usable area):
```
offsetX = padding + (usableWidth  - cols * (iconSize + spacing) + spacing) / 2
offsetY = padding + (usableHeight - rows * (iconSize + spacing) + spacing) / 2
```

Icon placement (cycling through selected icons):
```
for row in 0..rows:
  for col in 0..cols:
    index = (row * cols + col) % selectedIcons.length
    x = offsetX + col * (iconSize + spacing)
    y = offsetY + row * (iconSize + spacing)
    drawIcon(selectedIcons[index], x, y, iconSize, rotation, color)
```

### SVG-to-Canvas Rendering

Each Tabler icon is a 24x24 SVG with a `stroke` style (not filled). To draw on canvas:

1. Build an SVG string using the icon's path data and the selected color and size.
2. Create a `Blob` URL from the SVG string.
3. Draw it onto the canvas via `ctx.drawImage(img, x, y, iconSize, iconSize)`.
4. Revoke the blob URL after drawing.

Because this involves async image loading, render all icons in parallel using `Promise.all`, then draw in order.

For rotation, use `ctx.save()`, `ctx.translate(centerX, centerY)`, `ctx.rotate(angleRad)`, `ctx.drawImage(...)`, `ctx.restore()`.

### Download Flow

1. Create an off-screen `<canvas>` at full resolution (e.g. 1920x1080).
2. Run the full render pipeline on it.
3. Call `canvas.toDataURL('image/png')`.
4. Inject a temporary `<a download="banner.png" href={dataUrl}>` and click it.
5. Remove the element.

---

## File Structure

```
/
├── app/
│   ├── page.tsx               # Root page, layout of ControlPanel + Preview
│   └── layout.tsx
├── components/
│   ├── ControlPanel.tsx
│   ├── BannerPreview.tsx
│   ├── IconMultiSelect.tsx
│   └── DownloadButton.tsx
├── lib/
│   ├── icons.ts               # Static icon name list + SVG data map
│   ├── grid.ts                # Grid calculation logic
│   └── renderer.ts            # Canvas rendering logic
├── public/
└── tailwind.config.ts
```

---

## Constraints and Edge Cases

- If spacing is so large that 0 columns or rows fit, show a validation warning and disable download.
- Icons are cycled (modulo) across grid cells, so any number of selected icons works.
- Preview canvas is scaled down via CSS (`width: 100%; height: auto`) — actual pixel dimensions stay at full resolution in the off-screen canvas.
- Tabler icons use `stroke` not `fill`; the SVG strings must include `stroke="currentColor"` and the color must be set explicitly for canvas rendering.
- For very high resolutions (2160p), rendering may take 1-2 seconds; show a loading state on the download button.
