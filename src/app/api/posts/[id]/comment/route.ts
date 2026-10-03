import { NextResponse } from 'next/server';
import { addCommentToPost } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, content } = await request.json();
    if (!userId || !content) {
      return NextResponse.json({ error: 'userId and content are required' }, { status: 400 });
    }

    const result = addCommentToPost(params.id, userId, content);
    if (!result) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
