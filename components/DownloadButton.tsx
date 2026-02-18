'use client';

import { useState } from 'react';
import { IconDownload, IconLoader2 } from '@tabler/icons-react';
import { renderBanner } from '@/lib/renderer';
import { calculateGrid } from '@/lib/grid';
import type { BannerConfig } from './ControlPanel';

interface Props {
  config: BannerConfig;
}

export default function DownloadButton({ config }: Props) {
  const [loading, setLoading] = useState(false);

  const { resolution, selectedIcons, iconSize, spacing, padding, rotation, color } = config;
  const { width, height } = resolution;

  const grid = calculateGrid({ canvasWidth: width, canvasHeight: height, iconSize, spacing, padding });
  const disabled = selectedIcons.length === 0 || !grid.valid;

  async function handleDownload() {
    if (disabled || loading) return;
    setLoading(true);

    try {
      const offscreen = document.createElement('canvas');
      await renderBanner(offscreen, {
        width,
        height,
        iconNames: selectedIcons,
        iconSize,
        spacing,
        padding,
        rotation,
        color,
      });

      const dataUrl = offscreen.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'banner.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || loading}
      title={
        selectedIcons.length === 0
          ? 'Select at least one icon'
          : !grid.valid
          ? 'No icons fit — adjust spacing or icon size'
          : `Download ${width}×${height} PNG`
      }
      className={`
        inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
        ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : loading
            ? 'bg-indigo-400 text-white cursor-wait'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-md'
        }
      `}
    >
      {loading ? (
        <>
          <IconLoader2 size={16} className="animate-spin" />
          Rendering…
        </>
      ) : (
        <>
          <IconDownload size={16} />
          Download PNG
        </>
      )}
    </button>
  );
}
