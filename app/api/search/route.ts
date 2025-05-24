import { NextRequest, NextResponse } from 'next/server';
import db from '../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') ?? '';
  const brands = searchParams.getAll('brand');
  const types = searchParams.getAll('type');
  const fuelTypes = searchParams.getAll('fuelType');

  const cars = await db.car.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { brand: { contains: query, mode: 'insensitive' } as any },
                { model: { contains: query, mode: 'insensitive' } as any },
                { type: { contains: query, mode: 'insensitive' } as any },
              ],
            }
          : {},
        brands.length > 0 ? { brand: { in: brands } } : {},
        types.length > 0 ? { type: { in: types } } : {},
        fuelTypes.length > 0 ? { fuelType: { in: fuelTypes } } : {},
      ],
    },
    
  });

  return NextResponse.json(cars);
}