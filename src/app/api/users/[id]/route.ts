import { NextResponse } from 'next/server';
import { getUserByHandle, getUserById, getPosts } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserByHandle(params.id) || getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userPosts = getPosts({ authorHandle: user.handle });
    return NextResponse.json({ success: true, user, posts: userPosts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
