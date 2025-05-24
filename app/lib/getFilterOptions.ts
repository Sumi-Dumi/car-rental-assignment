import db from './db';

export async function getFilterOptions() {
  const brands = await db.car.findMany({
    distinct: ['brand'],
    select: { brand: true },
  });

  const types = await db.car.findMany({
    distinct: ['type'],
    select: { type: true },
  });

  const fuelTypes = await db.car.findMany({
    distinct: ['fuelType'],
    select: { fuelType: true },
  });

  return {
    brands: brands.map((b) => b.brand),
    types: types.map((t) => t.type),
    fuelTypes: fuelTypes.map((f) => f.fuelType),
  };
}
