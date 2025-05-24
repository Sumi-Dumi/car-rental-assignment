'use client';

import { useRouter } from 'next/navigation';

type Props = {
  vin: string;
  available: boolean;
};

export default function RentButton({ vin, available }: Props) {
  const router = useRouter();

  const handleClick = () => {
    if (!available) return;

    // Save the last clicked VIN to localStorage
    localStorage.setItem('lastViewedVin', vin);

    // Navigate to reservation page
    router.push(`/reserve/${vin}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!available}
      className={`mt-3 px-4 py-2 rounded text-white text-sm ${
        available ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
      }`}
    >
      {available ? 'Rent Now' : 'Unavailable'}
    </button>
  );
}
