
import Header from './components/Header';
import { searchCars } from './lib/searchCars';
import CarCard from './components/CarCard';

type SearchParams = {
  q?: string;
  brand?: string | string[];
  type?: string | string[];
  fuelType?: string | string[];
};

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.q ?? null;

  const toArray = (param?: string | string[]): string[] =>
    typeof param === 'string' ? [param] : param ?? [];

  const cars = await searchCars({
    query,
    brand: toArray(params.brand),
    type: toArray(params.type),
    fuelType: toArray(params.fuelType),
  });

  return (
    <main>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Results for "${query}"` : 'All Cars'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cars.map((car) => (
            <CarCard key={car.vin} car={car} />
          ))}
        </div>
      </div>
    </main>
  );
}
