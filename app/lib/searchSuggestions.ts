import db from './db';

export async function getLiveSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];

  const words = query.toLowerCase().split(' ');

  const cars = await db.car.findMany({
    where: {
      OR: words.map(word => ({
        OR: [
          { brand: { contains: word } },
          { model: { contains: word } },
          { type: { contains: word } },
          { description: { contains: word } },
        ],
      })),
    },
    take: 10,
    select: { brand: true, model: true, type: true, description: true },
  });

  const suggestions = new Set<string>();

  cars.forEach(car => {
    if (car.brand?.toLowerCase().includes(query.toLowerCase())) suggestions.add(car.brand);
    if (car.model?.toLowerCase().includes(query.toLowerCase())) suggestions.add(`${car.brand} ${car.model}`);
    if (car.type?.toLowerCase().includes(query.toLowerCase())) suggestions.add(car.type);
    if (car.description?.toLowerCase().includes(query.toLowerCase())) suggestions.add(car.description);
  });

  return Array.from(suggestions);
}
