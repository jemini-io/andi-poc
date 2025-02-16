import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator } from 'react-native-paper';
import { usePartnersStore, Partner } from '../../store/partners';

const BNI_MEMBERS: Partner[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    business: 'Evergreen Financial Planning',
    slogan: 'Building Wealth, Securing Futures',
    category: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
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
    phone: '(425) 555-5678',
    website: 'www.digitalmktg.com',
    social: {
      instagram: 'instagram.com/digitalmktg',
      linkedin: 'linkedin.com/in/lisamartinez'
    }
  }
];

export default function BNIImport() {
  const theme = useTheme();
  const [loadedMembers, setLoadedMembers] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [importComplete, setImportComplete] = useState(false);
  const { setPartners, clearPartners } = usePartnersStore();

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
        setLoading(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGoToDashboard = () => {
    router.replace('/(app)/dashboard');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineLarge" style={styles.title}>Importing BNI Members</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Adding your chapter members as referral partners
        </Text>
      </Surface>

      <Surface style={styles.content} elevation={0}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loadedMembers.map((member) => (
            <Card key={member.id} style={styles.memberCard} mode="elevated">
              <Card.Content style={styles.memberCardContent}>
                <Image
                  source={{ uri: member.image }}
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text variant="titleMedium">{member.name}</Text>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                    {member.business}
                  </Text>
                  <Text variant="bodyMedium" style={styles.slogan}>
                    {member.slogan}
                  </Text>
                  <Surface style={styles.categoryBadge} elevation={0}>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                      {member.category}
                    </Text>
                  </Surface>
                </View>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </Surface>

      <Surface style={styles.footer} elevation={0}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text variant="bodyLarge" style={styles.loadingText}>
              Importing members ({loadedMembers.length}/{BNI_MEMBERS.length})
            </Text>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={handleGoToDashboard}
            style={styles.dashboardButton}
            labelStyle={styles.dashboardButtonText}
          >
            Go to Dashboard
          </Button>
        )}
      </Surface>
    </LinearGradient>
  );
}

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
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    padding: 15,
  },
  memberCard: {
    marginBottom: 15,
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
  slogan: {
    fontStyle: 'italic',
    marginVertical: 4,
    opacity: 0.7,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    color: '#fff',
    marginLeft: 10,
    opacity: 0.9,
  },
  dashboardButton: {
    paddingVertical: 6,
  },
  dashboardButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});