'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReserveRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const lastVin = localStorage.getItem('lastViewedVin');
    if (lastVin) {
      router.replace(`/reserve/${lastVin}`);
    } else {
      alert('No car selected previously.');
      router.push('/');
    }
  }, [router]);

  return <p className="p-4 text-center">Redirecting to last viewed car...</p>;
}
 