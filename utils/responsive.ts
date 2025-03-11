import { Dimensions, Platform, ScaledSize } from 'react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Check if device is a tablet or large screen
export const isTablet = () => {
  const dim = Dimensions.get('window');
  return (dim.width >= 768) || (dim.height >= 768);
};

// Check if we're on web
export const isWeb = Platform.OS === 'web';

// Responsive sizing helper
export const scale = (size: number) => {
  const baseWidth = 375; // Standard iPhone width
  return (width / baseWidth) * size;
};

// Responsive padding/margin helper
export const spacing = (multiplier: number = 1) => {
  const baseSpacing = 8;
  return baseSpacing * multiplier;
};

// Get responsive column count based on screen width
export const getColumnCount = () => {
  if (width < 576) return 1; // Mobile
  if (width < 768) return 2; // Large mobile/Small tablet
  if (width < 992) return 3; // Tablet
  if (width < 1200) return 4; // Small desktop
  return 5; // Large desktop
};

// Listen for dimension changes
export const useDimensionsChange = (callback: (dim: ScaledSize) => void) => {
  Dimensions.addEventListener('change', ({ window }) => {
    callback(window);
  });
}; 