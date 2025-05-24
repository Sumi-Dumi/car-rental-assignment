import db from '../lib/db';

type SearchParams = {
  query: string | null;
  brand: string[];
  type: string[];
  fuelType: string[];
};

export async function searchCars({ query, brand, type, fuelType }: SearchParams) {
  return await db.car.findMany({
    where: {
      AND: [
        query
          ? {
              OR: [
                { brand: { contains: query } },
                { model: { contains: query } },
                { type: { contains: query } },
                { description: { contains: query } },
                { fuelType: { contains: query } },
              ],
            }
          : {},
        brand.length ? { brand: { in: brand } } : {},
        type.length ? { type: { in: type } } : {},
        fuelType.length ? { fuelType: { in: fuelType } } : {},
      ],
    },
  });
}

