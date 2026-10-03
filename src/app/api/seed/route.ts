import { NextResponse } from 'next/server';
import { resetStore } from '@/lib/store';

export async function POST() {
  try {
    const store = resetStore();
    return NextResponse.json({
      success: true,
      message: 'Feed and accounts successfully reset to initial seed data',
      usersCount: store.users.length,
      postsCount: store.posts.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Reset failed' }, { status: 500 });
  }
}
