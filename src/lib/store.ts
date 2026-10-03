import { User, Post, Comment, NotificationItem } from '@/types';
import { INITIAL_USERS, INITIAL_POSTS, INITIAL_NOTIFICATIONS } from './mockData';

declare global {
  var __PULSE_STORE__: {
    users: User[];
    posts: Post[];
    notifications: NotificationItem[];
  } | undefined;
}

if (!global.__PULSE_STORE__) {
  global.__PULSE_STORE__ = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    posts: JSON.parse(JSON.stringify(INITIAL_POSTS)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS))
  };
}

export const getStore = () => global.__PULSE_STORE__!;

export const resetStore = () => {
  global.__PULSE_STORE__ = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    posts: JSON.parse(JSON.stringify(INITIAL_POSTS)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS))
  };
  return global.__PULSE_STORE__;
};

// ================= POST OPERATIONS =================
export const getPosts = (params?: { filter?: string; tag?: string; authorId?: string; authorHandle?: string }) => {
  const store = getStore();
  let results = [...store.posts];

  if (params?.tag) {
    const cleanTag = params.tag.replace('#', '').toLowerCase();
    results = results.filter(p => p.tags?.some(t => t.toLowerCase() === cleanTag));
  }

  if (params?.authorId) {
    results = results.filter(p => p.author._id === params.authorId);
  }

  if (params?.authorHandle) {
    results = results.filter(p => p.author.handle.toLowerCase() === params.authorHandle!.toLowerCase());
  }

  if (params?.filter === 'following' && params?.authorId) {
    const currentUser = store.users.find(u => u._id === params.authorId);
    if (currentUser) {
      results = results.filter(p => currentUser.following.includes(p.author._id) || p.author._id === currentUser._id);
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostById = (id: string) => {
  return getStore().posts.find(p => p._id === id);
};

export const createPost = (data: Partial<Post>) => {
  const store = getStore();
  const authorUser = store.users.find(u => u._id === data.author?._id) || store.users[0];

  const newPost: Post = {
    _id: `post_${Date.now()}`,
    author: {
      _id: authorUser._id,
      handle: authorUser.handle,
      name: authorUser.name,
      avatar: authorUser.avatar,
      isVerified: authorUser.isVerified
    },
    content: data.content || '',
    mediaUrl: data.mediaUrl || undefined,
    tags: data.tags || [],
    codeSnippet: data.codeSnippet || undefined,
    poll: data.poll ? {
      question: data.poll.question,
      options: data.poll.options.map(opt => ({ id: opt.id || `opt_${Math.random()}`, text: opt.text, votes: 0 })),
      totalVotes: 0,
      votedUserIds: {}
    } : undefined,
    likes: [],
    reposts: [],
    bookmarks: [],
    commentsCount: 0,
    comments: [],
    createdAt: new Date().toISOString()
  };

  store.posts.unshift(newPost);
  return newPost;
};

export const toggleLikePost = (postId: string, userId: string) => {
  const store = getStore();
  const post = store.posts.find(p => p._id === postId);
  if (!post) return null;

  const hasLiked = post.likes.includes(userId);
  if (hasLiked) {
    post.likes = post.likes.filter(id => id !== userId);
  } else {
    post.likes.push(userId);

    // Create notification if liked someone else's post
    if (post.author._id !== userId) {
      const actor = store.users.find(u => u._id === userId);
      if (actor) {
        store.notifications.unshift({
          _id: `notif_${Date.now()}`,
          type: 'like',
          actor: {
            _id: actor._id,
            handle: actor.handle,
            name: actor.name,
            avatar: actor.avatar
          },
          post: { _id: post._id, content: post.content },
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  return { post, hasLiked: !hasLiked };
};

export const addCommentToPost = (postId: string, userId: string, content: string) => {
  const store = getStore();
  const post = store.posts.find(p => p._id === postId);
  if (!post) return null;

  const actor = store.users.find(u => u._id === userId) || store.users[0];

  const newComment: Comment = {
    _id: `comm_${Date.now()}`,
    postId,
    author: {
      _id: actor._id,
      handle: actor.handle,
      name: actor.name,
      avatar: actor.avatar,
      isVerified: actor.isVerified
    },
    content,
    likes: [],
    createdAt: new Date().toISOString()
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);
  post.commentsCount = post.comments.length;

  // Add notification
  if (post.author._id !== userId) {
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      type: 'comment',
      actor: {
        _id: actor._id,
        handle: actor.handle,
        name: actor.name,
        avatar: actor.avatar
      },
      post: { _id: post._id, content: post.content },
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return { post, comment: newComment };
};

export const voteOnPoll = (postId: string, optionId: string, userId: string) => {
  const store = getStore();
  const post = store.posts.find(p => p._id === postId);
  if (!post || !post.poll) return null;

  if (post.poll.votedUserIds[userId]) {
    return post; // Already voted
  }

  const option = post.poll.options.find(opt => opt.id === optionId);
  if (option) {
    option.votes += 1;
    post.poll.totalVotes += 1;
    post.poll.votedUserIds[userId] = optionId;
  }

  return post;
};

export const toggleBookmark = (postId: string, userId: string) => {
  const store = getStore();
  const user = store.users.find(u => u._id === userId);
  const post = store.posts.find(p => p._id === postId);
  if (!user || !post) return null;

  const isBookmarked = user.bookmarks.includes(postId);
  if (isBookmarked) {
    user.bookmarks = user.bookmarks.filter(id => id !== postId);
    post.bookmarks = post.bookmarks.filter(id => id !== userId);
  } else {
    user.bookmarks.push(postId);
    post.bookmarks.push(userId);
  }

  return { isBookmarked: !isBookmarked, bookmarks: user.bookmarks };
};

// ================= USER OPERATIONS =================
export const getAllUsers = () => getStore().users;

export const getUserById = (id: string) => getStore().users.find(u => u._id === id);

export const getUserByHandle = (handle: string) =>
  getStore().users.find(u => u.handle.toLowerCase() === handle.toLowerCase().replace('@', ''));

export const toggleFollow = (currentUserId: string, targetUserId: string) => {
  const store = getStore();
  const currentUser = store.users.find(u => u._id === currentUserId);
  const targetUser = store.users.find(u => u._id === targetUserId);

  if (!currentUser || !targetUser) return null;

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter(id => id !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);
    targetUser.followersCount = Math.max(0, targetUser.followersCount - 1);
  } else {
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);
    currentUser.followingCount += 1;
    targetUser.followersCount += 1;

    // Follow notification
    store.notifications.unshift({
      _id: `notif_${Date.now()}`,
      type: 'follow',
      actor: {
        _id: currentUser._id,
        handle: currentUser.handle,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  return { isFollowing: !isFollowing, currentUser, targetUser };
};

// ================= NOTIFICATIONS =================
export const getNotifications = (userId: string) => {
  return getStore().notifications;
};

export const markNotificationsAsRead = () => {
  getStore().notifications.forEach(n => { n.read = true; });
  return true;
};
