import { getFilterOptions } from '../lib/getFilterOptions';
import FilterControls from './FilterControls';
import SearchBoxClient from './SearchBoxClient'; 

export default async function Header() {
  const { brands, types, fuelTypes } = await getFilterOptions();

  return (
    <>
      <div className="flex items-center gap-4 px-6 py-4 border-b">
        <a href="/">
          <img src="/logo.png" alt="Logo" width={80} height={40} />
        </a>
        <SearchBoxClient /> 
      </div>
      <FilterControls
        brandOptions={brands}
        typeOptions={types}
        fuelOptions={fuelTypes}
      />
    </>
  );
}
