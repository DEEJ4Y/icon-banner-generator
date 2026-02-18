'use client';

import { useEffect, useRef, useCallback } from 'react';
import { renderBanner } from '@/lib/renderer';
import { calculateGrid } from '@/lib/grid';
import type { BannerConfig } from './ControlPanel';

interface Props {
  config: BannerConfig;
}

// Fixed preview canvas height — width scales to maintain aspect ratio
const PREVIEW_HEIGHT = 450;

export default function BannerPreview({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderingRef = useRef(false);

  const { resolution, selectedIcons, iconSize, spacing, padding, rotation, color } = config;
  const { width: resW, height: resH } = resolution;

  // Compute scaled dimensions for preview
  const previewH = PREVIEW_HEIGHT;
  const previewW = Math.round((resW / resH) * previewH);

  // Scale factor from full res to preview
  const scale = previewH / resH;

  const doRender = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (renderingRef.current) return;

    renderingRef.current = true;
    try {
      await renderBanner(canvas, {
        width: previewW,
        height: previewH,
        iconNames: selectedIcons,
        iconSize: Math.max(1, Math.round(iconSize * scale)),
        spacing: Math.max(0, Math.round(spacing * scale)),
        padding: Math.round(padding * scale),
        rotation,
        color,
      });
    } finally {
      renderingRef.current = false;
    }
  }, [previewW, previewH, scale, selectedIcons, iconSize, spacing, padding, rotation, color]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      doRender();
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [doRender]);

  // Grid stats for metadata display
  const grid = calculateGrid({
    canvasWidth: resW,
    canvasHeight: resH,
    iconSize,
    spacing,
    padding,
  });

  const showGridWarning = selectedIcons.length > 0 && !grid.valid;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Canvas wrapper */}
      <div
        className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        style={{ width: previewW, height: previewH, maxWidth: '100%' }}
      >
        <canvas
          ref={canvasRef}
          width={previewW}
          height={previewH}
          className="block w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Overlay when no icons */}
        {selectedIcons.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80">
            <p className="text-sm text-gray-400">Select icons to preview the banner</p>
          </div>
        )}
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="font-medium text-gray-700">
          {resW} × {resH}
        </span>

        {grid.valid && selectedIcons.length > 0 ? (
          <>
            <span className="text-gray-300">·</span>
            <span>
              {grid.cols} × {grid.rows} grid — {grid.total} cells
            </span>
            {selectedIcons.length > 0 && (
              <>
                <span className="text-gray-300">·</span>
                <span>{selectedIcons.length} icon{selectedIcons.length !== 1 ? 's' : ''} cycling</span>
              </>
            )}
          </>
        ) : showGridWarning ? (
          <>
            <span className="text-gray-300">·</span>
            <span className="text-amber-600 font-medium">
              ⚠ Spacing too large — no icons fit. Reduce spacing or icon size.
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
