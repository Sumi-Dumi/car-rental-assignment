// app/lib/fetchCars.ts
export type SearchParams = {
    q?: string | null;
    brand?: string[];
    type?: string[];
    fuelType?: string[];
  };
  
  export async function fetchCars(params: SearchParams) {
    const queryParams = new URLSearchParams();
  
    if (params.q) queryParams.set('q', params.q);
    params.brand?.forEach((b) => queryParams.append('brand', b));
    params.type?.forEach((t) => queryParams.append('type', t));
    params.fuelType?.forEach((f) => queryParams.append('fuelType', f));
  
    const res = await fetch(`/api/search?${queryParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch cars');
    return res.json();
  }
  