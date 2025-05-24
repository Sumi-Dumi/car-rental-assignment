import db from './db';

export async function searchSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();

  const results = await db.car.findMany({
    where: {
      OR: [
        { brand: { contains: query } },
        { model: { contains: query } },
        { type: { contains: query } },
      ],
    },
    take: 10,
    select: {
      brand: true,
      model: true,
      type: true,
    },
  });

  const suggestions = new Set<string>();

  results.forEach((car) => {
    if (car.brand?.toLowerCase().includes(queryLower)) {
      suggestions.add(car.brand);
    }
    if (car.model?.toLowerCase().includes(queryLower)) {
      suggestions.add(`${car.brand} ${car.model}`);
    }
    if (car.type?.toLowerCase().includes(queryLower)) {
      suggestions.add(car.type);
    }
  });

  return Array.from(suggestions);
}
