import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../app/navigation';

interface AccessDeniedScreenProps {
  type: 'facebook' | 'bni';
  title?: string;
  message?: string;
}

export default function AccessDeniedScreen({ 
  type, 
  title = type === 'facebook' ? 'Facebook Connection Required' : 'BNI Connection Required',
  message = type === 'facebook' 
    ? 'You need to connect your Facebook account to access this page.' 
    : 'You need to connect your BNI account to access this page.'
}: AccessDeniedScreenProps) {
  
  const handleConnect = () => {
    if (type === 'facebook') {
      navigate.push('FACEBOOK');
    } else {
      navigate.push('BNI');
    }
  };

  const handleBackToDashboard = () => {
    navigate.replace('DASHBOARD');
  };

  return (
    <Surface style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={type === 'facebook' ? 'logo-facebook' : 'briefcase'} 
          size={60} 
          color={type === 'facebook' ? '#1877F2' : '#003767'} 
        />
      </View>
      
      <Text variant="headlineMedium" style={styles.title}>{title}</Text>
      <Text variant="bodyLarge" style={styles.message}>{message}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleConnect}
          buttonColor={type === 'facebook' ? '#1877F2' : '#003767'}
          style={styles.connectButton}
        >
          Connect {type === 'facebook' ? 'Facebook' : 'BNI'}
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={handleBackToDashboard}
          style={styles.backButton}
        >
          Back to Dashboard
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
  },
  connectButton: {
    paddingVertical: 6,
  },
  backButton: {
    paddingVertical: 6,
  },
}); 