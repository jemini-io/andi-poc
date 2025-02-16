import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { usePartnersStore } from '../../store/partners';
import { useTheme, Text, Surface, TextInput, Button, IconButton } from 'react-native-paper';

export default function AddPartner() {
  const theme = useTheme();
  const addPartner = usePartnersStore(state => state.addPartner);
  const hasAvailableSlots = usePartnersStore(state => state.hasAvailableSlots);

  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [category, setCategory] = useState('');
  const [slogan, setSlogan] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!hasAvailableSlots()) {
      return;
    }

    setIsSubmitting(true);

    const newPartner = {
      id: Date.now().toString(),
      name,
      business,
      category,
      slogan,
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      phone: phone || undefined,
      website: website || undefined,
      social: {
        ...(linkedin && { linkedin }),
        ...(facebook && { facebook }),
        ...(instagram && { instagram }),
      },
    };

    addPartner(newPartner);
    router.back();
  };

  const isValid = name && business && category;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>Add Referral Partner</Text>
      </Surface>

      <ScrollView style={styles.content}>
        <Surface style={styles.form} elevation={1}>
          <TextInput
            mode="outlined"
            label="Partner Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Business Name"
            value={business}
            onChangeText={setBusiness}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Category"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Business Slogan"
            value={slogan}
            onChangeText={setSlogan}
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>Contact Information</Text>
          
          <TextInput
            mode="outlined"
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Website"
            value={website}
            onChangeText={setWebsite}
            keyboardType="url"
            style={styles.input}
          />

          <Text variant="titleMedium" style={styles.sectionTitle}>Social Media</Text>
          
          <TextInput
            mode="outlined"
            label="LinkedIn Profile"
            value={linkedin}
            onChangeText={setLinkedin}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Facebook Profile"
            value={facebook}
            onChangeText={setFacebook}
            style={styles.input}
          />
          <TextInput
            mode="outlined"
            label="Instagram Profile"
            value={instagram}
            onChangeText={setInstagram}
            style={styles.input}
          />
        </Surface>
      </ScrollView>

      <Surface style={styles.footer} elevation={1}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          style={styles.submitButton}
        >
          Add Partner
        </Button>
      </Surface>
    </View>
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
  form: {
    margin: 12,
    padding: 16,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    paddingVertical: 6,
  },
});