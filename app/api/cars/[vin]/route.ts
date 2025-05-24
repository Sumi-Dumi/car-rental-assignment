import { NextRequest, NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function GET(req: NextRequest, context: { params: Promise<any> }) {
  const params = await context.params; // Await params before using its properties
  const vin = params?.vin;

  if (!vin || typeof vin !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid VIN' }, { status: 400 });
  }

  try {
    const car = await db.car.findUnique({
      where: { vin },
    });

    return car
      ? NextResponse.json(car)
      : NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('Fetch car error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
