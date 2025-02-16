import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePostsStore } from '../../../store/posts';
import { useTheme, Text, Surface, Card, IconButton } from 'react-native-paper';

export default function Review() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showSuccess, setShowSuccess] = useState(true);
  const { posts, getPostById } = usePostsStore();
  
  const post = getPostById(id);
  const nextPost = posts[posts.findIndex(p => p.id === id) + 1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    router.replace('/(app)/(tabs)');
  };

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

  if (!post) {
    return (
      <Surface style={styles.container}>
        <Surface style={styles.header} elevation={1}>
          <IconButton
            icon="close"
            size={24}
            onPress={handleClose}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>Review Referral</Text>
        </Surface>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorText}>Post not found</Text>
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="close"
          size={24}
          onPress={handleClose}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>Review Referral</Text>
      </Surface>

      {showSuccess && (
        <Surface style={styles.successBanner} elevation={1}>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
          <Text variant="bodyLarge" style={styles.successText}>Referral Posted Successfully!</Text>
        </Surface>
      )}

      <ScrollView style={styles.content}>
        <Card style={styles.postCard} mode="outlined">
          <Card.Content>
            <View style={styles.postHeader}>
              <View style={styles.sourceIconContainer}>
                <Ionicons name={getSourceIcon(post.source)} size={24} color={theme.colors.primary} />
              </View>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {post.timestamp}
              </Text>
            </View>
            
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {post.content}
            </Text>

            <View style={styles.commentsSection}>
              <Text variant="titleMedium" style={styles.commentsTitle}>Comments</Text>
              {post.comments_list?.map((comment) => (
                <Card 
                  key={comment.id} 
                  style={[
                    styles.commentCard,
                    comment.isReferral && styles.referralComment
                  ]}
                  mode="outlined"
                >
                  <Card.Content>
                    <Text variant="titleSmall">{comment.author}</Text>
                    <Text variant="bodyMedium" style={styles.commentContent}>
                      {comment.content}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {comment.timestamp}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </Card.Content>
        </Card>

        {nextPost && (
          <Card style={styles.nextOpportunitySection} mode="outlined">
            <Card.Content>
              <Text variant="titleMedium" style={styles.nextOpportunityTitle}>
                Next Opportunity
              </Text>
              <Card
                style={styles.nextPostCard}
                mode="outlined"
                onPress={() => router.replace(`/(app)/(dashboard)/details?id=${nextPost.id}`)}
              >
                <Card.Content>
                  <View style={styles.postHeader}>
                    <View style={styles.sourceIconContainer}>
                      <Ionicons name={getSourceIcon(nextPost.source)} size={24} color={theme.colors.primary} />
                    </View>
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {nextPost.timestamp}
                    </Text>
                  </View>
                  
                  <Text 
                    variant="bodyLarge" 
                    style={{ color: theme.colors.onSurface }}
                    numberOfLines={3}
                  >
                    {nextPost.content}
                  </Text>
                  
                  <View style={styles.postStats}>
                    <View style={styles.stat}>
                      <Ionicons name="heart-outline" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                        {nextPost.likes}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons name="chatbubble-outline" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                        {nextPost.comments}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons name="share-outline" size={16} color={theme.colors.onSurfaceVariant} />
                      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                        {nextPost.shares}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    justifyContent: 'center',
  },
  successText: {
    color: '#fff',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  postCard: {
    margin: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceIconContainer: {
    marginRight: 10,
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
    marginTop: 15,
  },
  commentsTitle: {
    marginBottom: 12,
  },
  commentCard: {
    marginBottom: 10,
  },
  referralComment: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  commentContent: {
    marginVertical: 8,
  },
  nextOpportunitySection: {
    margin: 12,
  },
  nextOpportunityTitle: {
    marginBottom: 12,
  },
  nextPostCard: {
    backgroundColor: '#F8F9FA',
  },
  postStats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#666',
    marginBottom: 20,
  },
});