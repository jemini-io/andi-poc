import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text } from 'react-native-paper';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFadeComplete: () => void;
}

export default function SplashScreen({ onFadeComplete }: SplashScreenProps) {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Start fade out after 2 seconds
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        onFadeComplete();
      });
    }, 2000);

    return () => clearTimeout(fadeOutTimer);
  }, []);

  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    logoContainer: {
      width: width * 0.4,
      height: width * 0.4,
      borderRadius: (width * 0.4) / 2,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      elevation: 4,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    logoText: {
      color: theme.colors.onPrimary,
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      textAlign: 'center',
    },
    titleContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: 48,
      fontFamily: 'Inter-Bold',
      color: theme.colors.primary,
      marginBottom: 8,
      letterSpacing: 0.5,
    },
    subtitle: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: theme.colors.onBackground,
      opacity: 0.7,
      letterSpacing: 0.2,
    },
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logoText}>A</Text>
      </Animated.View>
      
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>ANDI AI</Text>
        <Text style={styles.subtitle}>Your AI Referral Assistant</Text>
      </Animated.View>
    </Animated.View>
  );
} 