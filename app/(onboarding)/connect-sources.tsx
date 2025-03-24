import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator, Checkbox } from 'react-native-paper';
import { usePartnersStore, Partner } from '../../store/partners';

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

export default function ConnectSources() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  
  // Facebook Groups state
  const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  
  // BNI Members state
  const [loadedMembers, setLoadedMembers] = useState<Partner[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const { setPartners, clearPartners } = usePartnersStore();

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
      
      // Start loading groups and members
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

    // Load BNI members gradually
    let currentMember = 0;
    const memberInterval = setInterval(() => {
      if (currentMember < BNI_MEMBERS.length) {
        setLoadedMembers(prev => [...prev, BNI_MEMBERS[currentMember]]);
        currentMember++;
      } else {
        clearInterval(memberInterval);
        setLoadingMembers(false);
        setPartners(BNI_MEMBERS);
      }
    }, 800);
  };

  const handleGoToDashboard = () => {
    router.replace('/(app)/dashboard');
  };

  const allLoaded = !loadingGroups && !loadingMembers;

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
      maxHeight: 300, // Limit maximum height
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
    memberCard: {
      marginBottom: 8,
      marginHorizontal: 8,
    },
    memberCardContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    memberImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },
    memberInfo: {
      flex: 1,
    },
    business: {
      opacity: 0.8,
      marginTop: 2,
    },
    slogan: {
      opacity: 0.6,
      marginTop: 2,
      fontStyle: 'italic',
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
    dashboardButton: {
      paddingVertical: 6,
    },
    dashboardButtonText: {
      fontSize: 18,
      fontWeight: '600',
    },
    animatedContent: {
      flex: 1,
    },
    sectionsContainer: {
      flex: 1,
      flexDirection: 'column',
      gap: 20,
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
          <Text variant="displaySmall" style={styles.title}>Connecting Sources</Text>
          <Text variant="titleMedium" style={styles.subtitle}>
            Importing your groups and network...
          </Text>

          <View style={styles.sectionsContainer}>
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
                </ScrollView>
              </Animated.View>
            </Surface>
          </View>
        </Animated.View>
      </ScrollView>

      <Surface style={styles.footer} elevation={0}>
        <Button
          mode="contained"
          onPress={handleGoToDashboard}
          style={styles.dashboardButton}
          labelStyle={styles.dashboardButtonText}
          disabled={!allLoaded || selectedGroups.size === 0}
        >
          {allLoaded 
            ? `Monitor ${selectedGroups.size === 1 ? 'this Group' : `${selectedGroups.size} Groups`}` 
            : "Loading..."}
        </Button>
      </Surface>
    </LinearGradient>
  );
} 