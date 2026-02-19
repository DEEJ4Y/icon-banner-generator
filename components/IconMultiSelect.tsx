'use client';

import { useState, useCallback } from 'react';
import { IconX, IconChevronDown } from '@tabler/icons-react';
import { iconData } from '@/lib/icon-data';
import IconPickerModal from './IconPickerModal';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function IconMultiSelect({ selected, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const remove = useCallback(
    (name: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(selected.filter((s) => s !== name));
    },
    [selected, onChange]
  );

  return (
    <>
      {/* Trigger / chips area */}
      <div
        className="min-h-[38px] w-full border border-gray-300 rounded-lg bg-white px-2 py-1.5 flex flex-wrap gap-1 cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => setOpen(true)}
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm self-center pl-1">Browse icons…</span>
        )}
        {selected.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-medium pl-1 pr-2 py-0.5 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: iconData[name] ?? '' }}
            />
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

      {/* Modal */}
      {open && (
        <IconPickerModal
          selected={selected}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
