import { User, Post, TrendingTopic, NotificationItem } from '@/types';

export const INITIAL_USERS: User[] = [
  {
    _id: 'usr_01',
    handle: 'yashv',
    name: 'Yash Verma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Full Stack Engineer & Open Source Enthusiast. Building next-gen reactive applications. ✨ Skill-Nexus Capstone 2026',
    location: 'San Francisco, CA',
    website: 'https://github.com/yashverma',
    isVerified: true,
    followersCount: 1420,
    followingCount: 380,
    followers: ['usr_02', 'usr_03', 'usr_04'],
    following: ['usr_02', 'usr_03'],
    bookmarks: ['post_01', 'post_03'],
    joinedDate: 'September 2023'
  },
  {
    _id: 'usr_02',
    handle: 'sarah_ai',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    bio: 'AI Researcher & Systems Architect @ Nexus Labs. Passionate about LLMs, Rust, and distributed systems.',
    location: 'Seattle, WA',
    website: 'https://sarahchen.dev',
    isVerified: true,
    followersCount: 8950,
    followingCount: 420,
    followers: ['usr_01', 'usr_03'],
    following: ['usr_01', 'usr_04'],
    bookmarks: [],
    joinedDate: 'January 2022'
  },
  {
    _id: 'usr_03',
    handle: 'alex_frontend',
    name: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    bio: 'Design Engineer crafting fluid UI experiences. Tailwind CSS, Framer Motion, and WebGL.',
    location: 'Austin, TX',
    website: 'https://alexrivera.design',
    isVerified: false,
    followersCount: 4120,
    followingCount: 510,
    followers: ['usr_01', 'usr_02'],
    following: ['usr_01'],
    bookmarks: [],
    joinedDate: 'March 2023'
  },
  {
    _id: 'usr_04',
    handle: 'marcus_cloud',
    name: 'Marcus Brody',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    bio: 'DevOps & Cloud Native Advocate. Kubernetes, Terraform, and Serverless architectures.',
    location: 'Berlin, Germany',
    website: 'https://marcus.cloud',
    isVerified: true,
    followersCount: 6300,
    followingCount: 290,
    followers: ['usr_01'],
    following: ['usr_02'],
    bookmarks: [],
    joinedDate: 'June 2021'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    _id: 'post_01',
    author: {
      _id: 'usr_02',
      handle: 'sarah_ai',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    },
    content: 'Just deployed our autonomous agent pipeline with streaming responses and edge execution! The speed improvements over traditional REST endpoints are staggering. 🚀 What is your preferred state management for real-time web apps?',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    tags: ['Nextjs14', 'React19', 'AIEngineering', 'WebDev'],
    poll: {
      question: 'Which real-time architecture do you use most for production web feeds?',
      options: [
        { id: 'opt_1', text: 'Server-Sent Events (SSE)', votes: 84 },
        { id: 'opt_2', text: 'WebSockets / Socket.io', votes: 142 },
        { id: 'opt_3', text: 'Optimistic Polling with SWR', votes: 46 }
      ],
      totalVotes: 272,
      votedUserIds: { 'usr_01': 'opt_2' }
    },
    likes: ['usr_01', 'usr_03', 'usr_04'],
    reposts: ['usr_01'],
    bookmarks: ['usr_01'],
    commentsCount: 3,
    comments: [
      {
        _id: 'comm_01',
        postId: 'post_01',
        author: {
          _id: 'usr_01',
          handle: 'yashv',
          name: 'Yash Verma',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          isVerified: true
        },
        content: 'WebSockets combined with optimistic UI mutations gives that instant, zero-latency feel! Awesome milestone Sarah.',
        likes: ['usr_02'],
        createdAt: '2024-03-05T14:32:00Z'
      },
      {
        _id: 'comm_02',
        postId: 'post_01',
        author: {
          _id: 'usr_03',
          handle: 'alex_frontend',
          name: 'Alex Rivera',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isVerified: false
        },
        content: 'The edge execution latency is incredible. Would love to see the benchmark data!',
        likes: [],
        createdAt: '2024-03-05T15:10:00Z'
      }
    ],
    createdAt: '2024-03-05T14:00:00Z'
  },
  {
    _id: 'post_02',
    author: {
      _id: 'usr_03',
      handle: 'alex_frontend',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      isVerified: false
    },
    content: 'Clean helper function for handling debounce with immediate execution flags in React components. Simple, robust, and zero external dependencies: 💻 #WebDev #TypeScript',
    codeSnippet: {
      language: 'typescript',
      code: `export function useDebounce<T>(value: T, delayMs: number = 300): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => setDebouncedValue(value), delayMs);\n    return () => clearTimeout(handler);\n  }, [value, delayMs]);\n\n  return debouncedValue;\n}`
    },
    tags: ['TypeScript', 'ReactHooks', 'CleanCode'],
    likes: ['usr_01', 'usr_02'],
    reposts: ['usr_02'],
    bookmarks: [],
    commentsCount: 1,
    comments: [
      {
        _id: 'comm_03',
        postId: 'post_02',
        author: {
          _id: 'usr_04',
          handle: 'marcus_cloud',
          name: 'Marcus Brody',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          isVerified: true
        },
        content: 'Always keep this in my starter boilerplate. Beautiful snippet!',
        likes: ['usr_03'],
        createdAt: '2024-03-04T18:20:00Z'
      }
    ],
    createdAt: '2024-03-04T17:45:00Z'
  },
  {
    _id: 'post_03',
    author: {
      _id: 'usr_04',
      handle: 'marcus_cloud',
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      isVerified: true
    },
    content: 'Morning setup from the Berlin lab! ☕️ Setting up multi-region Kubernetes clusters with zero-downtime rolling updates. Have a productive week everyone!',
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    tags: ['DevOps', 'Workspace', 'Kubernetes'],
    likes: ['usr_01', 'usr_03'],
    reposts: [],
    bookmarks: ['usr_01'],
    commentsCount: 0,
    comments: [],
    createdAt: '2024-03-03T09:15:00Z'
  }
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { tag: '#Nextjs14', category: 'Technology • Trending', postCount: '24.5K posts' },
  { tag: '#React19', category: 'Web Development • Trending', postCount: '18.2K posts' },
  { tag: '#AIEngineering', category: 'Artificial Intelligence', postCount: '45.1K posts' },
  { tag: '#SkillNexus', category: 'Community • Trending', postCount: '8.9K posts' },
  { tag: '#TailwindCSS', category: 'Design Systems', postCount: '12.4K posts' },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: 'notif_01',
    type: 'like',
    actor: {
      _id: 'usr_02',
      handle: 'sarah_ai',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
    },
    post: {
      _id: 'post_01',
      content: 'WebSockets combined with optimistic UI mutations gives that instant, zero-latency feel!'
    },
    read: false,
    createdAt: '2024-03-05T14:35:00Z'
  },
  {
    _id: 'notif_02',
    type: 'follow',
    actor: {
      _id: 'usr_03',
      handle: 'alex_frontend',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    read: true,
    createdAt: '2024-03-04T12:00:00Z'
  }
];
