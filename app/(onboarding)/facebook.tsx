import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useProfileStore } from '../../store/profile';
import { usePostsStore } from '../../store/posts';
import { navigate } from '../navigation';

export default function FacebookConnect() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const updateProfile = useProfileStore(state => state.updateProfile);
  const posts = usePostsStore(state => state.posts);
  const setPosts = usePostsStore(state => state.setPosts);

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
      
      // Activate all Facebook posts for the Referral Opportunities tab
      // In a real app, this would fetch actual Facebook posts via API
      if (posts) {
        // Mark all Facebook posts as available
        const updatedPosts = posts.map(post => {
          if (post.source === 'facebook') {
            return {
              ...post,
              available: true // Explicitly set to true for Facebook posts
            };
          }
          return post;
        });
        
        // Save the updated posts to the store
        setPosts(updatedPosts);
        
        console.log('Facebook connected! Enabled', updatedPosts.filter(p => p.available === true).length, 'posts.');
      }
      
      // Navigate to Facebook Groups selection page instead of dashboard
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