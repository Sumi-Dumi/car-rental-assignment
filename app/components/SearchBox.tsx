'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (input.trim()) {
        fetch(`/api/suggestions?q=${encodeURIComponent(input.trim())}`)
          .then((res) => res.json())
          .then((data) => setSuggestions(data));
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [input]);

  const handleSelect = (text: string) => {
    setInput(text);
    setShowDropdown(false);
    router.push(`/?q=${encodeURIComponent(text)}`);
  };

  return (
    <div className="relative w-64">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search cars"
        className="w-full border px-4 py-2 rounded-full"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full rounded shadow mt-1">
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
