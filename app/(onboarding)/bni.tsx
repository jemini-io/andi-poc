// Component for BNI (Business Network International) connection screen
import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';
import { usePartnersStore } from '../../store/partners';
import { navigate } from '../navigation';

export default function BNIConnect() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 576;
  const isMediumScreen = width >= 576 && width < 768;
  const isLargeScreen = width >= 768;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [connecting, setConnecting] = useState(false);
  const updateProfile = useProfileStore(state => state.updateProfile);
  const profile = useProfileStore(state => state.profile);
  
  const partners = usePartnersStore(state => state.partners);
  const setPartners = usePartnersStore(state => state.setPartners);

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
    
    // Make sure the application knows the user is connected to BNI
    console.log('BNI connection successful - navigating to BNI Members page');
    console.log('Updated profile:', useProfileStore.getState().profile);
    
    // Navigate to BNI Members page which will handle importing members
    setConnecting(false);
    navigate.push('BNI_MEMBERS');
  };

  const handleCancel = () => {
    // Return to dashboard without making any changes
    navigate.replace('DASHBOARD');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
        {/* Animated container for content */}
        <Animated.View style={[
          styles.animatedContent,
          isLargeScreen && styles.animatedContentLarge,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Image
            source={require('./BNI_Logo.png')}
            style={[styles.image, isSmallScreen && styles.imageSmall]}
            resizeMode="contain"
          />
          
          <Text variant={isSmallScreen ? "headlineMedium" : "displaySmall"} style={styles.title}>Connect BNI</Text>
          <Text variant="titleMedium" style={styles.description}>
            Connecting to BNI allows Andi to import members of your chapter as your Referral Partners. 
            Andi will match posts from your feed to your partners.
          </Text>

          {/* Login form */}
          <Surface style={[styles.form, isLargeScreen && styles.formLarge]} elevation={2}>
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
            <View style={[styles.buttonsContainer, isSmallScreen && styles.buttonsContainerSmall]}>
              <Button
                mode="contained"
                onPress={handleConnect}
                style={[styles.button, isSmallScreen && styles.buttonSmall]}
                labelStyle={[styles.buttonText, isSmallScreen && styles.buttonTextSmall]}
                loading={connecting}
                disabled={!username || !password || connecting}
              >
                Connect BNI
              </Button>
              
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={[styles.cancelButton, isSmallScreen && styles.buttonSmall]}
                disabled={connecting}
              >
                Cancel
              </Button>
            </View>
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
  contentLarge: {
    paddingHorizontal: 40,
  },
  animatedContent: {
    // Added to wrap the animated content
  },
  animatedContentLarge: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  image: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 30,
  },
  imageSmall: {
    width: 150,
    height: 75,
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
    paddingHorizontal: 10,
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
  buttonsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  buttonsContainerSmall: {
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    marginTop: 10,
  },
  buttonSmall: {
    paddingVertical: 4,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextSmall: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 0,
  },
});