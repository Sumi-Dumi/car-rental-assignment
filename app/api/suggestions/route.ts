import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase().trim() || '';

  if (!query) return NextResponse.json([]);

  const results = await db.car.findMany({
    where: {
      OR: [
        { brand: { contains: query } },
        { model: { contains: query } },
        { type: { contains: query } },
      ],
    },
    take: 10,
    select: { brand: true, model: true, type: true },
  });

  const suggestions = new Set<string>();

  results.forEach((car) => {
    if (car.brand?.toLowerCase().includes(query)) suggestions.add(car.brand);
    if (car.model?.toLowerCase().includes(query)) suggestions.add(`${car.brand} ${car.model}`);
    if (car.type?.toLowerCase().includes(query)) suggestions.add(car.type);
  });

  return NextResponse.json(Array.from(suggestions));
}
