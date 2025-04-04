import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Surface, Card, TouchableRipple } from 'react-native-paper';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePostsStore } from '../../../store/posts';
import { useStatsStore } from '../../../store/stats';
import NavigationBar from '../components/NavigationBar';
import { ReferralOpportunity } from '../../../store/posts';

export default function Opportunities() {
  const theme = useTheme();
  const posts = usePostsStore(state => state.posts);
  const hasReferral = useStatsStore(state => state.hasReferral);

  const availableOpportunities = posts
    .filter(post => !hasReferral(post.id))
    .sort((a, b) => {
      const getTimeValue = (timestamp: string) => {
        if (timestamp.includes('h')) return parseInt(timestamp) * 60;
        if (timestamp.includes('d')) return parseInt(timestamp) * 24 * 60;
        return 0;
      };
      return getTimeValue(a.timestamp) - getTimeValue(b.timestamp);
    });

  const getSourceIcon = (source: 'facebook' | 'instagram' | 'linkedin' | 'nextdoor' | 'alignable') => {
    switch (source) {
      case 'facebook':
        return 'logo-facebook';
      case 'instagram':
        return 'logo-instagram';
      case 'linkedin':
        return 'logo-linkedin';
      case 'nextdoor':
        return 'home-outline';
      case 'alignable':
        return 'business-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>All Opportunities</Text>
        </Surface>

        {availableOpportunities.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                No new referral opportunities available.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          availableOpportunities.map((post) => (
            <Link href={{pathname: '/(app)/details', params: {id: post.id}}} asChild key={post.id}>
              <TouchableRipple>
                <Card style={styles.postCard} mode="outlined">
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
              </TouchableRipple>
            </Link>
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
  postCard: {
    margin: 12,
  },
  emptyCard: {
    margin: 12,
    padding: 20,
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