'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { IconX, IconSearch, IconChevronDown } from '@tabler/icons-react';
import { iconNames } from '@/lib/icon-data';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function IconMultiSelect({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? iconNames.filter((n) => n.includes(query.toLowerCase().trim())).slice(0, 100)
    : iconNames.slice(0, 100);

  const toggle = useCallback(
    (name: string) => {
      if (selected.includes(name)) {
        onChange(selected.filter((s) => s !== name));
      } else {
        onChange([...selected, name]);
      }
    },
    [selected, onChange]
  );

  const remove = useCallback(
    (name: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(selected.filter((s) => s !== name));
    },
    [selected, onChange]
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger / chips area */}
      <div
        className="min-h-[38px] w-full border border-gray-300 rounded-lg bg-white px-2 py-1.5 flex flex-wrap gap-1 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm self-center pl-1">Search icons…</span>
        )}
        {selected.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {name}
            <button
              type="button"
              onClick={(e) => remove(name, e)}
              className="hover:text-indigo-600 focus:outline-none"
              aria-label={`Remove ${name}`}
            >
              <IconX size={10} />
            </button>
          </span>
        ))}
        <span className="ml-auto self-center text-gray-400 flex-shrink-0">
          <IconChevronDown size={14} />
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col max-h-72">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
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
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <IconX size={12} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-400 text-center py-4">No icons found</div>
            ) : (
              <>
                {filtered.map((name) => {
                  const isSelected = selected.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggle(name)}
                      className={`w-full text-left px-3 py-1.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        isSelected ? 'text-indigo-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <span>{name}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
                {filtered.length === 100 && (
                  <div className="text-xs text-gray-400 text-center py-2 border-t border-gray-100">
                    Showing first 100 results — refine your search
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">{selected.length} selected</span>
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
