import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useTheme, Text, Searchbar, Button, Surface, List, Divider, ActivityIndicator } from 'react-native-paper';
import { usePartnersStore } from '../../../store/partners';
import NavigationBar from '../components/NavigationBar';

interface Suggestion {
  id: string;
  email: string;
  name: string;
  business: string;
}

export default function AddPartner() {
  const theme = useTheme();
  const addPartner = usePartnersStore(state => state.addPartner);
  const partners = usePartnersStore(state => state.partners);
  const hasAvailableSlots = usePartnersStore(state => state.hasAvailableSlots);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (email.length > 0) {
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
  }, [email, partners]);

  const handleSubmit = async () => {
    if (!email || !hasAvailableSlots()) return;

    setLoading(true);
    try {
      await addPartner({
        id: Date.now().toString(),
        email,
        name: '',
        business: '',
        slogan: '',
        category: '',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      });
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Failed to invite partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setEmail(suggestion.email);
    setShowSuggestions(false);
  };

  const isExistingEmail = partners.some(p => p.email.toLowerCase() === email.toLowerCase());

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Invite Partner</Text>
        </Surface>

        <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="bodyMedium" style={styles.description}>
            Search for an existing partner or enter a new email address to send an invitation.
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
              An invitation email will be sent to {email} to join your referral network.
            </Text>
          )}

          {showSuccess && (
            <View style={styles.successMessage}>
              <Text variant="bodyMedium" style={styles.successText}>
                Invitation sent successfully!
              </Text>
              <ActivityIndicator size="small" />
            </View>
          )}
        </Surface>

        <Surface style={[styles.footer, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={loading}
            disabled={loading || !email || !hasAvailableSlots() || isExistingEmail}
          >
            {isExistingEmail ? 'Already a Partner' : 'Send Invitation'}
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
    color: '#6750A4', // Using a default primary color instead of theme
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
}); 