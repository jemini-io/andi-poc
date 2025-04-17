import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator } from 'react-native-paper';
import { usePartnersStore, Partner } from '../../store/partners';
import { useProfileStore } from '../../store/profile';
import { navigate } from '../navigation';
import { Ionicons } from '@expo/vector-icons';

// BNI Members data
const BNI_MEMBERS: Partner[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    business: 'Evergreen Financial Planning',
    slogan: 'Building Wealth, Securing Futures',
    category: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
    email: 'sarah@example.com',
    phone: '(425) 555-0123',
    website: 'www.evergreenfinancial.com',
    social: {
      linkedin: 'linkedin.com/in/sarahchen',
      facebook: 'facebook.com/evergreenfinancial'
    }
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    business: 'Elite Real Estate Group',
    slogan: 'Your Dream Home Awaits',
    category: 'Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
    email: 'michael@example.com',
    phone: '(425) 555-0234',
    website: 'www.eliterealestate.com',
    social: {
      linkedin: 'linkedin.com/in/michaelrodriguez',
      instagram: 'instagram.com/eliterealestate'
    }
  },
  {
    id: '3',
    name: 'David Kim',
    business: 'Northwest Tax Solutions',
    slogan: 'Maximize Your Returns',
    category: 'Tax Accountant',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    email: 'david@example.com',
    phone: '(425) 555-0345',
    website: 'www.nwtaxsolutions.com',
    social: {
      linkedin: 'linkedin.com/in/davidkim'
    }
  },
  {
    id: '4',
    name: 'Emily Zhang',
    business: 'Digital Marketing Pro',
    slogan: 'Growing Your Online Presence',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    email: 'emily@example.com',
    phone: '(425) 555-0456',
    website: 'www.digitalmarketingpro.com',
    social: {
      linkedin: 'linkedin.com/in/emilyzhang',
      instagram: 'instagram.com/digitalmarketingpro'
    }
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    business: 'Creative Design Studio',
    slogan: 'Bringing Your Vision to Life',
    category: 'Graphic Designer',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80',
    email: 'lisa@example.com',
    phone: '(425) 555-0567',
    website: 'www.creativedesignstudio.com',
    social: {
      linkedin: 'linkedin.com/in/lisamartinez',
      instagram: 'instagram.com/creativedesignstudio'
    }
  }
];

export default function BniMembers() {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 576;
  const isMediumScreen = width >= 576 && width < 768;
  const isLargeScreen = width >= 768;
  
  const [loadedMembers, setLoadedMembers] = useState<Partner[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { setPartners, partners } = usePartnersStore();
  const profile = useProfileStore(state => state.profile);
  const updateProfile = useProfileStore(state => state.updateProfile);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the loading animation
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
    
    // Also start content fade in animation
    Animated.timing(contentFadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    
    // Load BNI members with a delay for visual effect
    setTimeout(() => {
      loadContent();
    }, 500);
  }, []);

  const loadContent = () => {
    // Set loading state
    setLoadingMembers(true);
    
    // Create a counter for a simulated loading experience
    let membersLoaded = 0;
    const memberInterval = setInterval(() => {
      membersLoaded += Math.floor(Math.random() * 3) + 1;
      if (membersLoaded >= BNI_MEMBERS.length) {
        membersLoaded = BNI_MEMBERS.length;
      }
      
      setLoadedMembers(BNI_MEMBERS.slice(0, membersLoaded));
      
      if (membersLoaded >= BNI_MEMBERS.length) {
        clearInterval(memberInterval);
        setLoadingMembers(false);
        
        // Define BNI members with available flag explicitly set
        const availableMembers = BNI_MEMBERS.map(member => ({
          ...member,
          available: true // Force available to be true
        }));
        
        // Get existing manually added partners to preserve them
        const existingPartners = partners.filter(partner => partner.id.includes('_'));
        
        // Create new combined partners array - BNI members first, then manual partners
        const combinedPartners = [...availableMembers, ...existingPartners];
        
        // Debug info before setting partners
        console.log('BNI Members page - Setting partners:');
        console.log('Available BNI members:', availableMembers.length);
        console.log('Existing manual partners:', existingPartners.length);
        console.log('Combined partners:', combinedPartners.length);
        console.log('Sample BNI member:', availableMembers[0]);
        
        // Combine BNI partners with existing manually added partners
        setPartners(combinedPartners);
      }
    }, 800);
  };

  const handleGoToDashboard = () => {
    // BNI sign-in should fill in all profile data
    updateProfile({
      name: profile.name || 'BNI Member',
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80',
      phone: profile.phone || '(425) 555-1234',
      business: 'BNI Member Business', // Always set this to indicate BNI connection
      website: profile.website || 'www.bnimember.com',
      social: {
        ...profile.social,
        linkedin: profile.social?.linkedin || 'linkedin.com/in/bnimember',
      }
    });
    
    // Make sure partners are properly set with available: true
    if (loadedMembers.length > 0) {
      const availableMembers = loadedMembers.map(member => ({
        ...member,
        available: true // Ensure available flag is set to true
      }));
      
      // Get existing manually added partners
      const existingPartners = partners.filter(partner => partner.id.includes('_'));
      
      // Create new combined partners array
      const combinedPartners = [...availableMembers, ...existingPartners];
      
      // Debug final partners before navigating to dashboard
      console.log('BNI Members page - Navigating with partners:');
      console.log('BNI member count:', availableMembers.length);
      console.log('Manual partner count:', existingPartners.length);
      console.log('Total partner count:', combinedPartners.length);
      
      // Save the combined partners to the store to ensure all are available
      setPartners(combinedPartners);
    } else {
      console.warn('No BNI members loaded before navigating to dashboard');
    }
    
    // Navigate to dashboard
    navigate.replace('DASHBOARD');
  };

  // Define responsive styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: isSmallScreen ? 12 : 20,
    },
    title: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: isSmallScreen ? 6 : 10,
      fontSize: isSmallScreen ? 24 : 28,
    },
    subtitle: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: isSmallScreen ? 12 : 20,
      opacity: 0.9,
      fontSize: isSmallScreen ? 14 : 16,
      paddingHorizontal: isSmallScreen ? 8 : 0,
    },
    section: {
      marginBottom: isSmallScreen ? 12 : 20,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      flex: 1,
      minHeight: isSmallScreen ? 200 : 300,
      maxHeight: isLargeScreen ? 600 : isSmallScreen ? 400 : 500,
    },
    sectionTitle: {
      padding: isSmallScreen ? 12 : 16,
      paddingBottom: isSmallScreen ? 6 : 8,
    },
    scrollContent: {
      padding: isSmallScreen ? 4 : 8,
    },
    memberCard: {
      marginBottom: isSmallScreen ? 6 : 8,
      marginHorizontal: isSmallScreen ? 4 : 8,
    },
    memberCardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: isSmallScreen ? 8 : 12,
      padding: isSmallScreen ? 8 : 12,
    },
    memberImage: {
      width: isSmallScreen ? 45 : 60,
      height: isSmallScreen ? 45 : 60,
      borderRadius: isSmallScreen ? 22.5 : 30,
    },
    memberInfo: {
      flex: 1,
    },
    name: {
      fontSize: isSmallScreen ? 15 : 18,
      fontWeight: '600',
    },
    business: {
      opacity: 0.8,
      marginTop: 2,
      fontSize: isSmallScreen ? 13 : 15,
    },
    slogan: {
      opacity: 0.6,
      marginTop: 2,
      fontStyle: 'italic',
      fontSize: isSmallScreen ? 12 : 14,
    },
    category: {
      marginTop: 4,
      fontSize: isSmallScreen ? 12 : 14,
    },
    categoryBadge: {
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    categoryText: {
      color: '#1565C0',
      fontSize: isSmallScreen ? 12 : 14,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    loadingText: {
      marginLeft: 10,
      color: theme.colors.onSurface,
    },
    footer: {
      padding: 16,
      backgroundColor: 'transparent',
    },
    buttonContainer: {
      paddingHorizontal: isSmallScreen ? 12 : 20,
      paddingBottom: isSmallScreen ? 12 : 20,
      paddingTop: isSmallScreen ? 8 : 12,
    },
    goToDashboardButton: {
      paddingVertical: isSmallScreen ? 4 : 6,
    },
    buttonText: {
      fontSize: isSmallScreen ? 16 : 18,
      fontWeight: '600',
    },
    animatedContent: {
      flex: 1,
    },
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    successText: {
      marginLeft: 10,
      color: theme.colors.onSurface,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Animated.View style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Image
            source={require('./BNI_Logo.png')}
            style={[
              { 
                width: isSmallScreen ? 150 : 200, 
                height: isSmallScreen ? 75 : 100,
                alignSelf: 'center',
                marginBottom: isSmallScreen ? 20 : 30
              }
            ]}
            resizeMode="contain"
          />
          
          <Text variant={isSmallScreen ? "titleLarge" : "headlineLarge"} style={styles.title}>
            Your BNI Chapter
          </Text>
          <Text variant={isSmallScreen ? "bodyMedium" : "titleMedium"} style={styles.subtitle}>
            Andi has imported these members to your trusted referral network
          </Text>

          {/* BNI Members Section */}
          <Surface style={styles.section} elevation={0}>
            <Text variant="titleLarge" style={styles.sectionTitle}>BNI Chapter Members</Text>
            
            <Animated.View style={{ opacity: contentFadeAnim, flex: 1 }}>
              <ScrollView style={styles.scrollContent}>
                {loadedMembers.map((member) => member && member.image ? (
                  <Card key={member.id} style={styles.memberCard} mode="elevated">
                    <Card.Content style={styles.memberCardContent}>
                      <Image source={{ uri: member.image }} style={styles.memberImage} />
                      <View style={styles.memberInfo}>
                        <Text variant="titleMedium">{member.name}</Text>
                        <Text variant="bodyMedium" style={styles.business}>{member.business}</Text>
                        <Text variant="bodySmall" style={styles.slogan}>{member.slogan}</Text>
                        <Surface style={styles.categoryBadge} elevation={0}>
                          <Text variant="labelSmall" style={styles.categoryText}>{member.category}</Text>
                        </Surface>
                      </View>
                    </Card.Content>
                  </Card>
                ) : null)}
                
                {loadingMembers && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.loadingText}>
                      Importing members ({loadedMembers.length}/{BNI_MEMBERS.length})
                    </Text>
                  </View>
                )}
                
                {!loadingMembers && loadedMembers.length === BNI_MEMBERS.length && (
                  <View style={styles.successContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    <Text variant="bodyMedium" style={styles.successText}>
                      Successfully imported {loadedMembers.length} referral partners!
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </Surface>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleGoToDashboard}
              style={styles.goToDashboardButton}
              labelStyle={styles.buttonText}
              disabled={loadingMembers}
            >
              Go to Dashboard
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
} 