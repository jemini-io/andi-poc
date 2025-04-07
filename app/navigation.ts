/**
 * Navigation helpers for type-safe routing
 */
import { router } from 'expo-router';

// Type-safe route paths
export const Routes = {
  // Root level
  ROOT: '/',
  EMAIL: '/email',
  ONBOARDING: '/onboarding',
  
  // Onboarding routes
  FACEBOOK: '/(onboarding)/facebook',
  BNI: '/(onboarding)/bni',
  FACEBOOK_GROUPS: '/(onboarding)/facebook-groups',
  BNI_MEMBERS: '/(onboarding)/bni-members',
  
  // App routes
  DASHBOARD: '/(app)/dashboard-v2',
  EDIT_PROFILE: '/(app)/edit-profile',
  RECEIVED_REFERRALS: '/(app)/received-referrals',
  OPPORTUNITIES: '/(app)/opportunities',
  ADD_PARTNER: '/(app)/add-partner',
  DETAILS: '/details', // This one takes an id parameter
} as const;

// Type for all route keys
export type RouteKey = keyof typeof Routes;

// Type for route values
export type RoutePath = typeof Routes[RouteKey];

// Type-safe navigation functions
export const navigate = {
  push: <T extends RouteKey>(
    route: T,
    params?: T extends 'DETAILS' ? { id: string } : undefined
  ) => {
    if (route === 'DETAILS' && params) {
      router.push(`${Routes[route]}?id=${(params as { id: string }).id}`);
    } else {
      router.push(Routes[route]);
    }
  },
  
  replace: <T extends RouteKey>(
    route: T,
    params?: T extends 'DETAILS' ? { id: string } : undefined
  ) => {
    if (route === 'DETAILS' && params) {
      router.replace(`${Routes[route]}?id=${(params as { id: string }).id}`);
    } else {
      router.replace(Routes[route]);
    }
  },
  
  back: () => router.back(),
}; 