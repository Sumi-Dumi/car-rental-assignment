'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  year: number;
  mileage: number;
  fuelType: string;
  description?: string;
};

type FormState = {
  customerName: string;
  phoneNumber: string;
  email: string;
  licenseNumber: string;
  startDate: string;
  rentalDays: number;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function ReservePage() {
  const router = useRouter();
  const { vin } = useParams<{ vin: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const { visible, message, showPopup, hidePopup } = useReservationPopup();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!vin) return;
    fetch(`/api/cars/${vin}`)
      .then((res) => res.json())
      .then((data) => setCar(data))
      .catch(() => showPopup('Failed to fetch vehicle data.'));
  }, [vin]);

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

  useEffect(() => {
    if (form && vin) {
      localStorage.setItem(`reservationForm-${vin}`, JSON.stringify(form));
      validateForm(form);
    }
  }, [form, vin]);

  useEffect(() => {
    if (car && form) {
      setTotalPrice(car.pricePerDay * form.rentalDays);
    }
  }, [car, form]);

  const validateForm = (values: FormState) => {
    const newErrors: FormErrors = {};
    if (!values.customerName.trim()) newErrors.customerName = 'Name is required';
    if (!/^[0-9]{8,12}$/.test(values.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 8–12 digits';
    if (!/^[\w.-]+@\w+\.\w{2,}$/.test(values.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!/^[A-Z0-9]{8,10}$/.test(values.licenseNumber)) newErrors.licenseNumber = 'License must be 8–10 uppercase alphanumerics';
    if (!values.startDate) newErrors.startDate = 'Start date is required';
    if (!(values.rentalDays >= 1 && values.rentalDays <= 30)) newErrors.rentalDays = 'Rental days must be between 1 and 30';

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!form) return;
    const updated = {
      ...form,
      [name]: name === 'rentalDays' ? parseInt(value) : value,
    };
    setForm(updated);
    validateForm(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vin || !form || !isFormValid) return;

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
      <img
  src={car.imageUrl.startsWith('/') ? car.imageUrl : `/${car.imageUrl}`}
  alt={car.model}
  className="w-full h-60 object-cover mb-5"
/>

        <h2 className="text-xl font-semibold">{car.brand} {car.model}</h2>
        <p className="text-gray-600">{car.type}</p>
        <p className="text-gray-600">Year: {car.year}</p>
        <p className="text-gray-600">Mileage: {car.mileage.toLocaleString()} km</p>
        <p className="text-gray-600">Fuel Type: {car.fuelType}</p>
        {car.description && <p className="text-gray-600 italic mt-2">{car.description}</p>}
        <p className="text-gray-600 mt-2">${car.pricePerDay.toFixed(2)} per day</p>
        {!car.available && (
          <p className="text-red-500 font-semibold mt-2">This car is currently unavailable. Please rent another car.</p>
        )}
      </div>

      {car.available && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(['customerName', 'phoneNumber', 'email', 'licenseNumber', 'startDate', 'rentalDays'] as const).map((field) => (
            <div key={field}>
              <input
                type={
                  field === 'email' ? 'email' :
                  field === 'startDate' ? 'date' :
                  field === 'rentalDays' ? 'number' : 'text'
                }
                name={field}
                placeholder={
                  field === 'customerName' ? 'Name' :
                  field === 'licenseNumber' ? "Driver's License Number" :
                  field
                }
                value={form[field]}
                onChange={handleChange}
                required
                min={field === 'rentalDays' ? 1 : undefined}
                max={field === 'rentalDays' ? 30 : undefined}
                className="w-full border px-3 py-2 rounded"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
          <p className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</p>
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-2 rounded text-white ${
                isFormValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Reserve
            </button>
            <button type="button" onClick={handleCancel} className="flex-1 bg-gray-300 text-black py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <ReservationPopup
        message={message}
        visible={visible}
        onClose={handlePopupClose}
        onConfirm={handlePopupClose}
      />
    </main>
  );
}
