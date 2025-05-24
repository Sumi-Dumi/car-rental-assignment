import db from './db';

export async function getLiveSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];

  const lowered = query.toLowerCase();

  const cars = await db.car.findMany({
    where: {
      OR: [
        { brand: { contains: query } },
        { model: { contains: query } },
        { type: { contains: query } },
        { description: { contains: query } },
      ],
    },
    take: 10,
    select: { brand: true, model: true, type: true, description: true, },
  });

  const suggestions = new Set<string>();

  cars.forEach(car => {
    if (car.brand?.toLowerCase().includes(lowered)) suggestions.add(car.brand);
    if (car.model?.toLowerCase().includes(lowered)) suggestions.add(`${car.brand} ${car.model}`);
    if (car.type?.toLowerCase().includes(lowered)) suggestions.add(car.type);
    if (car.description?.toLowerCase().includes(lowered)) suggestions.add(car.description);
  });

  return Array.from(suggestions);
}
