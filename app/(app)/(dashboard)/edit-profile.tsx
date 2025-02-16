import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { useProfileStore } from '../../../store/profile';
import NavigationBar from '../components/NavigationBar';

export default function EditProfile() {
  const theme = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const { profile, updateProfile } = useProfileStore();
  const { name, email, phone, avatar, business, website, social } = profile;

  const handleSubmit = async () => {
    if (!name || !email) return;

    setLoading(true);
    try {
      await updateProfile({ 
        name, 
        email, 
        phone, 
        avatar, 
        business, 
        website,
        social 
      });
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Edit Profile</Text>
        </Surface>

        <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            label="Name"
            value={name}
            onChangeText={(value) => updateProfile({ name: value })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Business Name"
            value={business}
            onChangeText={(value) => updateProfile({ business: value })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={(value) => updateProfile({ email: value })}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
          />

          <TextInput
            label="Phone"
            value={phone}
            onChangeText={(value) => updateProfile({ phone: value })}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Website"
            value={website}
            onChangeText={(value) => updateProfile({ website: value })}
            mode="outlined"
            style={styles.input}
            keyboardType="url"
          />

          <TextInput
            label="Avatar URL"
            value={avatar}
            onChangeText={(value) => updateProfile({ avatar: value })}
            mode="outlined"
            style={styles.input}
            placeholder="https://..."
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>Social Media</Text>

          <TextInput
            label="LinkedIn Profile"
            value={social?.linkedin}
            onChangeText={(value) => updateProfile({ 
              social: { ...social, linkedin: value } 
            })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Facebook Profile"
            value={social?.facebook}
            onChangeText={(value) => updateProfile({ 
              social: { ...social, facebook: value } 
            })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Instagram Profile"
            value={social?.instagram}
            onChangeText={(value) => updateProfile({ 
              social: { ...social, instagram: value } 
            })}
            mode="outlined"
            style={styles.input}
          />
        </Surface>

        <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading || !name || !email}
          >
            Update Profile
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 12,
  },
  form: {
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
  footer: {
    padding: 16,
    marginTop: 16,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  button: {
    marginTop: 8,
  },
}); 