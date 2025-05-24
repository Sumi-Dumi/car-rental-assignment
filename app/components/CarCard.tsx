
'use client';

import Link from 'next/link';
import RentButton from './RentButton';

type Props = {
  car: {
    vin: string;
    brand: string;
    model: string;
    type: string;
    imageUrl: string;
    pricePerDay: number;
    available: boolean;
  };
};

export default function CarCard({ car }: Props) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastClickedVin', car.vin); // ✅ 여기서만 VIN 저장
    }
  };

  return (
    <Link
      href={`/reserve/${car.vin}`}
      onClick={handleClick}
      className="border rounded p-4 hover:shadow-lg transition cursor-pointer block"
    >
      <img src={car.imageUrl} alt={car.model} className="w-full h-40 object-cover mb-2" />
      <h2 className="font-semibold text-lg">{car.brand} {car.model}</h2>
      <p className="text-sm text-gray-600">{car.type}</p>
      <p>${car.pricePerDay.toFixed(2)} per day</p>
      <p>{car.available ? '✅ Available' : '❌ Unavailable'}</p>
      <RentButton vin={car.vin} available={car.available} />
    </Link>
  );
}
