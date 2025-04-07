import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Surface, Text, Button, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../app/navigation';

interface SignInModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function SignInModal({ visible, onDismiss }: SignInModalProps) {
  const theme = useTheme();

  const handleEmailSignIn = () => {
    onDismiss();
    navigate.push('EMAIL');
  };

  const handleFacebookConnect = () => {
    onDismiss();
    navigate.push('FACEBOOK');
  };

  const handleBNIConnect = () => {
    onDismiss();
    navigate.push('BNI');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Surface style={[styles.modalContent, { backgroundColor: theme.colors.surface }]} elevation={5}>
              <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
                <Ionicons name="close" size={24} color={theme.colors.onSurface} />
              </TouchableOpacity>
              
              <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                Sign In or Connect
              </Text>
              <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Choose how you'd like to proceed
              </Text>
              
              <Button
                mode="contained"
                icon="email"
                onPress={handleEmailSignIn}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
              >
                Sign In With Email
              </Button>
              
              <Button
                mode="contained"
                icon={({ size, color }) => (
                  <Ionicons name="logo-facebook" size={size} color={color} />
                )}
                onPress={handleFacebookConnect}
                style={[styles.button, { backgroundColor: '#1877F2' }]}
                contentStyle={styles.buttonContent}
              >
                Connect with Facebook
              </Button>
              
              <Button
                mode="contained"
                icon="briefcase"
                onPress={handleBNIConnect}
                style={[styles.button, { backgroundColor: '#003767' }]}
                contentStyle={styles.buttonContent}
              >
                Connect with BNI
              </Button>
              
              <Button
                mode="text"
                onPress={onDismiss}
                style={styles.skipButton}
              >
                Skip for now
              </Button>
            </Surface>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16,
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  skipButton: {
    marginTop: 8,
  },
}); 