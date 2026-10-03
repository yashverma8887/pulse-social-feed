export interface User {
  _id: string;
  handle: string;
  name: string;
  avatar: string;
  banner?: string;
  bio: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  bookmarks: string[];
  joinedDate: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  votedUserIds: Record<string, string>; // userId -> optionId
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface Comment {
  _id: string;
  postId: string;
  author: {
    _id: string;
    handle: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Post {
  _id: string;
  author: {
    _id: string;
    handle: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
    bio?: string;
  };
  content: string;
  mediaUrl?: string;
  tags?: string[];
  codeSnippet?: CodeSnippet;
  poll?: Poll;
  likes: string[];
  reposts: string[];
  bookmarks: string[];
  commentsCount: number;
  comments?: Comment[];
  createdAt: string;
}

export interface NotificationItem {
  _id: string;
  type: 'like' | 'comment' | 'repost' | 'follow';
  actor: {
    _id: string;
    handle: string;
    name: string;
    avatar: string;
  };
  post?: {
    _id: string;
    content: string;
  };
  read: boolean;
  createdAt: string;
}

export interface TrendingTopic {
  tag: string;
  category: string;
  postCount: string;
}
