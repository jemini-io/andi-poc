import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Surface, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { usePostsStore } from '../../../store/posts';
import { useStatsStore } from '../../../store/stats';
import NavigationBar from '../components/NavigationBar';

export default function GivenReferrals() {
  const theme = useTheme();
  const posts = usePostsStore(state => state.posts);
  const { getGivenReferrals } = useStatsStore();
  const givenReferrals = getGivenReferrals();

  // Get posts that have been referred
  const referredPosts = posts.filter(post => 
    givenReferrals.includes(post.id)
  );

  const getSourceIcon = (source: 'facebook' | 'instagram' | 'linkedin') => {
    switch (source) {
      case 'facebook':
        return 'logo-facebook';
      case 'instagram':
        return 'logo-instagram';
      case 'linkedin':
        return 'logo-linkedin';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Given Referrals</Text>
        </Surface>

        {referredPosts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                You haven't given any referrals yet.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          referredPosts.map((post) => (
            <Card key={post.id} style={styles.postCard} mode="outlined">
              <Card.Content>
                <View style={styles.postHeader}>
                  <View style={styles.sourceIconContainer}>
                    <Ionicons name={getSourceIcon(post.source)} size={24} color={theme.colors.primary} />
                  </View>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{post.timestamp}</Text>
                </View>
                
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {post.content}
                </Text>
                
                <View style={styles.postStats}>
                  <View style={styles.stat}>
                    <Ionicons name="heart-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {post.likes}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="chatbubble-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {post.comments}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="share-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                      {post.shares}
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
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
  emptyCard: {
    padding: 20,
  },
  postCard: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceIconContainer: {
    marginRight: 10,
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
}); 