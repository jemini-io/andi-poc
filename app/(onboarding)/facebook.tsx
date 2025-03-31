import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function FacebookConnect() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      router.replace('/bni');
    }
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
          <Image
            source={require('./fbicon.png')}
            style={styles.image}
            resizeMode="contain"
          />
          
          <Text variant="displaySmall" style={styles.title}>Connect Facebook</Text>
          <Text variant="titleMedium" style={styles.description}>
            Connect your Facebook account to let Andi monitor your groups for referral opportunities.
          </Text>

          <Surface style={styles.form} elevation={2}>
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
    padding: 20,
    justifyContent: 'center',
  },
  animatedContent: {
    // Added to wrap the animated content
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
    alignSelf: 'center',
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
    marginTop: 10,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
    flexDirection: 'row-reverse',
  },
  privacyText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 20,
  },
});