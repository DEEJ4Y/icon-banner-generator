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
  const [mobilePanel, setMobilePanel] = useState<'preview' | 'settings'>('preview');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Mobile header — tab switcher + download */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 flex-shrink-0 gap-3">
        <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
          <button
            onClick={() => setMobilePanel('preview')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mobilePanel === 'preview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setMobilePanel('settings')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              mobilePanel === 'settings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Settings
          </button>
        </div>
        <DownloadButton config={config} />
      </div>

      {/* Sidebar / Settings panel */}
      <div
        className={`${mobilePanel === 'settings' ? 'flex' : 'hidden'} md:flex flex-col md:w-72 md:flex-shrink-0 flex-1 md:flex-none overflow-hidden`}
      >
        <ControlPanel config={config} onChange={setConfig} />
      </div>

      {/* Main content / Preview panel */}
      <main
        className={`${mobilePanel === 'preview' ? 'flex' : 'hidden'} md:flex flex-1 flex-col overflow-hidden`}
      >
        {/* Desktop top bar */}
        <div className="hidden md:flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-medium text-gray-500">Preview</h2>
          <DownloadButton config={config} />
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-6">
          <BannerPreview config={config} />
        </div>
      </main>
    </div>
  );
}
