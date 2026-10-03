import { NextResponse } from 'next/server';
import { voteOnPoll } from '@/lib/store';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { optionId, userId } = await request.json();
    if (!optionId || !userId) {
      return NextResponse.json({ error: 'optionId and userId are required' }, { status: 400 });
    }

    const updatedPost = voteOnPoll(params.id, optionId, userId);
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post or poll not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
