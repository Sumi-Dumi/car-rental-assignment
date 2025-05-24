'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterDropdown from './FilterDropdown';

type Props = {
  brandOptions: string[];
  typeOptions: string[];
  fuelOptions: string[];
};

export default function FilterControls({ brandOptions, typeOptions, fuelOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    brand: searchParams.getAll('brand'),
    type: searchParams.getAll('type'),
    fuelType: searchParams.getAll('fuelType'),
  });

  const handleChange = (name: string, values: string[]) => {
    setFilters((prev) => ({ ...prev, [name]: values }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    const q = searchParams.get('q');
    if (q) params.set('q', q);

    filters.brand.forEach((b) => params.append('brand', b));
    filters.type.forEach((t) => params.append('type', t));
    filters.fuelType.forEach((f) => params.append('fuelType', f));

    router.push('/?' + params.toString());
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="flex gap-4 px-6 py-4 border-b">
      <FilterDropdown
        title="Brand"
        name="brand"
        options={brandOptions}
        selected={filters.brand}
        onChange={handleChange}
      />
      <FilterDropdown
        title="Type"
        name="type"
        options={typeOptions}
        selected={filters.type}
        onChange={handleChange}
      />
      <FilterDropdown
        title="Fuel"
        name="fuelType"
        options={fuelOptions}
        selected={filters.fuelType}
        onChange={handleChange}
      />
    </div>
  );
}
