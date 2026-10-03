'use client';

import React from 'react';
import { useSocial } from '@/context/SocialContext';
import PostCard from '@/components/PostCard';
import { Bookmark, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const { posts, currentUser } = useSocial();

  const bookmarkedPosts = posts.filter(p =>
    currentUser.bookmarks?.includes(p._id) || p.bookmarks?.includes(currentUser._id)
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            Saved Bookmarks
          </h1>
          <p className="text-[11px] text-slate-500">@{currentUser.handle}'s reading list</p>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {bookmarkedPosts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Save posts for later</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Don’t let the good ones fly away! Tap the bookmark icon on any post to save it here.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2 bg-sky-500 text-slate-950 font-bold rounded-full text-xs"
            >
              Browse Feed
            </Link>
          </div>
        ) : (
          bookmarkedPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
