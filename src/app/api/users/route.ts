import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/store';

export async function GET() {
  try {
    const users = getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
