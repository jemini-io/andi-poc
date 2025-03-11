import { Redirect } from 'expo-router';

// This helps TypeScript recognize our routes
declare module "expo-router" {
  interface TypedRoutes {
    "/connect-sources": {};
  }
}

export default function Index() {
  return <Redirect href="/onboarding" />;
}