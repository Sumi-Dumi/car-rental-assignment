'use client';

import Header from './Header';
import RentButton from './RentButton';

export default function CarList({ cars, query }: { cars: any[]; query: string | null }) {
  return (
    <main>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Results for "${query}"` : 'All Cars'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car.vin} className="border rounded p-4">
              <img src={car.imageUrl} alt={car.model} className="w-full h-40 object-cover mb-2" />
              <h2 className="font-semibold text-lg">{car.brand} {car.model}</h2>
              <p className="text-sm text-gray-600">{car.type}</p>
              <p>${car.pricePerDay.toFixed(2)} per day</p>
              <p>{car.available ? '✅ Available' : '❌ Unavailable'}</p>
              <RentButton vin={car.vin} available={car.available} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
