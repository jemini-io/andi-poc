import { useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import SplashScreen from '../components/SplashScreen';

// This helps TypeScript recognize our routes
declare module "expo-router" {
  interface TypedRoutes {
    "/connect-sources": {};
    "/(app)/dashboard": {};
  }
}

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);

  if (!showSplash) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <SplashScreen onFadeComplete={() => setShowSplash(false)} />
    </View>
  );
}