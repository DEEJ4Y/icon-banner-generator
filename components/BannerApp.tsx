'use client';

import { useState } from 'react';
import ControlPanel, { BannerConfig, RESOLUTIONS } from './ControlPanel';
import BannerPreview from './BannerPreview';
import DownloadButton from './DownloadButton';

const DEFAULT_CONFIG: BannerConfig = {
  resolution: RESOLUTIONS[0], // 1080p
  selectedIcons: ['car', 'motorbike', 'id', 'password', 'user-heart', 'home-shield', 'notebook', 'list-check', 'credit-card', 'address-book'],
  iconSize: 24,
  spacing: 16,
  padding: 0,
  rotation: 0,
  color: '#d1d5db',
  iconOpacity: 100,
  bgColor: '#ffffff',
  bgOpacity: 100,
};

export default function BannerApp() {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <ControlPanel config={config} onChange={setConfig} />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-medium text-gray-500">Preview</h2>
          <DownloadButton config={config} />
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-6">
          <BannerPreview config={config} />
        </div>
      </main>
    </div>
  );
}
