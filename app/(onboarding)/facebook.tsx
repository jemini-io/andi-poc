import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '../../store/profile';
import { navigate } from '../navigation';

export default function FacebookConnect() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 576;
  const isMediumScreen = width >= 576 && width < 768;
  const isLargeScreen = width >= 768;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const updateProfile = useProfileStore(state => state.updateProfile);

  // Animation values using useRef
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Run animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleConnect = () => {
    if (username && password) {
      // Update profile with Facebook identity
      updateProfile({
        email: username,
        name: username.split('@')[0].replace(/\./g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase()),
        social: {
          facebook: `facebook.com/${username.split('@')[0]}`
        }
      });
      
      // Navigate to Facebook Groups selection page
      // The Referral Opportunities will be populated there after group selection
      navigate.replace('FACEBOOK_GROUPS');
    }
  };

  const handleCancel = () => {
    // Return to dashboard without changing anything
    navigate.replace('DASHBOARD');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
        <Animated.View style={[
          styles.animatedContent,
          isLargeScreen && styles.animatedContentLarge,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Image
            source={require('./fbicon.png')}
            style={[styles.image, isSmallScreen && styles.imageSmall]}
            resizeMode="contain"
          />
          
          <Text variant={isSmallScreen ? "headlineMedium" : "displaySmall"} style={styles.title}>Connect Facebook</Text>
          <Text variant="titleMedium" style={styles.description}>
            Connect your Facebook account to let Andi monitor your groups for referral opportunities.
          </Text>

          <Surface style={[styles.form, isLargeScreen && styles.formLarge]} elevation={2}>
            <TextInput
              mode="outlined"
              label="Facebook Email or Phone"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor="#1877F2"
              left={<TextInput.Icon icon="email" />}
            />
            <TextInput
              mode="outlined"
              label="Facebook Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor="#1877F2"
              left={<TextInput.Icon icon="lock" />}
            />
            <Button
              mode="contained"
              onPress={handleConnect}
              style={styles.button}
              buttonColor="#1877F2"
              disabled={!username || !password}
              contentStyle={styles.buttonContent}
              icon={({ size, color }) => (
                <Ionicons name="logo-facebook" size={size} color={color} />
              )}
            >
              Continue with Facebook
            </Button>

            <Button
              mode="outlined"
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </Surface>

          <Text variant="bodySmall" style={styles.privacyText}>
            By continuing, you agree to Facebook's Terms of Service and acknowledge their Privacy Policy.
          </Text>
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
    padding: 16,
    justifyContent: 'center',
  },
  contentLarge: {
    paddingHorizontal: 40,
  },
  animatedContent: {
    maxWidth: '100%',
  },
  animatedContentLarge: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
    alignSelf: 'center',
  },
  imageSmall: {
    width: 80,
    height: 80,
    marginBottom: 20,
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
  formLarge: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    flexDirection: 'row-reverse',
  },
  cancelButton: {
    marginTop: 12,
    borderColor: '#fff',
  },
  privacyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 20,
  },
});