import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Surface, Text, Button, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../app/navigation';
import { isConnectedToBNI, isConnectedToFacebook, isAuthenticated } from '../utils/auth';
import { useProfileStore } from '../store/profile';

interface SignInModalProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function SignInModal({ visible, onDismiss }: SignInModalProps) {
  const theme = useTheme();
  const profile = useProfileStore(state => state.profile);
  
  // Check the BNI connection directly from the profile
  const isBniConnected = isAuthenticated() && profile.business === 'BNI Member Business';
  const isFacebookConnected = isAuthenticated() && profile.social?.facebook !== undefined;
  
  // Debug info - log the connection status when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      console.log('SignInModal opened');
      console.log('Profile business:', profile.business);
      console.log('Direct check - isBniConnected:', isBniConnected);
      console.log('Auth util - isConnectedToBNI():', isConnectedToBNI());
    }
  }, [visible, profile, isBniConnected]);

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
                Connect Your Sources
              </Text>
              <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Choose which platform to connect
              </Text>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon={({ size, color }) => (
                    <Ionicons 
                      name={isFacebookConnected ? "checkmark-circle" : "logo-facebook"} 
                      size={size} 
                      color={color} 
                    />
                  )}
                  onPress={handleFacebookConnect}
                  style={[
                    styles.button, 
                    { 
                      backgroundColor: isFacebookConnected ? '#4CAF50' : '#1877F2',
                      borderWidth: isFacebookConnected ? 2 : 0,
                      borderColor: isFacebookConnected ? '#2E7D32' : 'transparent'
                    }
                  ]}
                  contentStyle={styles.buttonContent}
                  disabled={isFacebookConnected}
                >
                  {isFacebookConnected ? 'Connected to Facebook' : 'Connect with Facebook'}
                </Button>
                {isFacebookConnected && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </View>
              
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  icon={isBniConnected ? "check-bold" : "briefcase"}
                  onPress={handleBNIConnect}
                  style={[
                    styles.button, 
                    { 
                      backgroundColor: isBniConnected ? '#4CAF50' : '#003767',
                      borderWidth: isBniConnected ? 2 : 0,
                      borderColor: isBniConnected ? '#2E7D32' : 'transparent'
                    }
                  ]}
                  contentStyle={styles.buttonContent}
                  disabled={isBniConnected}
                >
                  {isBniConnected ? 'Connected to BNI' : 'Connect with BNI'}
                </Button>
                {isBniConnected && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </View>
              
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
  buttonContainer: {
    width: '100%',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  skipButton: {
    marginTop: 8,
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
}); 