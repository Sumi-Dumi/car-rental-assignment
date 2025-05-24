'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReservationPopup from '../../components/ReservationPopup';
import { useReservationPopup } from '../../hooks/useReservationPopup';

type Car = {
  vin: string;
  brand: string;
  model: string;
  type: string;
  imageUrl: string;
  pricePerDay: number;
  available: boolean;
};

type FormState = {
  customerName: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  startDate: string;
  rentalDays: number;
};

export default function ReservePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vinFromURL = searchParams.get('vin') ?? null;
  const [vin, setVin] = useState<string | null>(vinFromURL);
  const [car, setCar] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const { visible, message, showPopup, hidePopup } = useReservationPopup();

  // 초기화: vin이 없으면 localStorage에서 가져옴
  useEffect(() => {
    if (!vin) {
      const lastVin = localStorage.getItem('lastViewedVin');
      if (lastVin) {
        setVin(lastVin);
      } else {
        showPopup('No vehicle selected. Please go back and choose a car.');
      }
    }
  }, [vin]);

  // 차량 정보 fetch
  useEffect(() => {
    if (!vin) return;
    fetch(`/api/cars/${vin}`)
      .then((res) => res.json())
      .then((data) => setCar(data))
      .catch(() => showPopup('Failed to fetch vehicle data.'));
  }, [vin]);

  // 폼 초기화
  useEffect(() => {
    if (!vin) return;
    const saved = localStorage.getItem(`reservationForm-${vin}`);
    const parsed: FormState = saved
      ? JSON.parse(saved)
      : {
          customerName: '',
          phoneNumber: '',
          email: '',
          licenseNumber: '',
          startDate: '',
          rentalDays: 1,
        };
    setForm(parsed);
  }, [vin]);

  // 폼 저장
  useEffect(() => {
    if (form && vin) {
      localStorage.setItem(`reservationForm-${vin}`, JSON.stringify(form));
    }
  }, [form, vin]);

  // 총 가격 계산
  useEffect(() => {
    if (car && form) {
      setTotalPrice(car.pricePerDay * form.rentalDays);
    }
  }, [car, form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!form) return;
    setForm((prev) => ({
      ...prev!,
      [name]: name === 'rentalDays' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || !form) return;

    const order = {
      carVin: vin,
      ...form,
      totalPrice,
    };

    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (res.ok) {
      localStorage.removeItem(`reservationForm-${vin}`);
      showPopup('Your reservation has been placed. Please click the link to confirm');
    } else {
      showPopup('Reservation failed. Please try again.');
    }
  };

  const handleCancel = () => {
    if (vin) localStorage.removeItem(`reservationForm-${vin}`);
    router.push('/');
  };

  const handlePopupClose = () => {
    hidePopup();
    router.push('/');
  };

  if (!vin || !car || !form) return <p>Loading...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <header className="mb-4 flex items-center gap-4">
        <a href="/"><img src="/logo.png" alt="Logo" width={100} /></a>
        <h1 className="text-2xl font-bold">Reserve</h1>
      </header>

      <div className="mb-6">
        <img src={car.imageUrl} alt={car.model} className="w-full h-40 object-cover mb-2" />
        <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
        <p className="text-gray-600">{car.type}</p>
        <p className="text-gray-600">${car.pricePerDay.toFixed(2)} per day</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="customerName" placeholder="Name" value={form.customerName} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="tel" name="phoneNumber" pattern="^[0-9]{8,12}$" title="Enter a valid phone number" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="text" name="licenseNumber" pattern="^[A-Z0-9]{8,10}$" title="Enter a valid Australian license number" placeholder="Driver's License Number" value={form.licenseNumber} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <input type="number" name="rentalDays" min={1} max={30} value={form.rentalDays} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
        <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">Reserve</button>
          <button type="button" onClick={handleCancel} className="flex-1 bg-gray-300 text-black py-2 rounded">Cancel</button>
        </div>
      </form>

      <ReservationPopup
        message={message}
        visible={visible}
        onClose={handlePopupClose}
        onConfirm={handlePopupClose}
      />
    </main>
  );
}
