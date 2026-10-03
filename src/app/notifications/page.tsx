'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSocial } from '@/context/SocialContext';
import { Heart, MessageCircle, UserPlus, Bell, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useSocial();

  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-sky-400 fill-sky-400 shrink-0" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getMessage = (notif: any) => {
    switch (notif.type) {
      case 'like':
        return <span>liked your post: <strong className="text-slate-200">"{notif.post?.content?.slice(0, 40)}..."</strong></span>;
      case 'comment':
        return <span>replied to your post: <strong className="text-slate-200">"{notif.post?.content?.slice(0, 40)}..."</strong></span>;
      case 'follow':
        return <span>started following your profile and posts.</span>;
      default:
        return <span>interacted with your content.</span>;
    }
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
        <h1 className="text-base font-black text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-sky-400" />
          Notifications Center
        </h1>
        <button
          onClick={markNotificationsAsRead}
          className="text-xs text-sky-400 hover:underline font-bold flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
        </button>
      </header>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto divide-y divide-slate-850">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No notifications yet</h3>
            <p className="text-xs text-slate-400">When people like your posts or reply, you'll see them here.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 sm:p-5 rounded-2xl transition flex items-start gap-3.5 ${
                !n.read ? 'bg-sky-500/5 border-l-2 border-sky-400' : 'hover:bg-slate-900/50'
              }`}
            >
              <div className="mt-1">{getIcon(n.type)}</div>
              <Link href={`/profile/${n.actor.handle}`}>
                <img
                  src={n.actor.avatar}
                  alt={n.actor.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                />
              </Link>
              <div className="flex-1 min-w-0 text-xs text-slate-400 space-y-1">
                <div>
                  <Link href={`/profile/${n.actor.handle}`} className="font-bold text-white hover:underline">
                    {n.actor.name}
                  </Link>{' '}
                  {getMessage(n)}
                </div>
                <div className="text-[10px] text-slate-500">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
