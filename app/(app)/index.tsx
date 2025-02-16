import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface Post {
  id: string;
  source: 'facebook' | 'instagram' | 'linkedin';
  content: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}

const POSTS: Post[] = [
  {
    id: '1',
    source: 'facebook',
    content: "Looking for recommendations for a reliable financial advisor in the Bellevue area. Need help with retirement planning and investment strategies. Any suggestions would be greatly appreciated!",
    likes: 15,
    comments: 8,
    shares: 2,
    timestamp: '2h ago'
  },
  {
    id: '2',
    source: 'linkedin',
    content: "Our startup is growing and we need legal advice for contract negotiations and IP protection. Can anyone recommend a good business attorney in Seattle?",
    likes: 42,
    comments: 12,
    shares: 5,
    timestamp: '4h ago'
  },
  {
    id: '3',
    source: 'facebook',
    content: "Hi neighbors! We're looking to renovate our kitchen and need recommendations for reliable contractors. Budget is flexible for the right team. Any suggestions?",
    likes: 28,
    comments: 21,
    shares: 3,
    timestamp: '6h ago'
  }
];

const SCOREBOARD = {
  received: 24,
  given: 31,
  opportunities: 127
};

const PARTNERS = [
  {
    id: '1',
    name: 'Sarah Chen',
    business: 'Evergreen Financial Planning',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    business: 'Elite Real Estate Group',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
  },
  {
    id: '3',
    name: 'Jennifer Park',
    business: 'Bright Smile Dental',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
  }
];

export default function Dashboard() {
  const getSourceIcon = (source: Post['source']) => {
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
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>

        {/* Scoreboard */}
        <View style={styles.scoreboardContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{SCOREBOARD.received}</Text>
            <Text style={styles.scoreLabel}>Referrals Received</Text>
          </View>
          <View style={[styles.scoreCard, styles.middleCard]}>
            <Text style={styles.scoreNumber}>{SCOREBOARD.given}</Text>
            <Text style={styles.scoreLabel}>Referrals Given</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNumber}>{SCOREBOARD.opportunities}</Text>
            <Text style={styles.scoreLabel}>Opportunities</Text>
          </View>
        </View>

        {/* Referral Opportunities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Referral Opportunities</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          {POSTS.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.sourceIconContainer}>
                  <Ionicons name={getSourceIcon(post.source)} size={24} color="#357ABD" />
                </View>
                <Text style={styles.timestamp}>{post.timestamp}</Text>
              </View>
              
              <Text style={styles.postContent} numberOfLines={2}>
                {post.content}
              </Text>
              
              <View style={styles.postStats}>
                <View style={styles.stat}>
                  <Ionicons name="heart-outline" size={16} color="#666" />
                  <Text style={styles.statText}>{post.likes}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="chatbubble-outline" size={16} color="#666" />
                  <Text style={styles.statText}>{post.comments}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="share-outline" size={16} color="#666" />
                  <Text style={styles.statText}>{post.shares}</Text>
                </View>
              </View>
              
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>View Post</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>Referral Opportunity</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Top Partners */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Partners 1</Text>
            <Link href="/partners" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.partnersScroll}
          >
            {PARTNERS.map((partner) => (
              <View key={partner.id} style={styles.partnerCard}>
                <Image
                  source={{ uri: partner.image }}
                  style={styles.partnerImage}
                />
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerBusiness}>{partner.business}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  scoreboardContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
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
    borderColor: '#E5E5E5',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#357ABD',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  seeAllButton: {
    color: '#357ABD',
    fontSize: 14,
    fontWeight: '500',
  },
  postCard: {
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceIconContainer: {
    marginRight: 10,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  postContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#357ABD',
  },
  actionButtonText: {
    color: '#357ABD',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#357ABD',
    borderColor: '#357ABD',
  },
  primaryButtonText: {
    color: '#fff',
  },
  partnersScroll: {
    paddingHorizontal: 15,
  },
  partnerCard: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: 120,
  },
  partnerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  partnerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  partnerBusiness: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});