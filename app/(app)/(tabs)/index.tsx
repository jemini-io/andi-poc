import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { usePartnersStore } from '../../../store/partners';
import { usePostsStore } from '../../../store/posts';
import { useStatsStore } from '../../../store/stats';
import { useTheme, Text, Surface, Card, TouchableRipple, Avatar } from 'react-native-paper';

export default function Dashboard() {
  const theme = useTheme();
  const partners = usePartnersStore(state => state.partners);
  const maxPartners = usePartnersStore(state => state.maxPartners);
  const getUsedSlots = usePartnersStore(state => state.getUsedSlots);
  const hasAvailableSlots = usePartnersStore(state => state.hasAvailableSlots);
  const posts = usePostsStore(state => state.posts);
  const hasReferral = useStatsStore(state => state.hasReferral);
  const topPartners = partners.slice(0, 3);
  
  const { referralsReceived, getReferralsGiven, getOpportunities } = useStatsStore();
  const referralsGiven = getReferralsGiven();
  const opportunities = getOpportunities();

  const availableOpportunities = posts.filter(post => !hasReferral(post.id));

  const handleAddPartner = () => {
    if (hasAvailableSlots()) {
      router.push('/(app)/add-partner');
    }
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Header */}
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text variant="headlineLarge" style={{ color: theme.colors.onSurface }}>Andi's List</Text>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                Your AI Referral Agent
              </Text>
            </View>
            <Avatar.Image 
              size={50} 
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' }}
              style={styles.avatar}
            />
          </View>
        </Surface>

        {/* Scoreboard */}
        <Surface style={[styles.scoreboardContainer, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.scoreCard}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>{referralsReceived}</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Referrals Received</Text>
          </View>
          <View style={[styles.scoreCard, styles.middleCard, { borderColor: theme.colors.outlineVariant }]}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>{referralsGiven}</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Referrals Given</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>{opportunities}</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Opportunities</Text>
          </View>
        </Surface>

        {/* Referral Opportunities */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Opportunities</Text>
          </View>

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
              <Link href={`/(app)/(dashboard)/details?id=${post.id}`} asChild key={post.id}>
                <TouchableRipple>
                  <Card style={styles.postCard} mode="outlined">
                    <Card.Content>
                      <View style={styles.postHeader}>
                        <View style={styles.sourceIconContainer}>
                          <Ionicons name={getSourceIcon(post.source)} size={24} color={theme.colors.primary} />
                        </View>
                        <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>{post.timestamp}</Text>
                      </View>
                      
                      <Text variant="bodyLarge" numberOfLines={2} style={{ color: theme.colors.onSurface }}>
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
        </Surface>

        {/* Top Partners */}
        <Surface style={[styles.section, styles.lastSection, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Partners</Text>
              <Surface style={styles.partnerSlotsBadge} elevation={0}>
                <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
                  {getUsedSlots()}/{maxPartners} Partners
                </Text>
              </Surface>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partnersScroll}
          >
            {topPartners.map((partner) => (
              <Card key={partner.id} style={styles.partnerCard} mode="outlined">
                <Card.Content style={styles.partnerCardContent}>
                  <Image
                    source={{ uri: partner.image }}
                    style={styles.partnerImage}
                  />
                  <Text variant="titleMedium" style={[styles.partnerName, { color: theme.colors.onSurface }]}>
                    {partner.name}
                  </Text>
                  <Text variant="bodySmall" style={[styles.partnerBusiness, { color: theme.colors.onSurfaceVariant }]}>
                    {partner.business}
                  </Text>
                </Card.Content>
              </Card>
            ))}
            {hasAvailableSlots() && (
              <Card 
                style={[styles.partnerCard, styles.addPartnerCard]} 
                mode="outlined"
                onPress={handleAddPartner}
              >
                <Card.Content style={styles.addPartnerContent}>
                  <View style={[styles.addPartnerCircle, { borderColor: theme.colors.primary }]}>
                    <Ionicons name="add" size={32} color={theme.colors.primary} />
                  </View>
                  <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                    Add Partner
                  </Text>
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  avatar: {
    marginLeft: 16,
  },
  scoreboardContainer: {
    flexDirection: 'row',
    padding: 20,
    marginBottom: 12,
  },
  scoreCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  middleCard: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  section: {
    marginBottom: 12,
    paddingVertical: 20,
  },
  lastSection: {
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  partnerSlotsBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  postCard: {
    marginHorizontal: 20,
    marginBottom: 15,
  },
  emptyCard: {
    marginHorizontal: 20,
    marginBottom: 15,
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
  partnersScroll: {
    paddingHorizontal: 15,
  },
  partnerCard: {
    marginHorizontal: 5,
    width: 120,
  },
  partnerCardContent: {
    alignItems: 'center',
    padding: 10,
  },
  partnerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  partnerName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  partnerBusiness: {
    textAlign: 'center',
  },
  addPartnerCard: {
    justifyContent: 'center',
  },
  addPartnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: '100%',
  },
  addPartnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});