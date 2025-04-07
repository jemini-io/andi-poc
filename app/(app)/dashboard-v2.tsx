import React from 'react';
import { View, StyleSheet, ScrollView, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { usePartnersStore } from '../../store/partners';
import { usePostsStore } from '../../store/posts';
import { useStatsStore } from '../../store/stats';
import { useReceivedReferralsStore } from '../../store/received-referrals';
import { useTheme, Text, Surface, Card, TouchableRipple, Avatar, Button } from 'react-native-paper';
import { useProfileStore } from '../../store/profile';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import SignInModal from '../../components/SignInModal';
import { Routes, navigate } from '../navigation';

export default function DashboardV2() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  
  const partners = usePartnersStore(state => state.partners);
  const availablePartners = partners.filter(partner => partner.available === true);
  const posts = usePostsStore(state => state.posts);
  const hasReferral = useStatsStore(state => state.hasReferral);
  const { maxPartners, getUsedSlots } = usePartnersStore();
  const profile = useProfileStore(state => state.profile);
  
  const referralsReceived = useReceivedReferralsStore(state => state.getTotalReceived());
  const { referralsGiven, getOpportunities } = useStatsStore();
  const opportunities = getOpportunities();

  const isLoggedIn = profile.email !== 'pat@example.com'; // Simple check for demo purposes
  // Check if user is connected to BNI
  const isBniConnected = profile.business === 'BNI Member Business';
  // Check if user is connected to Facebook
  const isFacebookConnected = profile.social?.facebook !== undefined;

  // Filter out posts that already have referrals and show only Facebook posts if connected to Facebook
  const availableOpportunities = posts
    .filter(post => {
      // Only show posts if connected to Facebook
      if (!isFacebookConnected) {
        return false;
      }
      
      // Filter by non-referred posts and availability
      const notReferred = !hasReferral(post.id);
      
      // Only show Facebook posts that are marked as available
      return notReferred && post.source === 'facebook' && post.available === true;
    })
    .sort((a, b) => {
      // Convert relative timestamps to comparable values
      const getTimeValue = (timestamp: string) => {
        if (timestamp.includes('h')) return parseInt(timestamp) * 60; // hours to minutes
        if (timestamp.includes('d')) return parseInt(timestamp) * 24 * 60; // days to minutes
        return 0;
      };
      return getTimeValue(a.timestamp) - getTimeValue(b.timestamp);
    })
    .slice(0, 3);

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

  const [fontsLoaded] = useFonts({
    'DancingScript': require('../../assets/fonts/DancingScript-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleGoToBniMembers = () => {
    navigate.push('BNI_MEMBERS');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: isLargeScreen ? 20 : 10,
    },
    header: {
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 10,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    signInMessage: {
      textAlign: 'center',
      marginVertical: 20,
      padding: 20,
    },
    signInButton: {
      marginTop: 10,
    },
    bniMembersButton: {
      marginTop: 10,
      marginHorizontal: 20,
      marginBottom: 20,
      backgroundColor: '#003767',
    },
    welcomeCard: {
      marginHorizontal: 20,
      marginBottom: 15,
      backgroundColor: '#E3F2FD',
    },
    welcomeMessage: {
      textAlign: 'center',
      color: '#1877F2',
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView>
        {/* Header */}
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.headerContent}>
            {isLoggedIn ? (
              <Link href="/edit-profile" asChild>
                <TouchableRipple>
                  <Avatar.Image 
                    size={40} 
                    source={{ uri: profile.avatar }}
                  />
                </TouchableRipple>
              </Link>
            ) : (
              <Button 
                mode="contained" 
                onPress={() => setSignInModalVisible(true)} 
                style={styles.signInButton}
                compact
              >
                Sign In
              </Button>
            )}
            <Text variant="headlineMedium" style={[{ fontFamily: 'DancingScript', color: theme.colors.primary }]}>
              Andi AI Agent
            </Text>
            <div></div>
          </View>
        </Surface>

        {/* BNI Members Button - only show if BNI is connected */}
        {isBniConnected && availablePartners.length > 0 && (
          <Button
            mode="contained"
            icon="account-group"
            onPress={handleGoToBniMembers}
            style={styles.bniMembersButton}
          >
            View BNI Chapter Members
          </Button>
        )}

        {/* Scoreboard */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.scoreboardContainer}>
            <Link href="/received-referrals" asChild>
              <TouchableRipple>
                <View style={styles.scoreCard}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                    {isLoggedIn ? referralsReceived : '0'}
                  </Text>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Referrals Received</Text>
                </View>
              </TouchableRipple>
            </Link>
            <View style={styles.scoreCard}>
              <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                {isLoggedIn ? referralsGiven : '0'}
              </Text>
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Referrals Given</Text>
            </View>
            <Link href="/opportunities" asChild>
              <TouchableRipple>
                <View style={styles.scoreCard}>
                  <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
                    {isLoggedIn ? opportunities : '0'}
                  </Text>
                  <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Opportunities</Text>
                </View>
              </TouchableRipple>
            </Link>
          </View>
        </Surface>

        {/* Referral Opportunities */}
        <Surface style={[styles.section, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Opportunities</Text>
          </View>

          {!isFacebookConnected ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.signInMessage}>
                  Sign in with Facebook to access referral opportunities.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    navigate.push('FACEBOOK');
                  }}
                  style={styles.signInButton}
                  icon={({ size, color }) => (
                    <Ionicons name="logo-facebook" size={size} color={color} />
                  )}
                  buttonColor="#1877F2"
                >
                  Sign in with Facebook
                </Button>
              </Card.Content>
            </Card>
          ) : availableOpportunities.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                  No referral opportunities available. Connect to Facebook to access more features!
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    navigate.push('FACEBOOK');
                  }}
                  style={styles.signInButton}
                  icon={({ size, color }) => (
                    <Ionicons name="logo-facebook" size={size} color={color} />
                  )}
                  buttonColor="#1877F2"
                >
                  Connect to Facebook
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <>
              {isFacebookConnected && isLoggedIn && (
                <Card style={styles.welcomeCard}>
                  <Card.Content>
                    <Text variant="bodyLarge" style={styles.welcomeMessage}>
                      Facebook connected! Showing referral opportunities from your Facebook groups.
                    </Text>
                  </Card.Content>
                </Card>
              )}
              {availableOpportunities.map((post) => (
                <TouchableRipple key={post.id} onPress={() => navigate.push('DETAILS', { id: post.id })}>
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
              ))}
            </>
          )}
        </Surface>

        {/* Top Partners */}
        <Surface style={[styles.section, styles.lastSection, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Partners</Text>
            <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {isBniConnected ? `${getUsedSlots()}/${maxPartners}` : '0/0'}
            </Text>
          </View>

          {!isBniConnected ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text variant="bodyLarge" style={styles.signInMessage}>
                  Sign in with BNI to connect with referral partners and grow your network.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    navigate.push('BNI');
                  }}
                  style={styles.signInButton}
                  icon="briefcase"
                  buttonColor="#003767"
                >
                  Sign in with BNI
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <>
              {isBniConnected && (
                <Card style={[styles.welcomeCard, {backgroundColor: '#E8F5E9'}]}>
                  <Card.Content>
                    <Text variant="bodyLarge" style={[styles.welcomeMessage, {color: '#003767'}]}>
                      BNI connected! Showing referral partners from your BNI chapter.
                    </Text>
                  </Card.Content>
                </Card>
              )}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
                {availablePartners.map((partner) => (
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
                <Link href="/add-partner" asChild>
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
            </>
          )}
        </Surface>
      </ScrollView>
      <SignInModal 
        visible={signInModalVisible} 
        onDismiss={() => setSignInModalVisible(false)} 
      />
    </View>
  );
} 