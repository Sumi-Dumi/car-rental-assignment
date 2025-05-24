 'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBoxClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) params.set('q', query);
    else params.delete('q');
    router.push('/?' + params.toString());
  };

  return (
    <div className="flex items-center border border-black rounded-full px-4 py-2 bg-white">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
        placeholder="Search cars"
        className="outline-none bg-transparent w-64"
      />
      <button onClick={handleSearch} className="pl-2">🔍</button>
    </div>
  );
}
