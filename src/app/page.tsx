'use client';

import React from 'react';
import { useSocial } from '@/context/SocialContext';
import PostComposer from '@/components/PostComposer';
import PostCard from '@/components/PostCard';
import RealTimeAlert from '@/components/RealTimeAlert';
import { Sparkles, Radio, MessageSquare } from 'lucide-react';

export default function HomePage() {
  const { posts, loading, activeFeedTab, setActiveFeedTab } = useSocial();

  return (
    <div className="min-h-screen">
      
      {/* Sticky Header with Feed Tabs */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-850">
        <div className="px-6 py-3 flex items-center justify-between">
          <h1 className="text-base font-black text-white">Home Feed</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE STREAM
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-t border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveFeedTab('for-you')}
            className={`flex-1 py-3.5 text-center transition relative ${
              activeFeedTab === 'for-you' ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            For You
            {activeFeedTab === 'for-you' && (
              <div className="absolute bottom-0 inset-x-12 h-1 bg-sky-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveFeedTab('following')}
            className={`flex-1 py-3.5 text-center transition relative ${
              activeFeedTab === 'following' ? 'text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Following
            {activeFeedTab === 'following' && (
              <div className="absolute bottom-0 inset-x-12 h-1 bg-sky-400 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Main Stream Body */}
      <div className="p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
        {/* Post Creator Box */}
        <PostComposer />

        {/* Real-time incoming posts alert */}
        <RealTimeAlert />

        {/* Feed Posts */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Connecting to stream...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No posts in this stream yet</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Follow more creators or share your own thoughts to populate the reactive feed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
