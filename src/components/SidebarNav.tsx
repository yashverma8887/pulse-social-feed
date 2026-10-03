'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSocial } from '@/context/SocialContext';
import {
  Home,
  Hash,
  Bell,
  Bookmark,
  User as UserIcon,
  Sparkles,
  Feather,
  CheckCircle2,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export default function SidebarNav() {
  const pathname = usePathname();
  const { currentUser, allUsers, switchUser, unreadNotificationsCount } = useSocial();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const NAV_ITEMS = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Hash },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: unreadNotificationsCount },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Profile', href: `/profile/${currentUser.handle}`, icon: UserIcon },
  ];

  return (
    <aside className="w-64 xl:w-72 h-screen sticky top-0 flex flex-col justify-between p-4 sm:p-6 border-r border-slate-800 bg-slate-950 text-slate-200">
      <div className="space-y-6">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 py-2 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">
              PULSE<span className="text-sky-400 font-black">FEED</span>
            </h1>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block -mt-1">
              Reactive Social
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 bg-sky-500 text-white rounded-full text-[10px] font-extrabold animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Switcher Persona Card */}
      <div className="relative pt-4 border-t border-slate-800">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-500/30"
            />
            <div className="text-left truncate">
              <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                {currentUser.name}
                {currentUser.isVerified && <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400" />}
              </div>
              <div className="text-[10px] text-slate-400 truncate">@{currentUser.handle}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </button>

        {/* Dropdown to switch between test personas */}
        {showUserDropdown && (
          <div
            className="absolute bottom-16 left-0 right-0 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ⚡ Switch Evaluator Persona:
            </div>
            {allUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  switchUser(user._id);
                  setShowUserDropdown(false);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition ${
                  currentUser._id === user._id ? 'bg-sky-500/20 text-sky-300 font-bold' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div className="truncate">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-400">@{user.handle}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
