import { create } from 'zustand';

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isReferral?: boolean;
}

export interface Post {
  id: string;
  source: 'facebook' | 'instagram' | 'linkedin';
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  comments_list?: Comment[];
}

interface PostsState {
  posts: Post[];
  draftMessage: string | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  removePost: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
  addComment: (postId: string, comment: Comment) => void;
  setDraftMessage: (message: string | null) => void;
}

// Initial posts data
const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    source: 'facebook',
    content: "Looking for recommendations for a reliable financial advisor in the Bellevue area. Need help with retirement planning and investment strategies. Any suggestions would be greatly appreciated!",
    likes: 15,
    comments: 8,
    shares: 2,
    timestamp: '2h ago',
    comments_list: [
      {
        id: '1',
        author: 'John Smith',
        content: "I've been working with someone great, I'll DM you their details!",
        timestamp: '1h ago'
      }
    ]
  },
  {
    id: '2',
    source: 'linkedin',
    content: "Our startup is growing and we need legal advice for contract negotiations and IP protection. Can anyone recommend a good business attorney in Seattle?",
    likes: 42,
    comments: 12,
    shares: 5,
    timestamp: '4h ago',
    comments_list: [
      {
        id: '1',
        author: 'Jane Doe',
        content: "I know a great attorney who specializes in startups.",
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: '3',
    source: 'facebook',
    content: "Hi neighbors! We're looking to renovate our kitchen and need recommendations for reliable contractors. Budget is flexible for the right team. Any suggestions?",
    likes: 28,
    comments: 21,
    shares: 3,
    timestamp: '6h ago',
    comments_list: [
      {
        id: '1',
        author: 'Mike Wilson',
        content: "We just had our kitchen done, I'll send you some details!",
        timestamp: '5h ago'
      }
    ]
  }
];

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: INITIAL_POSTS,
  draftMessage: null,
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ 
    posts: [...state.posts, post] 
  })),
  updatePost: (id, updatedFields) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === id ? { ...post, ...updatedFields } : post
    )
  })),
  removePost: (id) => set((state) => ({ 
    posts: state.posts.filter(p => p.id !== id) 
  })),
  getPostById: (id) => get().posts.find(p => p.id === id),
  addComment: (postId, comment) => set((state) => ({
    posts: state.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1,
          comments_list: [...(post.comments_list || []), comment]
        };
      }
      return post;
    })
  })),
  setDraftMessage: (message) => set({ draftMessage: message }),
}));