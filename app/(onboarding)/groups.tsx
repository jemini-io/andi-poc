import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, Surface, Card, Button, ActivityIndicator } from 'react-native-paper';

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

export default function GroupsSelection() {
  const theme = useTheme();
  const [loadedGroups, setLoadedGroups] = useState<Group[]>([]);
  const [importing, setImporting] = useState(true);

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
        setImporting(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    router.replace('/bni');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <Surface style={styles.header} elevation={0}>
        <Text variant="headlineLarge" style={styles.title}>Your Facebook Groups</Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          Andi will monitor these groups for referral opportunities
        </Text>
      </Surface>

      <Surface style={styles.groupsContainer} elevation={0}>
        <ScrollView contentContainerStyle={styles.groupsContent}>
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
        </ScrollView>
      </Surface>

      <Surface style={styles.footer} elevation={0}>
        {importing ? (
          <View style={styles.importingStatus}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text variant="bodyLarge" style={styles.importingText}>
              Importing groups ({loadedGroups.length}/{GROUPS.length})...
            </Text>
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            labelStyle={styles.continueButtonText}
          >
            Let's go!
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
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.9,
  },
  groupsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  groupsContent: {
    padding: 15,
  },
  groupCard: {
    marginBottom: 12,
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
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  importingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  importingText: {
    color: '#fff',
    marginLeft: 10,
    opacity: 0.9,
  },
  continueButton: {
    paddingVertical: 6,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});