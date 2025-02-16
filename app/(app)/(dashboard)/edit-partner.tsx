import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme, Text, Surface, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePartnersStore } from '../../../store/partners';

export default function PartnerProfile() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const partner = usePartnersStore(state => state.getPartnerById(id));

  if (!partner) {
    return (
      <Surface style={styles.container}>
        <Text variant="headlineMedium">Partner not found</Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>Partner Profile</Text>
      </Surface>

      <ScrollView style={styles.content}>
        <Surface style={[styles.profileHeader, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.avatarContainer}>
            <Surface style={styles.avatar} elevation={2}>
              <Ionicons name="person" size={40} color={theme.colors.onSurfaceVariant} />
            </Surface>
          </View>
          <Text variant="headlineMedium" style={styles.name}>{partner.name}</Text>
          <Text variant="titleMedium" style={styles.business}>{partner.business}</Text>
          <Surface style={styles.categoryBadge} elevation={0}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
              {partner.category}
            </Text>
          </Surface>
        </Surface>

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyLarge" style={styles.infoText}>{partner.email}</Text>
          </View>

          {partner.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={styles.infoText}>{partner.phone}</Text>
            </View>
          )}

          {partner.website && (
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={styles.infoText}>{partner.website}</Text>
            </View>
          )}
        </Surface>

        {partner.social && Object.keys(partner.social).length > 0 && (
          <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Social Media</Text>
            
            {partner.social.linkedin && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-linkedin" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyLarge" style={styles.infoText}>{partner.social.linkedin}</Text>
              </View>
            )}

            {partner.social.facebook && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-facebook" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyLarge" style={styles.infoText}>{partner.social.facebook}</Text>
              </View>
            )}

            {partner.social.instagram && (
              <View style={styles.infoRow}>
                <Ionicons name="logo-instagram" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyLarge" style={styles.infoText}>{partner.social.instagram}</Text>
              </View>
            )}
          </Surface>
        )}

        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>About</Text>
          <Text variant="bodyLarge" style={styles.slogan}>{partner.slogan}</Text>
        </Surface>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginBottom: 4,
  },
  business: {
    marginBottom: 12,
    color: '#666',
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  section: {
    marginBottom: 12,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    color: '#666',
  },
  slogan: {
    color: '#666',
    fontStyle: 'italic',
  },
}); 