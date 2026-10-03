'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { useSocial } from '@/context/SocialContext';
import {
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  Share2,
  CheckCircle2,
  BarChart2,
  Code,
  Send,
  Sparkles
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { currentUser, toggleLike, addComment, votePoll, toggleBookmark } = useSocial();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const hasLiked = post.likes.includes(currentUser._id);
  const hasBookmarked = post.bookmarks?.includes(currentUser._id) || currentUser.bookmarks?.includes(post._id);
  const userPollVote = post.poll?.votedUserIds?.[currentUser._id];

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await addComment(post._id, commentInput.trim());
    setCommentInput('');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/post/${post._id}`);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  // Format content to highlight #hashtags
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Link
            key={index}
            href={`/explore?tag=${encodeURIComponent(part.replace('#', ''))}`}
            className="text-sky-400 hover:underline font-semibold"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md hover:border-slate-700/80 transition duration-200 space-y-4">
      {/* Header: Author & Time */}
      <div className="flex items-start justify-between">
        <Link href={`/profile/${post.author.handle}`} className="flex items-center gap-3 group">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-800 group-hover:ring-sky-500/50 transition shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white group-hover:text-sky-400 transition">
              <span>{post.author.name}</span>
              {post.author.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              )}
            </div>
            <div className="text-xs text-slate-400">@{post.author.handle}</div>
          </div>
        </Link>

        <span className="text-[11px] font-medium text-slate-500">
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Main Post Text Content */}
      <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
        {renderFormattedContent(post.content)}
      </p>

      {/* Media Image Attachment */}
      {post.mediaUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-800 max-h-96 bg-slate-950">
          <img
            src={post.mediaUrl}
            alt=""
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
          />
        </div>
      )}

      {/* Code Snippet Attachment */}
      {post.codeSnippet && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2 overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-850">
            <span className="flex items-center gap-1.5 text-purple-400 font-bold uppercase">
              <Code className="w-3.5 h-3.5" /> {post.codeSnippet.language}
            </span>
          </div>
          <pre className="text-xs text-emerald-300 font-mono overflow-x-auto leading-relaxed p-1">
            {post.codeSnippet.code}
          </pre>
        </div>
      )}

      {/* Interactive Poll Attachment */}
      {post.poll && (
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-sky-400" />
            {post.poll.question}
          </h4>

          <div className="space-y-2 pt-1">
            {post.poll.options.map((opt) => {
              const total = post.poll!.totalVotes || 1;
              const pct = post.poll!.totalVotes > 0 ? Math.round((opt.votes / total) * 100) : 0;
              const isSelected = userPollVote === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => votePoll(post._id, opt.id)}
                  disabled={Boolean(userPollVote)}
                  className={`relative w-full p-3 rounded-xl border text-left text-xs transition overflow-hidden group ${
                    isSelected
                      ? 'border-sky-500 text-white font-bold bg-sky-500/10'
                      : userPollVote
                      ? 'border-slate-800 text-slate-300'
                      : 'border-slate-800 hover:border-sky-500/50 text-slate-200'
                  }`}
                >
                  {/* Fill progress background if voted */}
                  {userPollVote && (
                    <div
                      style={{ width: `${pct}%` }}
                      className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                        isSelected ? 'bg-sky-500/25' : 'bg-slate-800/60'
                      }`}
                    />
                  )}

                  <div className="relative z-10 flex justify-between items-center">
                    <span>{opt.text} {isSelected && '✓'}</span>
                    {userPollVote && (
                      <span className="font-mono font-bold text-sky-400">{pct}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 font-medium">
            {post.poll.totalVotes} total votes {userPollVote ? '• Final calculations' : '• Tap an option to vote'}
          </div>
        </div>
      )}

      {/* Action Bar (Likes, Comments, Repost, Bookmark, Share) */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-slate-400 text-xs font-semibold">
        {/* Like Button */}
        <button
          onClick={() => toggleLike(post._id)}
          className={`flex items-center gap-1.5 p-2 rounded-xl transition ${
            hasLiked ? 'text-rose-500 font-bold' : 'hover:text-rose-400 hover:bg-rose-500/10'
          }`}
        >
          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-500' : ''}`} />
          <span>{post.likes.length}</span>
        </button>

        {/* Comments Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 p-2 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments?.length || post.commentsCount || 0}</span>
        </button>

        {/* Repost Button */}
        <button
          onClick={() => alert('Reposted to your profile!')}
          className="flex items-center gap-1.5 p-2 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition"
        >
          <Repeat className="w-4 h-4" />
          <span>{post.reposts?.length || 0}</span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark(post._id)}
          className={`flex items-center gap-1.5 p-2 rounded-xl transition ${
            hasBookmarked ? 'text-amber-400 font-bold' : 'hover:text-amber-400 hover:bg-amber-500/10'
          }`}
          title={hasBookmarked ? 'Saved in Bookmarks' : 'Save Bookmark'}
        >
          <Bookmark className={`w-4 h-4 ${hasBookmarked ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="p-2 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {copiedShare && (
        <div className="text-[11px] text-emerald-400 font-bold text-center bg-emerald-500/10 py-1.5 rounded-xl border border-emerald-500/30">
          ✓ Post link copied to clipboard!
        </div>
      )}

      {/* Expandable Comment Thread */}
      {showComments && (
        <div className="pt-4 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Post your reply..."
              className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition disabled:opacity-40"
            >
              Reply
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3 divide-y divide-slate-800/60">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="pt-3 first:pt-0 flex items-start gap-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{comment.author.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
