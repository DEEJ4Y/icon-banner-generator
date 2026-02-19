import { iconData } from './icon-data';
import { calculateGrid, getCellPositions } from './grid';

export interface RenderConfig {
  width: number;
  height: number;
  iconNames: string[];
  iconSize: number;
  spacing: number;
  padding: number;
  rotation: number;
  color: string;
  iconOpacity: number;
  bgColor: string;
  bgOpacity: number;
}

function buildSvgString(innerPaths: string, size: number, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${innerPaths}</svg>`;
}

function loadSvgAsImage(svgString: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load SVG image`));
    };
    img.src = url;
  });
}

export async function renderBanner(
  canvas: HTMLCanvasElement,
  config: RenderConfig
): Promise<void> {
  const { width, height, iconNames, iconSize, spacing, padding, rotation, color, iconOpacity, bgColor, bgOpacity } = config;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Background — clear first, then fill if opacity > 0
  ctx.clearRect(0, 0, width, height);
  if (bgOpacity > 0) {
    ctx.globalAlpha = bgOpacity / 100;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  if (iconNames.length === 0) return;

  const grid = calculateGrid({ canvasWidth: width, canvasHeight: height, iconSize, spacing, padding });
  if (!grid.valid) return;

  const positions = getCellPositions(grid, iconNames.length, iconSize, spacing);

  // Pre-load unique icons in parallel
  const uniqueNames = Array.from(new Set(iconNames));
  const imageMap = new Map<string, HTMLImageElement>();

  await Promise.all(
    uniqueNames.map(async (name) => {
      const inner = iconData[name];
      if (!inner) return;
      const svg = buildSvgString(inner, iconSize, color);
      try {
        const img = await loadSvgAsImage(svg);
        imageMap.set(name, img);
      } catch {
        // Skip icons that fail to load
      }
    })
  );

  const rotationRad = (rotation * Math.PI) / 180;

  // Draw all cells with a random icon per cell
  ctx.globalAlpha = iconOpacity / 100;
  for (const pos of positions) {
    const name = iconNames[Math.floor(Math.random() * iconNames.length)];
    const img = imageMap.get(name);
    if (!img) continue;

    const cx = pos.x + iconSize / 2;
    const cy = pos.y + iconSize / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationRad);
    ctx.drawImage(img, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}
