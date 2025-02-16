import { create } from 'zustand';

export interface ReceivedReferral {
  id: string;
  partnerId: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

const INITIAL_REFERRALS: ReceivedReferral[] = [
  {
    id: '1',
    partnerId: '2', // Michael Rodriguez
    date: '2024-03-15',
    status: 'pending',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '(206) 555-7890',
    notes: 'Looking for a new home in the Bellevue area',
  },
  {
    id: '2',
    partnerId: '1', // Sarah Chen
    date: '2024-03-14',
    status: 'accepted',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    notes: 'Interested in retirement planning',
  },
  {
    id: '3',
    partnerId: '3', // Jennifer Park
    date: '2024-03-13',
    status: 'declined',
    customerName: 'Mike Johnson',
    customerEmail: 'mike.j@email.com',
    customerPhone: '(425) 555-4321',
    notes: "Was looking for dental work but schedule didn't align",
  },
  {
    id: '4',
    partnerId: '5', // Lisa Martinez
    date: '2024-03-12',
    status: 'accepted',
    customerName: 'Sarah Brown',
    customerEmail: 'sarah.b@email.com',
    notes: 'Needs help with social media marketing',
  },
];

interface ReceivedReferralsState {
  referrals: ReceivedReferral[];
  getReferralById: (id: string) => ReceivedReferral | undefined;
  updateReferralStatus: (id: string, status: ReceivedReferral['status']) => void;
  getTotalReceived: () => number;
}

export const useReceivedReferralsStore = create<ReceivedReferralsState>((set, get) => ({
  referrals: INITIAL_REFERRALS,
  
  getReferralById: (id) => 
    get().referrals.find(ref => ref.id === id),
  
  updateReferralStatus: (id, status) => 
    set(state => ({
      referrals: state.referrals.map(ref =>
        ref.id === id ? { ...ref, status } : ref
      ),
    })),
    
  getTotalReceived: () => get().referrals.length,
})); 