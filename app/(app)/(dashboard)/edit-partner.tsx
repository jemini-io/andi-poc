import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { usePartnersStore } from '../../../store/partners';
import NavigationBar from '../components/NavigationBar';

export default function EditPartner() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPartnerById, updatePartner, removePartner } = usePartnersStore();

  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [slogan, setSlogan] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [social, setSocial] = useState({
    linkedin: '',
    facebook: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const partner = getPartnerById(id);
    if (partner) {
      setName(partner.name);
      setBusiness(partner.business);
      setSlogan(partner.slogan || '');
      setCategory(partner.category);
      setImage(partner.image);
      setPhone(partner.phone || '');
      setWebsite(partner.website || '');
      setSocial({
        linkedin: partner.social?.linkedin || '',
        facebook: partner.social?.facebook || '',
        instagram: partner.social?.instagram || '',
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!name || !business || !category) return;

    setLoading(true);
    try {
      await updatePartner({
        id,
        name,
        business,
        slogan,
        category,
        image,
        phone: phone || undefined,
        website: website || undefined,
        social: {
          ...(social.linkedin && { linkedin: social.linkedin }),
          ...(social.facebook && { facebook: social.facebook }),
          ...(social.instagram && { instagram: social.instagram }),
        },
      });
      
      router.back();
    } catch (error) {
      console.error('Failed to update partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    removePartner(id);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Edit Partner</Text>
        </Surface>

        <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            label="Partner Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            required
          />

          <TextInput
            label="Business Name"
            value={business}
            onChangeText={setBusiness}
            mode="outlined"
            style={styles.input}
            required
          />

          <TextInput
            label="Business Category"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
            required
          />

          <TextInput
            label="Business Slogan"
            value={slogan}
            onChangeText={setSlogan}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Profile Image URL"
            value={image}
            onChangeText={setImage}
            mode="outlined"
            style={styles.input}
            placeholder="https://..."
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>

          <TextInput
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            label="Website"
            value={website}
            onChangeText={setWebsite}
            mode="outlined"
            style={styles.input}
            keyboardType="url"
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>Social Media</Text>

          <TextInput
            label="LinkedIn Profile"
            value={social.linkedin}
            onChangeText={(text) => setSocial(prev => ({ ...prev, linkedin: text }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Facebook Profile"
            value={social.facebook}
            onChangeText={(text) => setSocial(prev => ({ ...prev, facebook: text }))}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Instagram Profile"
            value={social.instagram}
            onChangeText={(text) => setSocial(prev => ({ ...prev, instagram: text }))}
            mode="outlined"
            style={styles.input}
          />
        </Surface>

        <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.footerButtons}>
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}
              textColor={theme.colors.error}
              disabled={loading}
            >
              Remove Partner
            </Button>
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[styles.button, styles.updateButton]}
              loading={loading}
              disabled={loading || !name || !business || !category}
            >
              Update Partner
            </Button>
          </View>
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
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  deleteButton: {
    borderColor: '#FF0000', // Using direct color value instead of theme
  },
  updateButton: {
    marginLeft: 8,
  },
}); 