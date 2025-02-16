import { create } from 'zustand';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  business: string;
  website?: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface ProfileState {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => void;
}

const INITIAL_PROFILE: Profile = {
  name: 'Pat',
  email: 'pat@example.com',
  phone: '123-456-7890',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  business: 'Premium Goods and Services',
  website: 'www.premiumgoodsandservices.com',
  social: {
    linkedin: 'www.linkedin.com/in/pat',
    facebook: 'www.facebook.com/pat',
    instagram: 'www.instagram.com/pat',
  },
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: INITIAL_PROFILE,
  
  updateProfile: (updates) => 
    set((state) => ({
      profile: { 
        ...state.profile, 
        ...updates,
        social: {
          ...state.profile.social,
          ...(updates.social || {}),
        },
      }
    })),
})); 