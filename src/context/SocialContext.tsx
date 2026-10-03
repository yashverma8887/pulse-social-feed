'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, NotificationItem } from '@/types';
import { INITIAL_USERS } from '@/lib/mockData';

interface SocialContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  posts: Post[];
  loading: boolean;
  activeFeedTab: 'for-you' | 'following';
  setActiveFeedTab: (tab: 'for-you' | 'following') => void;
  createPost: (data: Partial<Post>) => Promise<boolean>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  votePoll: (postId: string, optionId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  toggleFollow: (targetUserId: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationsAsRead: () => Promise<void>;
  hasNewPostsAlert: boolean;
  dismissNewPostsAlert: () => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeedTab, setActiveFeedTab] = useState<'for-you' | 'following'>('for-you');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasNewPostsAlert, setHasNewPostsAlert] = useState(false);

  // Load feed and users
  const refreshFeed = async () => {
    try {
      const filter = activeFeedTab === 'following' ? `?filter=following&authorId=${currentUser._id}` : '';
      const res = await fetch(`/api/posts${filter}`);
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }

      const userRes = await fetch('/api/users');
      const userData = await userRes.json();
      if (userData.success && userData.users) {
        setAllUsers(userData.users);
        const updatedSelf = userData.users.find((u: User) => u._id === currentUser._id);
        if (updatedSelf) setCurrentUser(updatedSelf);
      }

      const notifRes = await fetch(`/api/notifications?userId=${currentUser._id}`);
      const notifData = await notifRes.json();
      if (notifData.success && notifData.notifications) {
        setNotifications(notifData.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFeed();
  }, [activeFeedTab, currentUser._id]);

  // Real-time simulated updates
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance every 25s to simulate an incoming live post notification
      if (Math.random() > 0.6) {
        setHasNewPostsAlert(true);
      }
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  const switchUser = (userId: string) => {
    const found = allUsers.find(u => u._id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const createPostHandler = async (data: Partial<Post>): Promise<boolean> => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          author: {
            _id: currentUser._id,
            handle: currentUser.handle,
            name: currentUser.name,
            avatar: currentUser.avatar,
            isVerified: currentUser.isVerified
          }
        })
      });
      const resData = await res.json();
      if (resData.success && resData.post) {
        setPosts(prev => [resData.post, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const toggleLikeHandler = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;
        const hasLiked = p.likes.includes(currentUser._id);
        const nextLikes = hasLiked
          ? p.likes.filter(id => id !== currentUser._id)
          : [...p.likes, currentUser._id];
        return { ...p, likes: nextLikes };
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
    } catch (err) {
      console.error(err);
      refreshFeed();
    }
  };

  const addCommentHandler = async (postId: string, content: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id, content })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => prev.map(p => (p._id === postId ? data.post : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const votePollHandler = async (postId: string, optionId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId, userId: currentUser._id })
      });
      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => prev.map(p => (p._id === postId ? data.post : p)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmarkHandler = async (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p._id !== postId) return p;
        const hasBookmarked = p.bookmarks?.includes(currentUser._id);
        const nextBookmarks = hasBookmarked
          ? p.bookmarks.filter(id => id !== currentUser._id)
          : [...(p.bookmarks || []), currentUser._id];
        return { ...p, bookmarks: nextBookmarks };
      })
    );

    try {
      const res = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser._id })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(prev => ({
          ...prev,
          bookmarks: data.bookmarks
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFollowHandler = async (targetUserId: string) => {
    try {
      const res = await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUserId: currentUser._id })
      });
      const data = await res.json();
      if (data.success) {
        setAllUsers(prev =>
          prev.map(u => {
            if (u._id === currentUser._id) return data.currentUser;
            if (u._id === targetUserId) return data.targetUser;
            return u;
          })
        );
        setCurrentUser(data.currentUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <SocialContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        posts,
        loading,
        activeFeedTab,
        setActiveFeedTab,
        createPost: createPostHandler,
        toggleLike: toggleLikeHandler,
        addComment: addCommentHandler,
        votePoll: votePollHandler,
        toggleBookmark: toggleBookmarkHandler,
        toggleFollow: toggleFollowHandler,
        refreshFeed,
        notifications,
        unreadNotificationsCount,
        markNotificationsAsRead,
        hasNewPostsAlert,
        dismissNewPostsAlert: () => {
          setHasNewPostsAlert(false);
          refreshFeed();
        }
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
