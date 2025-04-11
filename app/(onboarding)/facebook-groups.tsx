import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator, Checkbox } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';
import { usePostsStore } from '../../store/posts';
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
  const isSmallScreen = width < 576;
  const isMediumScreen = width >= 576 && width < 768;
  const isLargeScreen = width >= 768;
  
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
    // Save selected groups to profile
    const selectedGroupIds = Array.from(selectedGroups);
    // Get the actual selected group objects
    const selectedGroupObjects = GROUPS.filter(group => selectedGroupIds.includes(group.id));
    
    // Update profile with selected Facebook groups and Facebook-specific info
    // But don't fill in other profile fields - they should remain empty
    updateProfile({
      // Add a Facebook-themed avatar if none exists yet
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80',
      social: {
        ...profile.social,
        facebook: profile.social?.facebook || `facebook.com/${profile.email?.split('@')[0]}`,
        facebookGroups: selectedGroupIds
      }
    });
    
    // Activate all Facebook posts for the Referral Opportunities tab
    // In a real app, this would fetch actual Facebook posts via API
    const posts = usePostsStore.getState().posts;
    const setPosts = usePostsStore.getState().setPosts;
    
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
    
    console.log(`Facebook groups selected: ${selectedGroupIds.length}`);
    
    // Navigate to dashboard
    navigate.replace('DASHBOARD');
  };

  const handleCancel = () => {
    // Return to dashboard without making any changes
    navigate.replace('DASHBOARD');
  };

  // Define responsive styles conditionally based on screen size
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: isSmallScreen ? 12 : 20,
    },
    fbImage: {
      width: isSmallScreen ? 60 : 80,
      height: isSmallScreen ? 60 : 80,
      marginBottom: isSmallScreen ? 12 : 20,
      alignSelf: 'center',
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
    },
    section: {
      marginBottom: isSmallScreen ? 12 : 20,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      flex: 1,
      minHeight: isSmallScreen ? 150 : 200, 
      maxHeight: isLargeScreen ? 550 : isSmallScreen ? 350 : 450,
    },
    sectionTitle: {
      padding: isSmallScreen ? 12 : 16,
      paddingBottom: isSmallScreen ? 6 : 8,
    },
    scrollContent: {
      padding: isSmallScreen ? 4 : 8,
    },
    groupCard: {
      marginBottom: isSmallScreen ? 6 : 8,
      marginHorizontal: isSmallScreen ? 4 : 8,
    },
    selectedCard: {
      backgroundColor: '#E3F2FD',
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    groupCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: isSmallScreen ? 8 : 12,
      padding: isSmallScreen ? 8 : 12,
    },
    groupImage: {
      width: isSmallScreen ? 40 : 50,
      height: isSmallScreen ? 40 : 50,
      borderRadius: isSmallScreen ? 20 : 25,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      fontWeight: '500',
      fontSize: isSmallScreen ? 14 : 16,
    },
    groupMembers: {
      opacity: 0.7,
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
    footerButtons: {
      flexDirection: isSmallScreen ? 'column' : 'row',
      justifyContent: 'space-between',
      marginTop: isSmallScreen ? 8 : 16,
      gap: isSmallScreen ? 8 : 12,
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Animated.View style={[
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }
        ]}>
          <Image
            source={require('./fbicon.png')}
            style={styles.fbImage}
            resizeMode="contain"
          />
          
          <Text variant={isSmallScreen ? "titleLarge" : "headlineLarge"} style={styles.title}>
            Your Facebook Groups
          </Text>
          <Text variant={isSmallScreen ? "bodyMedium" : "titleMedium"} style={styles.subtitle}>
            Select groups for Andi to monitor for referral opportunities
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

      <View style={styles.footerButtons}>
        <Button mode="outlined" onPress={handleCancel} style={isSmallScreen ? {width: '100%'} : {flex: 1}}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          disabled={selectedGroups.size === 0}
          style={isSmallScreen ? {width: '100%'} : {flex: 1}}
        >
          Continue
        </Button>
      </View>
    </LinearGradient>
  );
} 