'use client';

import { useState, useEffect, useRef } from 'react';

type FilterDropdownProps = {
  title: string;
  name: string;
  options: string[];
  selected: string[];
  onChange: (name: string, values: string[]) => void;
};

export default function FilterDropdown({ title, name, options, selected, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(name, selected.filter((v) => v !== value));
    } else {
      onChange(name, [...selected, value]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="border px-4 py-2 rounded-full text-sm bg-white"
      >
        {title}
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow">
          {options.map((option) => (
            <label key={option} className="flex items-center px-3 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => toggleValue(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
