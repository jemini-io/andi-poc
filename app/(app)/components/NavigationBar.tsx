import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { IconButton, useTheme, Surface } from 'react-native-paper';

export default function NavigationBar() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Surface style={[styles.container, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <View style={styles.content}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.push('/dashboard')}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingTop: 20, // For status bar
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
}); 