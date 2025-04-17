import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePartnersStore, Partner } from '../../../store/partners';
import { usePostsStore } from '../../../store/posts';
import { useTheme, Text, Surface, Card, Button, TextInput, IconButton, Menu, Divider } from 'react-native-paper';
import { useStatsStore } from '../../../store/stats';
import { useProfileStore } from '../../../store/profile';
import { Routes, navigate } from '../../navigation';

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
  const partners = usePartnersStore(state => state.partners);
  const getPartnerById = usePartnersStore(state => state.getPartnerById);
  const addGivenReferral = useStatsStore(state => state.addGivenReferral);
  const profile = useProfileStore(state => state.profile);
  
  // Check if user is signed into BNI
  const isBniConnected = profile.business === 'BNI Member Business';
  // Check if user is connected to Facebook
  const isFacebookConnected = profile.social?.facebook !== undefined;
  
  // Get available partners (manually added or from BNI)
  const availablePartners = partners.filter(p => p.available === true);
  const hasAvailablePartners = availablePartners.length > 0;

  // Get matching partner for post from available partners only
  const findBestMatchingPartner = () => {
    if (!post || !hasAvailablePartners) return undefined;
    
    // First check if the matched partner from the post is available
    if (post.matchedUserId) {
      const partner = getPartnerById(post.matchedUserId);
      if (partner && partner.available) return partner;
    }
    
    // If not, find the first available partner as a fallback
    return availablePartners[0];
  };

  const bestMatchingPartner = findBestMatchingPartner();

  // State for selected partner and partner selector menu
  const [selectedPartner, setSelectedPartner] = useState<Partner | undefined>(bestMatchingPartner);
  const [partnerMenuVisible, setPartnerMenuVisible] = useState(false);

  // Update draft message when selected partner changes
  const [draftMessage, setLocalDraftMessage] = useState('');
  
  useEffect(() => {
    if (selectedPartner && post) {
      setLocalDraftMessage(generateDraftMessage(post, selectedPartner));
    }
  }, [selectedPartner, post]);

  // If available partners change, update the selected partner if needed
  useEffect(() => {
    if (!selectedPartner && hasAvailablePartners) {
      setSelectedPartner(bestMatchingPartner);
    } else if (selectedPartner && !selectedPartner.available) {
      // If current selected partner is no longer available, switch to an available one
      setSelectedPartner(bestMatchingPartner);
    }
  }, [availablePartners, selectedPartner, bestMatchingPartner]);

  const [isPosting, setIsPosting] = useState(false);

  // Handle partner selection
  const handleSelectPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setPartnerMenuVisible(false);
  };

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
    <Surface style={styles.container}>
      <Surface style={styles.header} elevation={1}>
        <IconButton
          icon="close"
          size={24}
          onPress={() => navigate.push('DASHBOARD')}
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

        {/* Show Best Match and Referral Message if there are available partners */}
        {hasAvailablePartners && (
          <>
            <Card style={styles.matchSection} mode="outlined">
              <Card.Content>
                <View style={styles.matchHeader}>
                  <Text variant="titleLarge">Best Match</Text>
                  <Surface style={styles.matchScoreBadge} elevation={0}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary }}>95% Match</Text>
                  </Surface>
                </View>

                {/* Partner selector */}
                <View style={styles.partnerSelector}>
                  <Menu
                    visible={partnerMenuVisible}
                    onDismiss={() => setPartnerMenuVisible(false)}
                    anchor={<Button 
                      mode="outlined" 
                      onPress={() => setPartnerMenuVisible(true)}
                      icon="account-switch"
                      style={styles.partnerSelectorButton}
                    >
                      {selectedPartner ? 'Change Partner' : 'Select Partner'}
                    </Button>}
                    style={styles.partnerMenu}
                  >
                    {availablePartners.map(partner => (
                      <Menu.Item
                        key={partner.id}
                        title={`${partner.name} - ${partner.category}`}
                        onPress={() => handleSelectPartner(partner)}
                      />
                    ))}
                  </Menu>
                </View>

                {selectedPartner && (
                  <View style={styles.partnerCard}>
                    <Image
                      source={{ uri: selectedPartner.image }}
                      style={styles.partnerImage}
                    />
                    <View style={styles.partnerInfo}>
                      <Text variant="titleMedium">{selectedPartner.name}</Text>
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {selectedPartner.business}
                      </Text>
                      <Surface style={styles.categoryBadge} elevation={0}>
                        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                          {selectedPartner.category}
                        </Text>
                      </Surface>
                    </View>
                  </View>
                )}
              </Card.Content>
            </Card>

            {selectedPartner && (
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
                      numberOfLines={10}
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
            )}
          </>
        )}
        
        {/* Show message when user is connected to Facebook but has no partners */}
        {isFacebookConnected && !hasAvailablePartners && (
          <Card style={styles.emptyCard} mode="outlined">
            <Card.Content>
              <Text variant="titleLarge" style={{ marginBottom: 12 }}>Connect with BNI</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}>
                Cannot refer anyone to this post, no referral partners have been added. Connect to BNI, or add a referral partner!
              </Text>
              <View style={styles.buttonContainer}>
                <Button 
                  mode="contained"
                  onPress={() => navigate.push('BNI')}
                  icon="briefcase"
                  buttonColor="#003767"
                  style={{ marginRight: 8 }}
                >
                  Connect with BNI
                </Button>
                <Button 
                  mode="contained"
                  onPress={() => navigate.push('ADD_PARTNER')}
                  icon="account-plus"
                >
                  Add Partner
                </Button>
              </View>
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
  emptyCard: {
    margin: 12,
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  partnerSelector: {
    marginBottom: 16,
    position: 'relative',
  },
  partnerSelectorButton: {
    marginVertical: 8,
  },
  partnerMenu: {
    width: '80%',
    maxHeight: 300,
  },
});