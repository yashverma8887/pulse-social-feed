import { NextResponse } from 'next/server';
import { getNotifications, markNotificationsAsRead } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_01';

    const notifications = getNotifications(userId);
    return NextResponse.json({ success: true, count: notifications.length, notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    markNotificationsAsRead();
    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
