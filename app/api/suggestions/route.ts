import { searchSuggestions } from '@/app/lib/searchSuggestions';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const results = await searchSuggestions(query);
  return NextResponse.json(results);
}
