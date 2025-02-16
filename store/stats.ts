import { create } from 'zustand';
import { usePostsStore } from './posts';

interface StatsState {
  referralsReceived: number;
  getReferralsGiven: () => number;
  getOpportunities: () => number;
  hasReferral: (postId: string) => boolean;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  referralsReceived: 5, // Hardcoded as per requirement
  getReferralsGiven: () => {
    const posts = usePostsStore.getState().posts;
    return posts.reduce((count, post) => {
      const hasReferral = post.comments_list?.some(comment => 
        comment.isReferral && comment.author === 'You'
      );
      return count + (hasReferral ? 1 : 0);
    }, 0);
  },
  getOpportunities: () => {
    const posts = usePostsStore.getState().posts;
    return posts.reduce((count, post) => {
      const hasReferral = post.comments_list?.some(comment => 
        comment.isReferral && comment.author === 'You'
      );
      return count + (hasReferral ? 0 : 1);
    }, 0);
  },
  hasReferral: (postId: string) => {
    const post = usePostsStore.getState().posts.find(p => p.id === postId);
    return post?.comments_list?.some(comment => 
      comment.isReferral && comment.author === 'You'
    ) ?? false;
  },
}));