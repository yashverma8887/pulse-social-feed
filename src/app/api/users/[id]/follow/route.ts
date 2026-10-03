import { NextResponse } from 'next/server';
import { toggleFollow } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { currentUserId } = await request.json();
    if (!currentUserId) {
      return NextResponse.json({ error: 'currentUserId is required' }, { status: 400 });
    }

    const result = toggleFollow(currentUserId, params.id);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
