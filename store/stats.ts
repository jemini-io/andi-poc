import { create } from 'zustand';
import { usePostsStore } from './posts';

interface StatsState {
  referralsReceived: number;
  referralsGiven: number;
  getReferralsGiven: () => number;
  getOpportunities: () => number;
  hasReferral: (postId: string) => boolean;
  addGivenReferral: () => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  referralsReceived: 5, // Hardcoded as per requirement
  referralsGiven: 0, // Initial value
  getReferralsGiven: () => get().referralsGiven,
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

  addGivenReferral: () => {
    set(state => ({
      referralsGiven: state.referralsGiven + 1
    }));
  },
}));