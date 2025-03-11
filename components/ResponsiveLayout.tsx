import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export default function ResponsiveLayout({ children, maxWidth = 1200 }: ResponsiveLayoutProps) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > maxWidth;

  return (
    <View style={styles.container}>
      <View style={[
        styles.content,
        isLargeScreen && { maxWidth, alignSelf: 'center' }
      ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
  },
}); 