import { MD3LightTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 45,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 52,
  },
  displaySmall: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 44,
  },
  headlineLarge: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 40,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'System',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    lineHeight: 16,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
    lineHeight: 20,
  },
  bodySmall: {
    fontFamily: 'System',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
    lineHeight: 16,
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary colors
    primary: '#620FB7', // Main purple
    primaryContainer: '#F0E5FF', // Light purple background
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#3A0980', // Darker purple for text on light purple

    // Secondary colors
    secondary: '#090147', // Deep blue
    secondaryContainer: '#E5E6FF', // Light blue background
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#050134', // Darker blue for text on light blue

    // Accent colors
    tertiary: '#8B44D1', // Medium purple
    tertiaryContainer: '#F5EAFF',
    onTertiary: '#FFFFFF',
    onTertiaryContainer: '#2D0C5C',

    // Background colors
    background: '#FAFBFF', // Very light blue-tinted background
    surface: '#FFFFFF',
    surfaceVariant: '#F4F0F7', // Light purple-tinted surface
    onBackground: '#090147', // Deep blue for text
    onSurface: '#090147',
    onSurfaceVariant: '#46464F',

    // Error colors
    error: '#BA1A1A',
    errorContainer: '#FFDAD6',
    onError: '#FFFFFF',
    onErrorContainer: '#410002',

    // Other colors
    outline: '#787680',
    outlineVariant: '#C9C5D0',
    inverseSurface: '#303034',
    inversePrimary: '#D4BAFF',
    elevation: {
      level0: 'transparent',
      level1: '#F7F2FB', // Very light purple tint
      level2: '#F4EDF9',
      level3: '#F1E8F7',
      level4: '#F0E7F6',
      level5: '#EEE4F5',
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};