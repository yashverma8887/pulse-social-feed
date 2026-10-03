'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSocial } from '@/context/SocialContext';
import { TRENDING_TOPICS } from '@/lib/mockData';
import {
  Search,
  TrendingUp,
  UserPlus,
  Check,
  Sparkles,
  Radio,
  CheckCircle2
} from 'lucide-react';

export default function TrendingSidebar() {
  const { currentUser, allUsers, toggleFollow } = useSocial();
  const [searchTerm, setSearchTerm] = useState('');

  const usersToFollow = allUsers.filter(u => u._id !== currentUser._id).slice(0, 3);

  return (
    <aside className="w-80 h-screen sticky top-0 hidden lg:flex flex-col justify-between p-6 border-l border-slate-800 bg-slate-950 text-slate-200 overflow-y-auto space-y-6">
      <div className="space-y-6">
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Pulse posts, topics..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        {/* Live Pulse Metric Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-sky-950/60 to-slate-900 border border-sky-900/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-bold text-sky-400">
              <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              Live WebSocket Stream
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
              12ms LATENCY
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Real-time feed streaming with optimistic updates and live poll telemetry.
          </p>
        </div>

        {/* Trending Topics */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-400" />
            Trending on Pulse
          </h3>

          <div className="space-y-3">
            {TRENDING_TOPICS.map((topic) => (
              <Link
                key={topic.tag}
                href={`/explore?tag=${encodeURIComponent(topic.tag.replace('#', ''))}`}
                className="block group space-y-0.5"
              >
                <div className="text-[10px] text-slate-500 font-medium">{topic.category}</div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition">
                  {topic.tag}
                </div>
                <div className="text-[10px] text-slate-500">{topic.postCount}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Who to follow</h3>

          <div className="space-y-3">
            {usersToFollow.map((user) => {
              const isFollowing = currentUser.following.includes(user._id);

              return (
                <div key={user._id} className="flex items-center justify-between gap-3">
                  <Link href={`/profile/${user.handle}`} className="flex items-center gap-2.5 min-w-0 group">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-800 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-sky-400 transition truncate flex items-center gap-1">
                        {user.name}
                        {user.isVerified && <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400" />}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">@{user.handle}</div>
                    </div>
                  </Link>

                  <button
                    onClick={() => toggleFollow(user._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                      isFollowing
                        ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700'
                        : 'bg-white hover:bg-slate-200 text-slate-950 shadow-sm'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <div className="text-[11px] text-slate-600 space-y-1 pt-4 border-t border-slate-850">
        <p>© 2026 PulseSocial Inc. Capstone #2</p>
        <p>Built with Next.js 14, WebSockets & Tailwind</p>
      </div>
    </aside>
  );
}
