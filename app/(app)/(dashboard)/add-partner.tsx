import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { usePartnersStore } from '../../../store/partners';
import NavigationBar from '../components/NavigationBar';

export default function AddPartner() {
  const theme = useTheme();
  const router = useRouter();
  const addPartner = usePartnersStore(state => state.addPartner);

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

  const handleSubmit = async () => {
    if (!name || !business || !category) return;

    setLoading(true);
    try {
      const partnerImage = image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80';
      
      await addPartner({
        id: Date.now().toString(),
        name,
        business,
        slogan,
        category,
        image: partnerImage,
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
      console.error('Failed to add partner:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Add Partner</Text>
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

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading || !name || !business || !category}
          >
            Add Partner
          </Button>
        </View>
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
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginTop: 8,
  },
}); 