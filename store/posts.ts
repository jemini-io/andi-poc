import { create } from 'zustand';
import { usePartnersStore } from './partners';

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isReferral?: boolean;
}

export interface ReferralOpportunity {
  id: string;
  source: 'facebook' | 'instagram' | 'linkedin' | 'nextdoor' | 'alignable';
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  matchedUserId?: string; // ID of the partner this opportunity matches with
  comments_list?: Comment[];
}

interface PostsState {
  posts: ReferralOpportunity[];
  draftMessage: string | null;
  setPosts: (posts: ReferralOpportunity[]) => void;
  addPost: (post: ReferralOpportunity) => void;
  updatePost: (id: string, post: Partial<ReferralOpportunity>) => void;
  removePost: (id: string) => void;
  getPostById: (id: string) => ReferralOpportunity | undefined;
  addComment: (postId: string, comment: Comment) => void;
  setDraftMessage: (message: string | null) => void;
}

// Helper to get random partner ID
const getRandomPartnerId = () => {
  const partners = usePartnersStore.getState().partners;
  const randomIndex = Math.floor(Math.random() * partners.length);
  return partners[randomIndex].id;
};

// Initial posts data
const INITIAL_POSTS: ReferralOpportunity[] = [
  {
    id: '1',
    source: 'facebook',
    content: "Looking for recommendations for a reliable financial advisor in the Bellevue area. Need help with retirement planning and investment strategies. Any suggestions would be greatly appreciated!",
    likes: 15,
    comments: 8,
    shares: 2,
    timestamp: '2h ago',
    matchedUserId: '1', // Sarah Chen (Financial Advisor)
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
    matchedUserId: '4', // David Thompson (Business Attorney)
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
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Mike Wilson',
        content: "We just had our kitchen done, I'll send you some details!",
        timestamp: '5h ago'
      }
    ]
  },
  {
    id: '4',
    source: 'instagram',
    content: "Looking for a skilled photographer in the Seattle area for our upcoming product launch event. Need someone who specializes in corporate events and product photography. Budget available for the right person!",
    likes: 56,
    comments: 15,
    shares: 4,
    timestamp: '8h ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Sarah Chen',
        content: "I have a great recommendation for you! They did our company's last event.",
        timestamp: '7h ago'
      }
    ]
  },
  {
    id: '5',
    source: 'linkedin',
    content: "Seeking recommendations for a digital marketing agency that specializes in social media management and content creation. Our small business is ready to expand our online presence.",
    likes: 34,
    comments: 18,
    shares: 6,
    timestamp: '12h ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Lisa Martinez',
        content: "Would love to discuss how we could help with your digital marketing needs!",
        timestamp: '10h ago'
      }
    ]
  },
  {
    id: '6',
    source: 'facebook',
    content: "Can anyone recommend a good dentist in the Kirkland area? Looking for someone who's great with anxious patients and offers modern dental services.",
    likes: 19,
    comments: 23,
    shares: 2,
    timestamp: '1d ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Emily Johnson',
        content: "I know an amazing dentist who specializes in anxious patients!",
        timestamp: '22h ago'
      }
    ]
  },
  {
    id: '7',
    source: 'linkedin',
    content: "Our tech company is looking for a reliable IT consulting firm in the greater Seattle area. Need help with cloud migration and security infrastructure. Any recommendations?",
    likes: 67,
    comments: 31,
    shares: 8,
    timestamp: '1d ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'David Thompson',
        content: "I can connect you with a great IT consulting firm we've worked with.",
        timestamp: '23h ago'
      }
    ]
  },
  {
    id: '8',
    source: 'instagram',
    content: "Looking for a talented interior designer who can help transform our new office space. Modern style, flexible budget, Bellevue area preferred. Portfolio review needed!",
    likes: 45,
    comments: 16,
    shares: 5,
    timestamp: '2d ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Michael Rodriguez',
        content: "I know just the designer for your project! They did our office last year.",
        timestamp: '1d ago'
      }
    ]
  },
  {
    id: '9',
    source: 'facebook',
    content: "Need recommendations for a reliable auto repair shop in Redmond. Looking for honest mechanics who specialize in European cars. Had some bad experiences recently.",
    likes: 23,
    comments: 19,
    shares: 3,
    timestamp: '2d ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Tom Anderson',
        content: "There's a great shop near Microsoft campus, very trustworthy!",
        timestamp: '1d ago'
      }
    ]
  },
  {
    id: '10',
    source: 'linkedin',
    content: "Seeking a skilled web developer for a 3-month contract project. Need expertise in React Native and TypeScript. Local to Seattle preferred but remote possible for the right candidate.",
    likes: 89,
    comments: 42,
    shares: 12,
    timestamp: '3d ago',
    matchedUserId: getRandomPartnerId(),
    comments_list: [
      {
        id: '1',
        author: 'Jennifer Park',
        content: "I know a great developer who might be perfect for this!",
        timestamp: '2d ago'
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