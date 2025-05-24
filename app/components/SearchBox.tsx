'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getLiveSuggestions } from '../lib/searchSuggestions';

export default function SearchBox() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim()) {
        const data = await getLiveSuggestions(input.trim());
        setSuggestions(data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const handleSelect = (text: string) => {
    setInput(text);
    setShowDropdown(false);
    router.push(`/?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search cars"
        className="w-full border px-4 py-2 rounded-full"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full rounded shadow mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
