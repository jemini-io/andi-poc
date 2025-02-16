import { create } from 'zustand';

export interface Partner {
  id: string;
  name: string;
  business: string;
  slogan: string;
  category: string;
  image: string;
  phone?: string;
  website?: string;
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

// Initial partners data
const INITIAL_PARTNERS: Partner[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    business: 'Evergreen Financial Planning',
    slogan: 'Building Wealth, Securing Futures',
    category: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    phone: '(425) 555-0123',
    website: 'www.evergreenfinancial.com',
    social: {
      linkedin: 'linkedin.com/in/sarahchen',
      facebook: 'facebook.com/evergreenfinancial'
    }
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    business: 'Elite Real Estate Group',
    slogan: 'Your Dream Home Awaits',
    category: 'Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    phone: '(206) 555-0456',
    website: 'www.eliterealestate.com',
    social: {
      linkedin: 'linkedin.com/in/michaelrodriguez',
      facebook: 'facebook.com/eliterealestate'
    }
  },
  {
    id: '3',
    name: 'Jennifer Park',
    business: 'Bright Smile Dental',
    slogan: 'Creating Beautiful Smiles Daily',
    category: 'Dentist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    phone: '(425) 555-0789',
    website: 'www.brightsmile.com',
    social: {
      instagram: 'instagram.com/brightsmile',
      facebook: 'facebook.com/brightsmile'
    }
  },
  {
    id: '4',
    name: 'David Thompson',
    business: 'Thompson Law Firm',
    slogan: 'Justice Served with Excellence',
    category: 'Business Attorney',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
    phone: '(206) 555-1234',
    website: 'www.thompsonlaw.com',
    social: {
      linkedin: 'linkedin.com/in/davidthompson',
      facebook: 'facebook.com/thompsonlaw'
    }
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    business: 'Digital Marketing Solutions',
    slogan: 'Growing Your Digital Presence',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    phone: '(425) 555-5678',
    website: 'www.digitalmktg.com',
    social: {
      instagram: 'instagram.com/digitalmktg',
      linkedin: 'linkedin.com/in/lisamartinez'
    }
  }
];

const MAX_PARTNERS = 10;

interface PartnersState {
  partners: Partner[];
  maxPartners: number;
  setPartners: (partners: Partner[]) => void;
  addPartner: (partner: Partner) => Promise<void>;
  removePartner: (id: string) => void;
  getPartnerById: (id: string) => Partner | undefined;
  clearPartners: () => void;
  hasAvailableSlots: () => boolean;
  getUsedSlots: () => number;
  updatePartner: (partner: Partner) => void;
}

export const usePartnersStore = create<PartnersState>((set, get) => ({
  partners: INITIAL_PARTNERS,
  maxPartners: MAX_PARTNERS,
  setPartners: (partners) => {
    if (partners.length <= MAX_PARTNERS) {
      set({ partners });
    }
  },
  addPartner: async (partner: Partner) => {
    const { partners, maxPartners } = get();
    
    if (partners.length >= maxPartners) {
      throw new Error('Maximum number of partners reached');
    }

    set(state => ({
      partners: [...state.partners, partner]
    }));
  },
  removePartner: (id) => set((state) => ({ 
    partners: state.partners.filter(p => p.id !== id) 
  })),
  getPartnerById: (id) => get().partners.find(p => p.id === id),
  clearPartners: () => set({ partners: [] }),
  hasAvailableSlots: () => get().partners.length < MAX_PARTNERS,
  getUsedSlots: () => get().partners.length,
  updatePartner: (partner: Partner) => {
    set(state => ({
      partners: state.partners.map(p => 
        p.id === partner.id ? partner : p
      )
    }));
  },
}));