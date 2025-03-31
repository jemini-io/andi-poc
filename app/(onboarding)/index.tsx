import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';

export default function SignUp() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
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

  const handleSignUp = () => {
    // Begin updating the profile with the entered email
    if (email) {
      updateProfile({
        email: email,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/^(.)|\s+(.)/g, c => c.toUpperCase()),
      });
    }
    router.replace('/facebook');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Text variant="displayMedium" style={styles.title}>Welcome to Andi</Text>
          <Text variant="titleLarge" style={styles.subtitle}>Your AI-powered referral agent</Text>

          <Surface style={styles.form} elevation={2}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <Button
              mode="contained"
              onPress={handleSignUp}
              style={styles.button}
              labelStyle={styles.buttonText}
            >
              Get Started
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
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
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
});