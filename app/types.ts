/**
 * Type definitions for app-wide usage
 */

// Define all the app routes for type-safe navigation
export type AppRoutes = {
  // Root level
  '/': undefined;
  '/email': undefined;
  '/onboarding': undefined;
  
  // Onboarding routes
  '/(onboarding)/facebook': undefined;
  '/(onboarding)/bni': undefined;
  '/(onboarding)/facebook-groups': undefined;
  '/(onboarding)/bni-members': undefined;
  
  // App routes
  '/(app)/dashboard-v2': undefined;
  '/(app)/edit-profile': undefined;
  '/(app)/received-referrals': undefined;
  '/(app)/opportunities': undefined;
  '/(app)/add-partner': undefined;
  '/details': { id: string };
};

// Type-safe version of the route strings
export type AppRoutePath = keyof AppRoutes;

// Declaration merging with expo-router types
declare module 'expo-router' {
  interface RouteParams extends AppRoutes {}
} 