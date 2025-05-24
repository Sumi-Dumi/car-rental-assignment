import { NextResponse } from 'next/server';
import db from '../../lib/db';

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const startDate = new Date(`${data.startDate}T00:00:00`);
    if (isNaN(startDate.getTime())) {
      throw new Error('Invalid startDate');
    }

    const order = await db.order.create({
      data: {
        carVin: data.carVin,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        licenseNumber: data.licenseNumber,
        startDate,
        rentalDays: data.rentalDays,
        totalPrice: data.totalPrice,
        status: 'PENDING',
      },
    });

    await db.car.update({
      where: { vin: data.carVin },
      data: { available: false },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ success: false, error: 'Reservation failed' }, { status: 500 });
  }
}
