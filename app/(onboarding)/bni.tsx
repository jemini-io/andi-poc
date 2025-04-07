// Component for BNI (Business Network International) connection screen
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';
import { navigate } from '../navigation';

export default function BNIConnect() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const updateProfile = useProfileStore(state => state.updateProfile);
  const profile = useProfileStore(state => state.profile);
  const [connecting, setConnecting] = useState(false);

  // Animation values for fade and slide effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run parallel animations when component mounts
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConnect = async () => {
    setConnecting(true);

    // Simulating API connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Using a simplified approach to update the profile
    updateProfile({
      business: 'BNI Member Business',
      website: 'www.bnimember.com',
      phone: '(425) 555-6789'
    });

    setConnecting(false);
    navigate.push('BNI_MEMBERS');
  };

  const handleSkip = () => {
    // Skip BNI but go directly to BNI Members page
    navigate.replace('BNI_MEMBERS');
  };

  const handleSkipToApp = () => {
    // Skip all remaining onboarding and go straight to the app
    navigate.replace('DASHBOARD');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Animated container for content */}
        <Animated.View style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Image
            source={require('./BNI_Logo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text variant="displaySmall" style={styles.title}>Connect BNI</Text>
          <Text variant="titleMedium" style={styles.description}>
            Connecting to BNI allows Andi to import members of your chapter as your Referral Partners. 
            Andi will match posts from your feed to your partners.
          </Text>

          {/* Login form */}
          <Surface style={styles.form} elevation={2}>
            <TextInput
              mode="outlined"
              label="BNI Connect Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              mode="outlined"
              label="BNI Connect Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <Button
              mode="contained"
              onPress={handleConnect}
              style={styles.button}
              labelStyle={styles.buttonText}
              disabled={!username || !password}
            >
              Connect BNI
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleSkip}
              style={styles.skipButton}
            >
              Skip BNI Connect
            </Button>

            <Button
              mode="text"
              onPress={handleSkipToApp}
              style={styles.skipToAppButton}
            >
              Skip to Dashboard
            </Button>
          </Surface>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  animatedContent: {
    // Added to wrap the animated content
  },
  image: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
    lineHeight: 24,
  },
  form: {
    padding: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 6,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 12,
  },
  skipToAppButton: {
    marginTop: 8,
  },
});