'use client';

import { useState, useEffect, useRef } from 'react';
import IconMultiSelect from './IconMultiSelect';

export const RESOLUTIONS = [
  { label: '1080p (1920×1080)', width: 1920, height: 1080 },
  { label: '1440p (2560×1440)', width: 2560, height: 1440 },
  { label: '2160p (3840×2160)', width: 3840, height: 2160 },
];

export type Resolution = { label: string; width: number; height: number };

export interface BannerConfig {
  resolution: Resolution;
  selectedIcons: string[];
  iconSize: number;
  spacing: number;
  padding: number;
  rotation: number;
  color: string;
  iconOpacity: number;
  bgColor: string;
  bgOpacity: number;
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
  placeholder,
  className,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
  suffix?: string;
  placeholder?: string;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState(String(value));
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      setLocalValue(String(value));
    }
  }, [value]);

  function isInRange(n: number) {
    if (min !== undefined && n < min) return false;
    if (max !== undefined && n > max) return false;
    return true;
  }

  return (
    <div className={`flex items-center gap-1${className ? ` ${className}` : ''}`}>
      <input
        type="number"
        value={localValue}
        min={min}
        max={max}
        placeholder={placeholder}
        onChange={(e) => {
          setLocalValue(e.target.value);
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n) && isInRange(n)) onChange(n);
        }}
        onBlur={() => {
          const n = parseInt(localValue, 10);
          if (isNaN(n) || !isInRange(n)) {
            setLocalValue(String(value));
          } else {
            setLocalValue(String(n));
          }
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
    <aside className="w-full h-full bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">Banner Gen</h1>
        <p className="text-xs text-gray-400 mt-0.5">Generate icon pattern banners</p>
      </div>

      <div className="px-5 py-4 flex flex-col gap-5">
        {/* Resolution */}
        {(() => {
          const isCustom = config.resolution.label === 'Custom';
          return (
            <Field label="Resolution">
              <select
                value={isCustom ? 'custom' : `${config.resolution.width}x${config.resolution.height}`}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    update('resolution', { label: 'Custom', width: config.resolution.width, height: config.resolution.height });
                  } else {
                    const res = RESOLUTIONS.find((r) => `${r.width}x${r.height}` === e.target.value);
                    if (res) update('resolution', res);
                  }
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={`${r.width}x${r.height}`} value={`${r.width}x${r.height}`}>
                    {r.label}
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {isCustom && (
                <div className="flex items-center gap-2 mt-1.5">
                  <NumberInput
                    value={config.resolution.width}
                    min={1}
                    placeholder="Width"
                    className="flex-1"
                    onChange={(n) => update('resolution', { label: 'Custom', width: n, height: config.resolution.height })}
                  />
                  <span className="text-xs text-gray-400 flex-shrink-0">×</span>
                  <NumberInput
                    value={config.resolution.height}
                    min={1}
                    placeholder="Height"
                    className="flex-1"
                    onChange={(n) => update('resolution', { label: 'Custom', width: config.resolution.width, height: n })}
                  />
                </div>
              )}
            </Field>
          );
        })()}

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

        {/* Background Color */}
        <Field label="Background Color">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={config.bgColor}
              onChange={(e) => update('bgColor', e.target.value)}
              className="w-10 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 flex-shrink-0"
            />
            <input
              type="text"
              value={config.bgColor}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) update('bgColor', v);
              }}
              placeholder="#ffffff"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="range"
              min={0}
              max={100}
              value={config.bgOpacity}
              onChange={(e) => update('bgOpacity', parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-500"
            />
            <span className="text-xs text-gray-500 w-9 text-right tabular-nums">{config.bgOpacity}%</span>
          </div>
        </Field>

        {/* Icon Color */}
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
          <div className="flex items-center gap-2 mt-1.5">
            <input
              type="range"
              min={0}
              max={100}
              value={config.iconOpacity}
              onChange={(e) => update('iconOpacity', parseInt(e.target.value, 10))}
              className="flex-1 accent-indigo-500"
            />
            <span className="text-xs text-gray-500 w-9 text-right tabular-nums">{config.iconOpacity}%</span>
          </div>
        </Field>
      </div>
    </aside>
  );
}
