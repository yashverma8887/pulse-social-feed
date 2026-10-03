import { NextResponse } from 'next/server';
import { toggleBookmark } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const result = toggleBookmark(params.id, userId);
    if (!result) {
      return NextResponse.json({ error: 'Post or user not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
