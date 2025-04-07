import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator, Checkbox } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';
import { navigate } from '../navigation';

// Facebook Groups data
interface Group {
  id: string;
  name: string;
  members: number;
  image: string;
}

const GROUPS: Group[] = [
  {
    id: '1',
    name: 'Bellevue Entrepreneurs Network',
    members: 2834,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80'
  },
  {
    id: '2',
    name: 'Seattle Tech Professionals',
    members: 4521,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80'
  },
  {
    id: '3',
    name: 'PNW Home Improvement DIY',
    members: 1892,
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&q=80'
  },
  {
    id: '4',
    name: 'Kirkland Small Business Owners',
    members: 1245,
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80'
  },
  {
    id: '5',
    name: 'Eastside Real Estate Investors',
    members: 3156,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80'
  }
];

export default function FacebookGroups() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  // Facebook Groups state
  const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const profile = useProfileStore(state => state.profile);
  const updateProfile = useProfileStore(state => state.updateProfile);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;

  // Add state for selected groups
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // First animation: Slide in the sections
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
    ]).start(() => {
      // After sections slide in, start loading content with fade
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        delay: 200, // Small delay before content starts appearing
      }).start();
      
      // Start loading groups
      loadContent();
    });
  }, []);

  const loadContent = () => {
    // Load groups gradually
    let currentGroup = 0;
    const groupInterval = setInterval(() => {
      if (currentGroup < GROUPS.length) {
        setLoadedGroups(prev => [...prev, GROUPS[currentGroup]]);
        currentGroup++;
      } else {
        clearInterval(groupInterval);
        setLoadingGroups(false);
      }
    }, 800);
  };

  const handleContinue = () => {
    // Save selected groups - store in localStorage or session since Profile type doesn't have facebookGroups
    const selectedGroupIds = Array.from(selectedGroups);
    // Get the actual selected group objects
    const selectedGroupObjects = GROUPS.filter(group => selectedGroupIds.includes(group.id));
    
    // Just update basic profile info
    updateProfile({
      ...profile
    });
    
    // Instead of storing in profile, we can handle this differently in a real app
    // For example by storing in localStorage or a different store
    try {
      localStorage.setItem('selectedFacebookGroups', JSON.stringify(selectedGroupObjects));
    } catch (e) {
      console.log('Unable to store selected groups');
    }
    
    // Navigate to dashboard directly instead of BNI Members
    navigate.replace('DASHBOARD');
  };

  const handleSkip = () => {
    // Skip to dashboard directly
    navigate.replace('DASHBOARD');
  };

  const handleSkipToDashboard = () => {
    // Skip to dashboard directly
    navigate.replace('DASHBOARD');
  };

  // Define responsive styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    title: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
    },
    subtitle: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 20,
      opacity: 0.9,
    },
    section: {
      marginBottom: 20,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      flex: 1,
      minHeight: 200, // Ensure minimum height
      maxHeight: 450, // Increased maximum height for better viewing
    },
    sectionTitle: {
      padding: 16,
      paddingBottom: 8,
    },
    scrollContent: {
      padding: 8,
    },
    groupCard: {
      marginBottom: 8,
      marginHorizontal: 8,
    },
    selectedCard: {
      backgroundColor: '#E3F2FD',
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    groupCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    groupImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontWeight: '500',
    },
    groupMembers: {
      opacity: 0.7,
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    continueButton: {
      flex: 1,
      marginRight: 8,
    },
    skipButton: {
      marginLeft: 8,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    animatedContent: {
      flex: 1,
    },
    skipToDashboardButton: {
      marginTop: 8,
      alignSelf: 'center',
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
          <Text variant="displaySmall" style={styles.title}>Facebook Groups</Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Select which groups you want Andi to monitor for opportunities
          </Text>

          {/* Facebook Groups Section */}
          <Surface style={styles.section} elevation={0}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Which Facebook Groups Should We Monitor?
            </Text>
            
            <Animated.View style={{ opacity: contentFadeAnim, flex: 1 }}>
              <ScrollView style={styles.scrollContent}>
                {loadedGroups.map((group) => (
                  <TouchableOpacity
                    key={group.id}
                    onPress={() => toggleGroupSelection(group.id)}
                    activeOpacity={0.7}
                  >
                    <Card 
                      style={[
                        styles.groupCard,
                        selectedGroups.has(group.id) && styles.selectedCard
                      ]} 
                      mode="elevated"
                    >
                      <Card.Content style={styles.groupCardContent}>
                        <Checkbox.Android
                          status={selectedGroups.has(group.id) ? 'checked' : 'unchecked'}
                          onPress={() => toggleGroupSelection(group.id)}
                        />
                        <Image source={{ uri: group.image }} style={styles.groupImage} />
                        <View style={styles.groupInfo}>
                          <Text variant="titleMedium" style={styles.groupName}>{group.name}</Text>
                          <Text variant="bodyMedium" style={styles.groupMembers}>
                            {group.members.toLocaleString()} members
                          </Text>
                        </View>
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                ))}
                
                {loadingGroups && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                    <Text variant="bodyMedium" style={styles.loadingText}>
                      Loading groups ({loadedGroups.length}/{GROUPS.length})
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </Surface>
        </Animated.View>
      </ScrollView>

      <Surface style={styles.footer} elevation={0}>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
          labelStyle={styles.buttonText}
          disabled={loadingGroups || selectedGroups.size === 0}
        >
          {loadingGroups 
            ? "Loading..." 
            : `Finish with ${selectedGroups.size} ${selectedGroups.size === 1 ? 'Group' : 'Groups'}`}
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleSkip}
          style={styles.skipButton}
          labelStyle={styles.buttonText}
        >
          Skip & Finish
        </Button>
      </Surface>
      
      <Button
        mode="text"
        onPress={handleSkipToDashboard}
        style={styles.skipToDashboardButton}
      >
        Skip to Dashboard
      </Button>
    </LinearGradient>
  );
} 