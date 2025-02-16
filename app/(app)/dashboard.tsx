import { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { usePartnersStore } from '../../store/partners';
import { usePostsStore } from '../../store/posts';
import { useStatsStore } from '../../store/stats';
import { useTheme, Text, Surface, Card, TouchableRipple, Avatar } from 'react-native-paper';
import { useReceivedReferralsStore } from '../../store/received-referrals';

export default function Dashboard() {
  const theme = useTheme();
  const partners = usePartnersStore(state => state.partners);
  const posts = usePostsStore(state => state.posts);
  const hasReferral = useStatsStore(state => state.hasReferral);
  
  const referralsReceived = useReceivedReferralsStore(state => state.getTotalReceived());
  const { referralsGiven, getOpportunities } = useStatsStore();
  const opportunities = getOpportunities();

  // Filter out posts that already have referrals
  const availableOpportunities = posts.filter(post => !hasReferral(post.id));

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

  const { maxPartners, getUsedSlots } = usePartnersStore();

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
          <Link href="/(app)/(dashboard)/received-referrals" asChild>
            <TouchableRipple>
              <View style={styles.scoreCard}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>{referralsReceived}</Text>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Referrals Received</Text>
              </View>
            </TouchableRipple>
          </Link>
          <View style={styles.scoreCard}>
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
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Partners</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {getUsedSlots()}/{maxPartners}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partnersScroll}
          >
            {partners.map((partner) => (
              <Link 
                href={`/(app)/(dashboard)/edit-partner?id=${partner.id}`} 
                asChild 
                key={partner.id}
              >
                <TouchableRipple>
                  <Card style={styles.partnerCard} mode="outlined">
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
                </TouchableRipple>
              </Link>
            ))}
            
            {/* Add Partner Card */}
            <Link href="/(app)/(dashboard)/add-partner" asChild>
              <TouchableRipple>
                <Card style={[styles.partnerCard, styles.addPartnerCard]} mode="outlined">
                  <Card.Content style={styles.partnerCardContent}>
                    <View style={[styles.addPartnerCircle, { backgroundColor: theme.colors.primary }]}>
                      <Ionicons name="add" size={32} color={theme.colors.onPrimary} />
                    </View>
                    <Text variant="titleMedium" style={[styles.partnerName, { color: theme.colors.onSurface }]}>
                      Add Partner
                    </Text>
                  </Card.Content>
                </Card>
              </TouchableRipple>
            </Link>
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
    alignItems: 'center',
  },
  addPartnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
});