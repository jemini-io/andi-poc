import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';
import { usePartnersStore } from '../../../store/partners';

export default function AddPartner() {
  const theme = useTheme();
  const router = useRouter();
  const addPartner = usePartnersStore(state => state.addPartner);

  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !business) return;

    setLoading(true);
    try {
      // Use a default image if none provided
      const partnerImage = image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80';
      
      await addPartner({
        id: Date.now().toString(), // Simple ID generation
        name,
        business,
        image: partnerImage,
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
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Add Partner</Text>
      </Surface>

      <ScrollView style={styles.content}>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Business"
          value={business}
          onChangeText={setBusiness}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Profile Image URL (optional)"
          value={image}
          onChangeText={setImage}
          mode="outlined"
          style={styles.input}
          placeholder="https://..."
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={loading}
          disabled={loading || !name || !business}
        >
          Add Partner
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 