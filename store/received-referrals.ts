import { create } from 'zustand';

export interface ReceivedReferral {
  id: string;
  partnerId: string;
  date: string;
  referralOpportunityId: string;
  referralPostId: string;
}

const INITIAL_REFERRALS: ReceivedReferral[] = [
  {
    id: '1',
    partnerId: '2', // Michael Rodriguez
    date: '2024-03-15',
    referralOpportunityId: '1',
    referralPostId: '1',
  },
  {
    id: '2',
    partnerId: '1', // Sarah Chen
    date: '2024-03-14',
    referralOpportunityId: '2',
    referralPostId: '2',
  },
  {
    id: '3',
    partnerId: '3', // Jennifer Park
    date: '2024-03-13',
    referralOpportunityId: '3',
    referralPostId: '3',
  },
  {
    id: '4',
    partnerId: '5', // Lisa Martinez
    date: '2024-03-12',
    referralOpportunityId: '4',
    referralPostId: '4',
  },
];

interface ReceivedReferralsState {
  referrals: ReceivedReferral[];
  getReferralById: (id: string) => ReceivedReferral | undefined;
  getTotalReceived: () => number;
}

export const useReceivedReferralsStore = create<ReceivedReferralsState>((set, get) => ({
  referrals: INITIAL_REFERRALS,
  
  getReferralById: (id) => 
    get().referrals.find(ref => ref.id === id),

  getTotalReceived: () => get().referrals.length,
})); 