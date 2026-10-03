'use client';

import React from 'react';
import { useSocial } from '@/context/SocialContext';
import { ArrowUp, Sparkles, Radio } from 'lucide-react';

export default function RealTimeAlert() {
  const { hasNewPostsAlert, dismissNewPostsAlert } = useSocial();

  if (!hasNewPostsAlert) return null;

  return (
    <div className="sticky top-20 z-30 flex justify-center py-2 animate-in slide-in-from-top duration-300">
      <button
        onClick={dismissNewPostsAlert}
        className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-black text-xs rounded-full shadow-lg shadow-sky-500/25 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <Radio className="w-3.5 h-3.5 animate-pulse text-slate-950" />
        <span>New posts in feed • Click to view</span>
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
