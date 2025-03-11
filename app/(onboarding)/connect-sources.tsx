import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator } from 'react-native-paper';
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
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    email: 'michael@example.com',
    phone: '(206) 555-0456',
    website: 'www.eliterealestate.com',
    social: {
      linkedin: 'linkedin.com/in/michaelrodriguez',
      facebook: 'facebook.com/eliterealestate'
    }
  },
  {
    id: '3',
    name: 'Jennifer Park',
    business: 'Bright Smile Dental',
    slogan: 'Creating Beautiful Smiles Daily',
    category: 'Dentist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
    email: 'jennifer@example.com',
    phone: '(425) 555-0789',
    website: 'www.brightsmile.com',
    social: {
      instagram: 'instagram.com/brightsmile',
      facebook: 'facebook.com/brightsmile'
    }
  },
  {
    id: '4',
    name: 'David Thompson',
    business: 'Thompson Law Firm',
    slogan: 'Justice Served with Excellence',
    category: 'Business Attorney',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80',
    email: 'david@example.com',
    phone: '(206) 555-1234',
    website: 'www.thompsonlaw.com',
    social: {
      linkedin: 'linkedin.com/in/davidthompson',
      facebook: 'facebook.com/thompsonlaw'
    }
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    business: 'Digital Marketing Solutions',
    slogan: 'Growing Your Digital Presence',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    email: 'lisa@example.com',
    phone: '(425) 555-5678',
    website: 'www.digitalmktg.com',
    social: {
      instagram: 'instagram.com/digitalmktg',
      linkedin: 'linkedin.com/in/lisamartinez'
    }
  }
];

export default function ConnectSources() {
  const theme = useTheme();
  const { width } = useWindowDimensions(); // Use this hook to get current dimensions
  const isLargeScreen = width > 768;
  
  // Facebook Groups state
  const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  
  // BNI Members state
  const [loadedMembers, setLoadedMembers] = useState<Partner[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [importComplete, setImportComplete] = useState(false);
  const { setPartners, clearPartners } = usePartnersStore();

  // Load Facebook Groups
  useEffect(() => {
    const groupsPerBatch = Math.ceil(GROUPS.length / 4);
    let currentBatch = 0;

    const interval = setInterval(() => {
      if (currentBatch < 4) {
        const start = currentBatch * groupsPerBatch;
        const end = Math.min(start + groupsPerBatch, GROUPS.length);
        setLoadedGroups(prev => [...prev, ...GROUPS.slice(start, end)]);
        currentBatch++;
      } else {
        clearInterval(interval);
        setLoadingGroups(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load BNI Members
  useEffect(() => {
    clearPartners();
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < BNI_MEMBERS.length) {
        setLoadedMembers(prev => {
          const newMembers = [...prev, BNI_MEMBERS[currentIndex]];
          if (currentIndex === BNI_MEMBERS.length - 1) {
            setPartners(newMembers);
            setImportComplete(true);
          }
          return newMembers;
        });
        currentIndex++;
      } else {
        clearInterval(interval);
        setLoadingMembers(false);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleGoToDashboard = () => {
    router.replace('/(app)/dashboard');
  };

  const allLoaded = !loadingGroups && !loadingMembers;

  // Define responsive styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 20,
      paddingTop: 60,
      backgroundColor: 'transparent',
    },
    title: {
      color: '#fff',
      textAlign: 'center',
      marginBottom: 10,
      fontSize: isLargeScreen ? 32 : 24, // Responsive font size
    },
    subtitle: {
      color: '#fff',
      textAlign: 'center',
      opacity: 0.9,
      marginBottom: 20,
    },
    contentContainer: {
      flex: 1,
      flexDirection: isLargeScreen ? 'row' : 'column', // Stack vertically on small screens
    },
    section: {
      flex: 1,
      margin: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 12,
      overflow: 'hidden',
      minHeight: isLargeScreen ? 0 : 300, // Ensure minimum height on mobile
    },
    sectionTitle: {
      color: '#fff',
      padding: 15,
      textAlign: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    scrollContent: {
      flex: 1,
      padding: 10,
    },
    groupCard: {
      marginBottom: 10,
    },
    groupCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    groupImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 12,
    },
    groupInfo: {
      flex: 1,
    },
    groupName: {
      marginBottom: 4,
    },
    groupMembers: {
      opacity: 0.7,
    },
    monitoringBadge: {
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    monitoringText: {
      color: '#1976D2',
    },
    memberCard: {
      marginBottom: 10,
    },
    memberCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    memberImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 15,
    },
    memberInfo: {
      flex: 1,
    },
    business: {
      marginVertical: 2,
    },
    slogan: {
      fontStyle: 'italic',
      marginBottom: 6,
      opacity: 0.7,
    },
    categoryBadge: {
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      alignSelf: 'flex-start',
    },
    categoryText: {
      color: '#1976D2',
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
      padding: 20,
      backgroundColor: 'transparent',
    },
    dashboardButton: {
      paddingVertical: 6,
    },
    dashboardButtonText: {
      fontSize: 18,
      fontWeight: '600',
    },
  });

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineLarge" style={styles.title}>Connect Your Networks</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Andi will monitor these sources for referral opportunities
        </Text>
      </Surface>

      <View style={styles.contentContainer}>
        {/* Facebook Groups Section */}
        <Surface style={styles.section} elevation={0}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Facebook Groups</Text>
          
          <ScrollView style={styles.scrollContent}>
            {loadedGroups.map((group) => (
              <Card key={group.id} style={styles.groupCard} mode="elevated">
                <Card.Content style={styles.groupCardContent}>
                  <Image source={{ uri: group.image }} style={styles.groupImage} />
                  <View style={styles.groupInfo}>
                    <Text variant="titleMedium" style={styles.groupName}>{group.name}</Text>
                    <Text variant="bodyMedium" style={styles.groupMembers}>
                      {group.members.toLocaleString()} members
                    </Text>
                  </View>
                  <Surface style={styles.monitoringBadge} elevation={0}>
                    <Text variant="labelSmall" style={styles.monitoringText}>Monitoring</Text>
                  </Surface>
                </Card.Content>
              </Card>
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
        </Surface>

        {/* BNI Members Section */}
        <Surface style={styles.section} elevation={0}>
          <Text variant="titleLarge" style={styles.sectionTitle}>BNI Chapter Members</Text>
          
          <ScrollView style={styles.scrollContent}>
            {loadedMembers.map((member) => (
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
            ))}
            
            {loadingMembers && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text variant="bodyMedium" style={styles.loadingText}>
                  Importing members ({loadedMembers.length}/{BNI_MEMBERS.length})
                </Text>
              </View>
            )}
          </ScrollView>
        </Surface>
      </View>

      <Surface style={styles.footer} elevation={0}>
        <Button
          mode="contained"
          onPress={handleGoToDashboard}
          style={styles.dashboardButton}
          labelStyle={styles.dashboardButtonText}
          disabled={!allLoaded}
        >
          {allLoaded ? "Go to Dashboard" : "Loading..."}
        </Button>
      </Surface>
    </LinearGradient>
  );
} 