import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePartnersStore } from '../../../store/partners';
import { usePostsStore } from '../../../store/posts';
import { useTheme, Text, Surface, Card, Button, TextInput, IconButton } from 'react-native-paper';
import { useStatsStore } from '../../../store/stats';

const generateDraftMessage = (post: any, partner: any): string => {
  const intro = "I'd like to recommend";
  const expertise = partner.category.toLowerCase();
  const businessInfo = `${partner.name} from ${partner.business}`;
  const contact = partner.phone && partner.website 
    ? `You can reach them at ${partner.phone} or visit their website at ${partner.website}`
    : '';
  const social = partner.social?.linkedin 
    ? `Connect with them on LinkedIn at ${partner.social.linkedin}`
    : partner.social?.facebook
    ? `Find them on Facebook at ${partner.social.facebook}`
    : partner.social?.instagram
    ? `Check out their work on Instagram at ${partner.social.instagram}`
    : '';
  const closing = "They have an excellent track record and I'm confident they can help.";

  return `${intro} an excellent ${expertise}, ${businessInfo}. ${contact}. ${social}. ${closing}`;
};

export default function Details() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getPostById = usePostsStore(state => state.getPostById);
  const setDraftMessage = usePostsStore(state => state.setDraftMessage);
  const addComment = usePostsStore(state => state.addComment);
  const post = getPostById(id);
  const getPartnerById = usePartnersStore(state => state.getPartnerById);
  const addGivenReferral = useStatsStore(state => state.addGivenReferral);
  const matchingPartner = post?.matchedUserId ? getPartnerById(post.matchedUserId) : undefined;

  const [draftMessage, setLocalDraftMessage] = useState(
    matchingPartner ? generateDraftMessage(post!, matchingPartner) : ''
  );
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    setIsPosting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPosting(false);
    
    // Add the comment to the post
    addComment(id, {
      id: String(Date.now()),
      author: 'You',
      content: draftMessage,
      timestamp: 'Just now',
      isReferral: true
    });

    addGivenReferral();
    
    // Store the draft message in global state
    setDraftMessage(draftMessage);
    
    // Navigate to review
    router.push({
      pathname: '/(app)/(dashboard)/review',
      params: { id }
    });
  };

  if (!post) {
    return (
      <Surface style={styles.container}>
        <Text variant="headlineMedium">Post not found</Text>
      </Surface>
    );
  }

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
    <Surface style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => router.back()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>Referral Opportunity</Text>
      </Surface>

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

        {matchingPartner && (
          <>
            <Card style={styles.matchSection} mode="outlined">
              <Card.Content>
                <View style={styles.matchHeader}>
                  <Text variant="titleLarge">Best Match</Text>
                  <Surface style={styles.matchScoreBadge} elevation={0}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary }}>95% Match</Text>
                  </Surface>
                </View>

                <View style={styles.partnerCard}>
                  <Image
                    source={{ uri: matchingPartner.image }}
                    style={styles.partnerImage}
                  />
                  <View style={styles.partnerInfo}>
                    <Text variant="titleMedium">{matchingPartner.name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {matchingPartner.business}
                    </Text>
                    <Surface style={styles.categoryBadge} elevation={0}>
                      <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                        {matchingPartner.category}
                      </Text>
                    </Surface>
                  </View>
                </View>

                <View style={styles.contactInfo}>
                  {matchingPartner.phone && (
                    <View style={styles.contactItem}>
                      <Ionicons name="call-outline" size={20} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 10 }}>
                        {matchingPartner.phone}
                      </Text>
                    </View>
                  )}
                  {matchingPartner.website && (
                    <View style={styles.contactItem}>
                      <Ionicons name="globe-outline" size={20} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 10 }}>
                        {matchingPartner.website}
                      </Text>
                    </View>
                  )}
                  {matchingPartner.social && Object.entries(matchingPartner.social).map(([platform, url]) => (
                    <View key={platform} style={styles.contactItem}>
                      <Ionicons name={`logo-${platform}`} size={20} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 10 }}>
                        {url}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.draftSection} mode="outlined">
              <Card.Content>
                <Text variant="titleLarge">Your Referral Message</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, marginBottom: 16 }}>
                  Edit the message below to personalize your recommendation
                </Text>
                
                <Surface style={styles.draftCard} elevation={0}>
                  <TextInput
                    mode="outlined"
                    value={draftMessage}
                    onChangeText={setLocalDraftMessage}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter your referral message..."
                    style={styles.draftInput}
                  />
                </Surface>

                <Button
                  mode="contained"
                  onPress={handlePost}
                  loading={isPosting}
                  disabled={isPosting || !draftMessage.trim()}
                  style={styles.postButton}
                  contentStyle={styles.postButtonContent}
                >
                  {isPosting ? 'Posting...' : 'Post Referral'}
                </Button>
              </Card.Content>
            </Card>
          </>
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
  postStats: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  matchSection: {
    margin: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  matchScoreBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  partnerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  partnerInfo: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  draftSection: {
    margin: 12,
  },
  draftCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 20,
  },
  draftInput: {
    backgroundColor: 'transparent',
  },
  postButton: {
    marginTop: 10,
  },
  postButtonContent: {
    paddingVertical: 6,
  },
});