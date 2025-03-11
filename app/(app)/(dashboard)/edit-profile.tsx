import { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, Text, TextInput, Button, Surface, SegmentedButtons, Card, IconButton } from 'react-native-paper';
import { useProfileStore } from '../../../store/profile';
import NavigationBar from '../components/NavigationBar';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'edit' | 'connect';

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
}

const PLATFORMS: SocialPlatform[] = [
  { id: 'nextdoor', name: 'NextDoor', icon: 'home', color: '#00B636', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0A66C2', connected: false },
  { id: 'reddit', name: 'Reddit', icon: 'logo-reddit', color: '#FF4500', connected: false },
  { id: 'slack', name: 'Slack', icon: 'logo-slack', color: '#4A154B', connected: false },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366', connected: false },
  { id: 'discord', name: 'Discord', icon: 'logo-discord', color: '#5865F2', connected: false },
];

export default function EditProfile() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  const [selectedTab, setSelectedTab] = useState<Tab>('edit');
  const profile = useProfileStore(state => state.profile);
  const updateProfile = useProfileStore(state => state.updateProfile);

  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    business: profile.business,
    website: profile.website || '',
    facebook: profile.social?.facebook || '',
    instagram: profile.social?.instagram || '',
  });

  const handleSave = () => {
    updateProfile({
      ...profile,
      ...formData,
      social: {
        facebook: formData.facebook,
        instagram: formData.instagram,
      },
    });
    router.back();
  };

  const renderEditContent = () => (
    <ScrollView style={styles.scrollContent}>
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
        <TextInput
          mode="outlined"
          label="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Phone"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Business Name"
          value={formData.business}
          onChangeText={(text) => setFormData({ ...formData, business: text })}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Website"
          value={formData.website}
          onChangeText={(text) => setFormData({ ...formData, website: text })}
          style={styles.input}
        />
      </Surface>

      <Surface style={styles.section} elevation={0}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Social Media</Text>
        <TextInput
          mode="outlined"
          label="Facebook Profile"
          value={formData.facebook}
          onChangeText={(text) => setFormData({ ...formData, facebook: text })}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Instagram Profile"
          value={formData.instagram}
          onChangeText={(text) => setFormData({ ...formData, instagram: text })}
          style={styles.input}
        />
      </Surface>
    </ScrollView>
  );

  const renderConnectContent = () => (
    <ScrollView style={styles.scrollContent}>
      <Surface style={styles.section} elevation={0}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Connect More Accounts</Text>
        <Text variant="bodyMedium" style={styles.description}>
          Connect additional platforms to expand your referral network
        </Text>
        
        <View style={styles.platformsGrid}>
          {PLATFORMS.map((platform) => (
            <Card key={platform.id} style={styles.platformCard}>
              <Card.Content style={styles.platformContent}>
                <View style={[styles.iconContainer, { backgroundColor: platform.color }]}>
                  <Ionicons name={platform.icon as any} size={24} color="white" />
                </View>
                <Text variant="titleMedium" style={styles.platformName}>{platform.name}</Text>
                <Button
                  mode="outlined"
                  onPress={() => {}}
                  style={styles.connectButton}
                >
                  Connect
                </Button>
              </Card.Content>
            </Card>
          ))}
        </View>
      </Surface>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <View style={styles.content}>
        <Surface style={styles.header} elevation={1}>
          <Text variant="headlineSmall">Edit Profile</Text>
          <SegmentedButtons
            value={selectedTab}
            onValueChange={value => setSelectedTab(value as Tab)}
            buttons={[
              { value: 'edit', label: 'Edit Information' },
              { value: 'connect', label: 'Connect Accounts' },
            ]}
            style={styles.tabs}
          />
        </Surface>

        <View style={[
          styles.mainContent,
          isLargeScreen && styles.mainContentLarge
        ]}>
          {selectedTab === 'edit' ? renderEditContent() : renderConnectContent()}
        </View>

        <Surface style={styles.footer} elevation={1}>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
          >
            Save Changes
          </Button>
        </Surface>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  tabs: {
    width: '100%',
    maxWidth: 400,
  },
  mainContent: {
    flex: 1,
  },
  mainContentLarge: {
    flexDirection: 'row',
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    margin: 12,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  platformCard: {
    width: 160,
  },
  platformContent: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformName: {
    textAlign: 'center',
  },
  connectButton: {
    width: '100%',
  },
  footer: {
    padding: 16,
    marginTop: 'auto',
  },
  button: {
    marginTop: 8,
  },
}); 