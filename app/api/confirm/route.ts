import { NextRequest, NextResponse } from 'next/server';
import db from '../../lib/db';

export async function POST(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
  
    if (!id) return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  
    try {
      await db.order.update({
        where: { id: parseInt(id) },
        data: { status: 'CONFIRMED' },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to confirm order' }, { status: 500 });
    }
  }
  