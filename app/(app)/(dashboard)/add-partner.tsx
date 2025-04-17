import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Image, Platform } from 'react-native';
import { useTheme, Text, Searchbar, Button, Surface, List, Divider, ActivityIndicator, TextInput, Chip } from 'react-native-paper';
import { usePartnersStore } from '../../../store/partners';
import NavigationBar from '../components/NavigationBar';
import { router } from 'expo-router';

interface Suggestion {
  id: string;
  email: string;
  name: string;
  business: string;
}

// Common categories for partners
const COMMON_CATEGORIES = [
  'Financial Advisor',
  'Real Estate Agent',
  'Tax Accountant',
  'Digital Marketing',
  'Graphic Designer',
  'Business Attorney',
  'Web Developer',
  'Insurance Agent',
  'Mortgage Broker',
  'Interior Designer',
  'Other'
];

// Random profile images to choose from
const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
];

export default function AddPartner() {
  const theme = useTheme();
  const addPartner = usePartnersStore(state => state.addPartner);
  const partners = usePartnersStore(state => state.partners);
  const hasAvailableSlots = usePartnersStore(state => state.hasAvailableSlots);

  const [showSearchSection, setShowSearchSection] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [slogan, setSlogan] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState(PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)]);
  
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [page, setPage] = useState(1); // 1 = email, 2 = details

  useEffect(() => {
    if (email.length > 0 && showSearchSection) {
      const filtered = partners
        .filter(p => 
          p.email.toLowerCase().includes(email.toLowerCase()) ||
          p.name.toLowerCase().includes(email.toLowerCase()) ||
          p.business.toLowerCase().includes(email.toLowerCase())
        )
        .map(p => ({
          id: p.id,
          email: p.email,
          name: p.name,
          business: p.business,
        }));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [email, partners, showSearchSection]);

  const handleContinue = () => {
    // Move to details page
    setShowSearchSection(false);
    setPage(2);
    
    // Try to extract name from email
    if (!name && email) {
      const emailName = email.split('@')[0];
      // Convert john.doe or john_doe to John Doe
      const formattedName = emailName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
      setName(formattedName);
    }
  };

  const handleSubmit = async () => {
    if (!email || !hasAvailableSlots()) return;

    setLoading(true);
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await addPartner({
        id: uniqueId,
        email,
        name: name || email.split('@')[0],
        business: business || 'Business',
        slogan: slogan || 'Partner Slogan',
        category: category || 'Other',
        image,
        phone,
        website,
        available: true
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      console.error('Failed to add partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setEmail(suggestion.email);
    setName(suggestion.name);
    setBusiness(suggestion.business);
    setShowSuggestions(false);
  };

  const handleSelectCategory = (selectedCategory: string) => {
    setCategory(selectedCategory);
  };

  const isExistingEmail = partners.some(p => p.email.toLowerCase() === email.toLowerCase());
  const isFormValid = email && name && business && category;

  const renderEmailSection = () => (
    <>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Add Partner</Text>
      </Surface>

      <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="bodyMedium" style={styles.description}>
          Search for an existing partner or enter a new email address to add a partner.
        </Text>
        
        <Searchbar
          placeholder="Search or enter email"
          onChangeText={setEmail}
          value={email}
          style={styles.searchbar}
          autoCapitalize="none"
          editable={!loading && !showSuccess}
        />

        {showSuggestions && suggestions.length > 0 && (
          <Surface style={styles.suggestions} elevation={2}>
            <FlatList
              data={suggestions}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={Divider}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name || item.email}
                  description={item.business}
                  onPress={() => handleSelectSuggestion(item)}
                />
              )}
            />
          </Surface>
        )}

        {email && !isExistingEmail && !showSuccess && (
          <Text variant="bodyMedium" style={styles.inviteMessage}>
            Let's add details for {email} to your partner network.
          </Text>
        )}
      </Surface>

      <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.button}
          disabled={!email || isExistingEmail}
        >
          {isExistingEmail ? 'Already a Partner' : 'Continue'}
        </Button>
      </Surface>
    </>
  );

  const renderDetailsSection = () => (
    <>
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Partner Details</Text>
      </Surface>

      <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={styles.profilePreview}>
          <Image source={{ uri: image }} style={styles.profileImage} />
          <Text variant="bodySmall" style={styles.imageNote}>
            Profile picture will be randomly assigned
          </Text>
        </View>

        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Business"
          value={business}
          onChangeText={setBusiness}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Slogan"
          value={slogan}
          onChangeText={setSlogan}
          style={styles.input}
          mode="outlined"
          placeholder="e.g. Building Wealth, Securing Futures"
        />

        <Text variant="bodyMedium" style={styles.sectionLabel}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={Platform.OS === 'web'}
          contentContainerStyle={styles.categoriesContainer}
        >
          {COMMON_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => handleSelectCategory(cat)}
              style={[
                styles.categoryChip,
                category === cat && { backgroundColor: theme.colors.primaryContainer }
              ]}
              showSelectedCheck={false}
            >
              {cat}
            </Chip>
          ))}
        </ScrollView>

        <TextInput
          label="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          mode="outlined"
          placeholder="e.g. (425) 555-0123"
          keyboardType="phone-pad"
        />

        <TextInput
          label="Website (optional)"
          value={website}
          onChangeText={setWebsite}
          style={styles.input}
          mode="outlined"
          placeholder="e.g. www.example.com"
          keyboardType="url"
          autoCapitalize="none"
        />

        {showSuccess && (
          <View style={styles.successMessage}>
            <Text variant="bodyMedium" style={styles.successText}>
              Partner added successfully!
            </Text>
            <ActivityIndicator size="small" />
          </View>
        )}
      </Surface>

      <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => {
              setShowSearchSection(true);
              setPage(1);
            }}
            style={[styles.button, styles.backButton]}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.button, styles.submitButton]}
            loading={loading}
            disabled={loading || !isFormValid}
          >
            Add Partner
          </Button>
        </View>
      </Surface>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        {page === 1 ? renderEmailSection() : renderDetailsSection()}
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
  description: {
    marginBottom: 20,
    color: '#666',
  },
  searchbar: {
    marginBottom: 8,
  },
  suggestions: {
    maxHeight: 200,
    marginBottom: 16,
    borderRadius: 4,
    overflow: 'hidden',
  },
  inviteMessage: {
    marginTop: 16,
    color: '#6750A4',
    fontStyle: 'italic',
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
  successMessage: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  profilePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  imageNote: {
    color: '#666',
    fontStyle: 'italic',
  },
  sectionLabel: {
    marginBottom: 8,
    color: '#666',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 16,
    paddingBottom: 5,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
}); 