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
  name: 'Andi',
  email: 'andi@example.com',
  phone: '',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  business: 'Andi\'s Referral Network',
  website: '',
  social: {
    linkedin: '',
    facebook: '',
    instagram: '',
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