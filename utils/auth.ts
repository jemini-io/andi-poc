import { useProfileStore } from '../store/profile';
import { navigate } from '../app/navigation';

/**
 * Checks if the user is logged in
 */
export const isAuthenticated = (): boolean => {
  const profile = useProfileStore.getState().profile;
  // In this demo, we're considering users with the default email as not logged in
  return profile.email !== 'pat@example.com';
};

/**
 * Checks if the user is connected to BNI
 */
export const isConnectedToBNI = (): boolean => {
  const profile = useProfileStore.getState().profile;
  return isAuthenticated() && profile.business === 'BNI Member Business';
};

/**
 * Checks if the user is connected to Facebook
 */
export const isConnectedToFacebook = (): boolean => {
  const profile = useProfileStore.getState().profile;
  return isAuthenticated() && profile.social?.facebook !== undefined;
};

/**
 * Redirects to dashboard if the user isn't authenticated
 */
export const redirectIfNotAuthenticated = (): boolean => {
  if (!isAuthenticated()) {
    navigate.replace('DASHBOARD');
    return true;
  }
  return false;
};

/**
 * Redirects to dashboard if the user isn't connected to BNI
 */
export const redirectIfNotConnectedToBNI = (): boolean => {
  if (!isConnectedToBNI()) {
    navigate.replace('DASHBOARD');
    return true;
  }
  return false;
};

/**
 * Redirects to dashboard if the user isn't connected to Facebook
 */
export const redirectIfNotConnectedToFacebook = (): boolean => {
  if (!isConnectedToFacebook()) {
    navigate.replace('DASHBOARD');
    return true;
  }
  return false;
}; 