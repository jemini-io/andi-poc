import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="facebook" />
      <Stack.Screen name="groups" />
      <Stack.Screen name="bni" />
      <Stack.Screen name="bni-import" />
    </Stack>
  );
}