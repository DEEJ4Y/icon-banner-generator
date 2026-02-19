'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { IconX, IconSearch, IconCheck } from '@tabler/icons-react';
import { iconNames, iconData } from '@/lib/icon-data';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  onClose: () => void;
}

const RESULTS_LIMIT = 200;

function IconItem({
  name,
  isSelected,
  onToggle,
}: {
  name: string;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={name}
      className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke={isSelected ? '#4f46e5' : '#6b7280'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: iconData[name] ?? '' }}
      />
      <span className={`text-[9px] leading-tight text-center w-full truncate ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
        {name}
      </span>
      {isSelected && (
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-indigo-500 rounded-full flex items-center justify-center">
          <IconCheck size={8} color="white" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

export default function IconPickerModal({ selected, onChange, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [showSelected, setShowSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    const base = showSelected ? selected : iconNames;
    const q = query.toLowerCase().trim();
    return q ? base.filter((n) => n.includes(q)).slice(0, RESULTS_LIMIT) : base.slice(0, RESULTS_LIMIT);
  }, [query, showSelected, selected]);

  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Pick Icons</h2>
            <p className="text-xs text-gray-400 mt-0.5">{iconNames.length.toLocaleString()} icons available</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Search + tabs */}
        <div className="px-5 pt-3 pb-2 flex flex-col gap-2 border-b border-gray-100">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:border-indigo-400 focus-within:bg-white transition-colors">
            <IconSearch size={14} className="text-gray-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons…"
              className="flex-1 text-sm outline-none bg-transparent"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                <IconX size={12} />
              </button>
            )}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setShowSelected(false)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                !showSelected ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setShowSelected(true)}
              className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                showSelected ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Selected ({selected.length})
            </button>
          </div>
        </div>

        {/* Icon grid */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              {showSelected ? 'No icons selected yet' : 'No icons found'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1">
                {filtered.map((name) => (
                  <IconItem
                    key={name}
                    name={name}
                    isSelected={selected.includes(name)}
                    onToggle={() => toggle(name)}
                  />
                ))}
              </div>
              {filtered.length === RESULTS_LIMIT && (
                <p className="text-xs text-gray-400 text-center mt-4 pb-1">
                  Showing first {RESULTS_LIMIT} results — refine your search
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">
              {selected.length} selected
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear all
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
