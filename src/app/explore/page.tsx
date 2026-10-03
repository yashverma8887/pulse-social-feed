'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';
import { Search, Hash, Sparkles } from 'lucide-react';
import { TRENDING_TOPICS } from '@/lib/mockData';

const POPULAR_TAGS = ['All', 'Nextjs14', 'React19', 'AIEngineering', 'TypeScript', 'DevOps', 'WebDev'];

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTag = searchParams.get('tag') || 'All';

  const [selectedTag, setSelectedTag] = useState<string>(initialTag);
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramTag = searchParams.get('tag');
    if (paramTag) setSelectedTag(paramTag);
  }, [searchParams]);

  useEffect(() => {
    async function loadExplorePosts() {
      setLoading(true);
      try {
        const tagParam = selectedTag !== 'All' ? `?tag=${encodeURIComponent(selectedTag)}` : '';
        const res = await fetch(`/api/posts${tagParam}`);
        const data = await res.json();
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadExplorePosts();
  }, [selectedTag]);

  const filteredPosts = posts.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.content.toLowerCase().includes(q) ||
           p.author.name.toLowerCase().includes(q) ||
           p.tags?.some(t => t.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 p-4 sm:p-6 space-y-4">
        <h1 className="text-base font-black text-white">Explore Trends & Topics</h1>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all posts, authors, or code snippets..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>

        {/* Tag Pill Selector */}
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                if (tag === 'All') router.push('/explore');
                else router.push(`/explore?tag=${encodeURIComponent(tag)}`);
              }}
              className={`px-3.5 py-1.5 rounded-full font-bold transition shrink-0 ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tag === 'All' ? 'All Topics' : `#${tag}`}
            </button>
          ))}
        </div>
      </header>

      {/* Posts Stream */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            Filtering explore feed...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-2">
            <Hash className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No posts found for this topic</h3>
            <p className="text-xs text-slate-400">Try selecting another hashtag or adjusting your keywords.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-500">Loading explore feed...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
