import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Text, TextInput, Button, Surface } from 'react-native-paper';

export default function SignUp() {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    router.replace('/facebook');
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>Welcome to Andi</Text>
        <Text variant="titleLarge" style={styles.subtitle}>Your AI-powered referral agent</Text>

        <Surface style={styles.form} elevation={2}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
          />
          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.button}
            labelStyle={styles.buttonText}
          >
            Get Started
          </Button>
        </Surface>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  form: {
    padding: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    paddingVertical: 6,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});