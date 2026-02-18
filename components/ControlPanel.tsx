'use client';

import IconMultiSelect from './IconMultiSelect';

export const RESOLUTIONS = [
  { label: '1080p (1920×1080)', width: 1920, height: 1080 },
  { label: '1440p (2560×1440)', width: 2560, height: 1440 },
  { label: '2160p (3840×2160)', width: 3840, height: 2160 },
] as const;

export type Resolution = (typeof RESOLUTIONS)[number];

export interface BannerConfig {
  resolution: Resolution;
  selectedIcons: string[];
  iconSize: number;
  spacing: number;
  padding: number;
  rotation: number;
  color: string;
}

interface Props {
  config: BannerConfig;
  onChange: (config: BannerConfig) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function NumberInput({
  value,
  min,
  max,
  onChange,
  suffix,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(n);
        }}
        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
      />
      {suffix && <span className="text-xs text-gray-400 flex-shrink-0">{suffix}</span>}
    </div>
  );
}

export default function ControlPanel({ config, onChange }: Props) {
  function update<K extends keyof BannerConfig>(key: K, value: BannerConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  return (
    <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Banner Gen</h1>
        <p className="text-xs text-gray-400 mt-0.5">Generate icon pattern banners</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Resolution */}
        <Field label="Resolution">
          <select
            value={`${config.resolution.width}x${config.resolution.height}`}
            onChange={(e) => {
              const res = RESOLUTIONS.find(
                (r) => `${r.width}x${r.height}` === e.target.value
              );
              if (res) update('resolution', res);
            }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
          >
            {RESOLUTIONS.map((r) => (
              <option key={`${r.width}x${r.height}`} value={`${r.width}x${r.height}`}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>

        {/* Icons */}
        <Field label="Icons">
          <IconMultiSelect
            selected={config.selectedIcons}
            onChange={(icons) => update('selectedIcons', icons)}
          />
          {config.selectedIcons.length === 0 && (
            <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
              <span>⚠</span> Select at least one icon
            </p>
          )}
        </Field>

        {/* Icon Size */}
        <Field label="Icon Size">
          <NumberInput
            value={config.iconSize}
            min={8}
            max={512}
            suffix="px"
            onChange={(n) => update('iconSize', n)}
          />
        </Field>

        {/* Icon Spacing */}
        <Field label="Icon Spacing">
          <NumberInput
            value={config.spacing}
            min={0}
            max={512}
            suffix="px"
            onChange={(n) => update('spacing', n)}
          />
        </Field>

        {/* Outer Padding */}
        <Field label="Outer Padding">
          <NumberInput
            value={config.padding}
            min={0}
            max={1000}
            suffix="px"
            onChange={(n) => update('padding', n)}
          />
        </Field>

        {/* Rotation */}
        <Field label="Rotation">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={-180}
                max={180}
                value={config.rotation}
                onChange={(e) => update('rotation', parseInt(e.target.value, 10))}
                className="flex-1 accent-indigo-500"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={config.rotation}
                  min={-180}
                  max={180}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!isNaN(n)) update('rotation', Math.max(-180, Math.min(180, n)));
                  }}
                  className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <span className="text-xs text-gray-400">°</span>
              </div>
            </div>
          </div>
        </Field>

        {/* Color */}
        <Field label="Icon Color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.color}
              onChange={(e) => update('color', e.target.value)}
              className="w-10 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 flex-shrink-0"
            />
            <input
              type="text"
              value={config.color}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update('color', v);
              }}
              placeholder="#d1d5db"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
        </Field>
      </div>
    </aside>
  );
}
