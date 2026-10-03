'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSocial } from '@/context/SocialContext';
import { User, Post } from '@/types';
import PostCard from '@/components/PostCard';
import {
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const params = useParams();
  const handle = params.handle as string;
  const { currentUser, allUsers, toggleFollow, posts } = useSocial();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'media'>('posts');

  useEffect(() => {
    const user = allUsers.find(
      u => u.handle.toLowerCase() === handle.toLowerCase().replace('@', '')
    );
    if (user) {
      setProfileUser(user);
    }
  }, [handle, allUsers]);

  if (!profileUser) {
    return (
      <div className="p-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">User Profile Not Found</h2>
        <Link href="/" className="px-5 py-2 bg-sky-500 text-slate-950 font-bold rounded-full text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  const isSelf = currentUser._id === profileUser._id;
  const isFollowing = currentUser.following.includes(profileUser._id);
  const userPosts = posts.filter(p => p.author._id === profileUser._id);
  const userLikedPosts = posts.filter(p => p.likes.includes(profileUser._id));
  const userMediaPosts = userPosts.filter(p => p.mediaUrl);

  const displayedPosts =
    activeTab === 'posts' ? userPosts : (activeTab === 'likes' ? userLikedPosts : userMediaPosts);

  return (
    <div className="min-h-screen">
      {/* Header Bar */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 p-4 flex items-center gap-4">
        <Link href="/" className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base font-black text-white flex items-center gap-1.5">
            {profileUser.name}
            {profileUser.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400" />}
          </h1>
          <p className="text-[11px] text-slate-400">{userPosts.length} posts shared</p>
        </div>
      </header>

      {/* Profile Banner */}
      <div className="h-44 sm:h-56 bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 overflow-hidden relative">
        {profileUser.banner && (
          <img src={profileUser.banner} alt="" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Profile Bio Section */}
      <div className="px-6 pb-6 space-y-4 border-b border-slate-850">
        <div className="flex justify-between items-end -mt-14 sm:-mt-16 mb-2">
          <img
            src={profileUser.avatar}
            alt={profileUser.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-slate-950 bg-slate-900"
          />

          {!isSelf && (
            <button
              onClick={() => toggleFollow(profileUser._id)}
              className={`px-5 py-2 rounded-full font-bold text-xs transition shadow-md ${
                isFollowing
                  ? 'bg-slate-800 hover:bg-rose-500/20 text-slate-200 hover:text-rose-400 border border-slate-700'
                  : 'bg-white hover:bg-slate-200 text-slate-950'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-1.5">
            {profileUser.name}
            {profileUser.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400" />}
          </h2>
          <p className="text-xs text-slate-400">@{profileUser.handle}</p>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
          {profileUser.bio}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
          {profileUser.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profileUser.location}
            </span>
          )}
          {profileUser.website && (
            <a
              href={profileUser.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-sky-400 hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" /> {profileUser.website.replace('https://', '')}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Joined {profileUser.joinedDate}
          </span>
        </div>

        {/* Metrics */}
        <div className="flex gap-6 text-xs pt-1">
          <div>
            <strong className="text-white font-black">{profileUser.followingCount}</strong>{' '}
            <span className="text-slate-400">Following</span>
          </div>
          <div>
            <strong className="text-white font-black">{profileUser.followersCount}</strong>{' '}
            <span className="text-slate-400">Followers</span>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-3 text-center transition ${
            activeTab === 'posts' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Posts ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('likes')}
          className={`flex-1 py-3 text-center transition ${
            activeTab === 'likes' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Likes ({userLikedPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`flex-1 py-3 text-center transition ${
            activeTab === 'media' ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Media ({userMediaPosts.length})
        </button>
      </div>

      {/* Display Posts */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {displayedPosts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No posts in this category yet.
          </div>
        ) : (
          displayedPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
