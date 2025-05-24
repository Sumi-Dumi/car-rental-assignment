'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReserveRedirectPage() {
  const router = useRouter();
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    const lastVin = localStorage.getItem('lastClickedVin');

    if (lastVin) {
      router.replace(`/reserve/${lastVin}`);
    } else {
      setReminder(true); 
    }
  }, [router]);

  if (reminder) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Choose the car first!</h2>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to home
        </button>
      </div>
    );
  }

  return null; 
}
