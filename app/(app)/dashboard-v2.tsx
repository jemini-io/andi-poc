import React, { useEffect } from 'react';
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
  const isSmallScreen = width < 576;
  const isMediumScreen = width >= 576 && width < 768;
  const isLargeScreen = width >= 768 && width < 992;
  const isExtraLargeScreen = width >= 992;
  
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

  // BNI partners (those marked available by the BNI connection)
  const bniPartners = partners.filter(partner => 
    partner.available === true && 
    !partner.id.includes('_') &&
    partner.id.length < 10
  );
  
  // Log additional partner info for debugging
  useEffect(() => {
    // Report if no BNI partners with available=true were found
    if (isBniConnected && bniPartners.length === 0) {
      console.log('Warning: User is BNI connected but no BNI partners found with available=true');
      console.log('All partners:', partners);
      console.log('Partners with available=true:', partners.filter(p => p.available === true).length);
      console.log('Partners with ID not containing "_":', partners.filter(p => !p.id.includes('_')).length);
    }
  }, [isBniConnected, bniPartners, partners]);
  
  // Get manually added partners (those with underscore in ID and available=true)
  const manuallyAddedPartners = partners.filter(partner => 
    partner.available === true && 
    partner.id.includes('_')
  );
  
  // Combined partners to display - include both BNI and manually added partners
  const allDisplayablePartners = [...bniPartners, ...manuallyAddedPartners];
  
  // For displaying the count of total partners in the header
  const totalPartners = allDisplayablePartners.length;
  
  // Debug console logs
  useEffect(() => {
    console.log('Dashboard partners state:');
    console.log('All partners count:', partners.length);
    console.log('BNI partners count:', bniPartners.length);
    console.log('Manually added partners count:', manuallyAddedPartners.length);
    console.log('Total displayable partners:', totalPartners);
    
    // Log the first BNI partner for inspection
    if (bniPartners.length > 0) {
      console.log('Sample BNI partner:', bniPartners[0]);
    }
  }, [partners, bniPartners, manuallyAddedPartners]);

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
      padding: isSmallScreen ? 8 : isLargeScreen ? 16 : 20,
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
      flexDirection: isSmallScreen ? 'column' : 'row',
      padding: isSmallScreen ? 10 : 20,
      marginBottom: 12,
      alignItems: isSmallScreen ? 'center' : 'stretch',
      justifyContent: 'space-around',
    },
    scoreCard: {
      flex: isSmallScreen ? 0 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: isSmallScreen ? 12 : 15,
      paddingVertical: isSmallScreen ? 12 : 15,
      marginBottom: isSmallScreen ? 4 : 0,
      width: isSmallScreen ? '100%' : undefined,
      minHeight: isSmallScreen ? 60 : 70,
      maxWidth: isSmallScreen ? '100%' : undefined,
    },
    scoreValue: {
      color: theme.colors.primary,
      textAlign: 'right',
      marginRight: 16,
      minWidth: isSmallScreen ? 40 : 60,
      fontWeight: 'bold',
    },
    scoreLabel: {
      color: theme.colors.onSurfaceVariant,
      flexWrap: 'wrap',
      flex: 1,
      paddingRight: 4,
      alignSelf: 'center',
      textAlign: 'left',
    },
    middleCard: {
      borderLeftWidth: isSmallScreen ? 0 : 1,
      borderRightWidth: isSmallScreen ? 0 : 1,
      borderTopWidth: isSmallScreen ? 1 : 0,
      borderBottomWidth: isSmallScreen ? 1 : 0,
      borderColor: 'rgba(0,0,0,0.1)',
      paddingVertical: isSmallScreen ? 12 : 15,
      marginVertical: isSmallScreen ? 10 : 0,
      justifyContent: 'center',
      alignItems: isSmallScreen ? 'flex-start' : 'center',
    },
    middleCardDesktop: {
      marginHorizontal: isSmallScreen ? 0 : 20,
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
      paddingHorizontal: isSmallScreen ? 8 : 15,
    },
    partnerCard: {
      marginHorizontal: 5,
      width: isSmallScreen ? 100 : isMediumScreen ? 110 : 120,
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
    facebookConnectedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E3F2FD',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    facebookIcon: {
      marginRight: 4,
    },
    facebookConnectedText: {
      color: '#1877F2',
    },
    bniConnectedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    bniIcon: {
      marginRight: 4,
    },
    bniConnectedText: {
      color: '#003767',
    },
    bniConnectedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewBniButton: {
      padding: 8,
      backgroundColor: '#E8F5E9',
      borderRadius: 12,
      marginLeft: 8,
      height: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={{
      ...styles.container,
      backgroundColor: theme.colors.background
    }}>
      <ScrollView>
        {/* Header */}
        <Surface style={{
          ...styles.header,
          backgroundColor: theme.colors.surface
        }} elevation={1}>
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
                mode="outlined" 
                onPress={() => setSignInModalVisible(true)} 
                style={styles.signInButton}
                compact
              >
                Sign In
              </Button>
            )}
            <Text variant="headlineMedium" style={{
              fontFamily: 'DancingScript',
              color: theme.colors.primary
            }}>
              Andi AI Agent
            </Text>
            <View />
          </View>
        </Surface>

        {/* Scoreboard */}
        <Surface style={{
          ...styles.section,
          backgroundColor: theme.colors.surface
        }} elevation={1}>
          <View style={styles.scoreboardContainer}>
            {isLoggedIn && isBniConnected ? (
              <Link href="/received-referrals" asChild>
                <TouchableRipple style={isSmallScreen ? { width: '100%' } : undefined}>
                  <View style={styles.scoreCard}>
                    <Text 
                      variant={isSmallScreen ? "titleLarge" : "headlineMedium"} 
                      style={styles.scoreValue}
                    >
                      {referralsReceived}
                    </Text>
                    <Text 
                      variant={isSmallScreen ? "bodyMedium" : "titleSmall"} 
                      style={styles.scoreLabel}
                      numberOfLines={2}
                    >
                      Referrals Received
                    </Text>
                  </View>
                </TouchableRipple>
              </Link>
            ) : (
              <View style={{
                ...styles.scoreCard,
                ...(isSmallScreen ? { width: '100%' } : {})
              }}>
                <Text 
                  variant={isSmallScreen ? "titleLarge" : "headlineMedium"} 
                  style={{
                    ...styles.scoreValue,
                    ...(!isLoggedIn ? { color: theme.colors.onSurfaceDisabled } : {})
                  }}
                >
                  0
                </Text>
                <Text 
                  variant={isSmallScreen ? "bodyMedium" : "titleSmall"} 
                  style={{
                    ...styles.scoreLabel,
                    ...(!isLoggedIn ? { color: theme.colors.onSurfaceDisabled } : {})
                  }}
                  numberOfLines={2}
                >
                  Referrals Received
                </Text>
              </View>
            )}
            
            <View style={{
              ...styles.scoreCard,
              ...styles.middleCard,
              ...(isSmallScreen ? { width: '100%' } : styles.middleCardDesktop)
            }}>
              <Text 
                variant={isSmallScreen ? "titleLarge" : "headlineMedium"} 
                style={[styles.scoreValue, !isLoggedIn && { color: theme.colors.onSurfaceDisabled }]}
              >
                {isLoggedIn ? referralsGiven : '0'}
              </Text>
              <Text 
                variant={isSmallScreen ? "bodyMedium" : "titleSmall"} 
                style={[styles.scoreLabel, !isLoggedIn && { color: theme.colors.onSurfaceDisabled }]}
                numberOfLines={2}
              >
                Referrals Given
              </Text>
            </View>
            
            {isLoggedIn && isFacebookConnected ? (
              <Link href="/opportunities" asChild>
                <TouchableRipple style={isSmallScreen ? { width: '100%' } : undefined}>
                  <View style={styles.scoreCard}>
                    <Text 
                      variant={isSmallScreen ? "titleLarge" : "headlineMedium"} 
                      style={styles.scoreValue}
                    >
                      {opportunities}
                    </Text>
                    <Text 
                      variant={isSmallScreen ? "bodyMedium" : "titleSmall"} 
                      style={styles.scoreLabel}
                      numberOfLines={2}
                    >
                      Opportunities
                    </Text>
                  </View>
                </TouchableRipple>
              </Link>
            ) : (
              <View style={{
                ...styles.scoreCard,
                ...(isSmallScreen ? { width: '100%' } : {})
              }}>
                <Text 
                  variant={isSmallScreen ? "titleLarge" : "headlineMedium"} 
                  style={{
                    ...styles.scoreValue,
                    ...(!isLoggedIn ? { color: theme.colors.onSurfaceDisabled } : {})
                  }}
                >
                  0
                </Text>
                <Text 
                  variant={isSmallScreen ? "bodyMedium" : "titleSmall"} 
                  style={{
                    ...styles.scoreLabel,
                    ...(!isLoggedIn ? { color: theme.colors.onSurfaceDisabled } : {})
                  }}
                  numberOfLines={2}
                >
                  Opportunities
                </Text>
              </View>
            )}
          </View>
        </Surface>

        {/* Referral Opportunities */}
        <Surface style={{
          ...styles.section,
          backgroundColor: theme.colors.surface
        }} elevation={1}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Opportunities</Text>
            {isFacebookConnected && isLoggedIn && (
              <View style={styles.facebookConnectedBadge}>
                <Ionicons name="logo-facebook" size={16} color="#1877F2" style={styles.facebookIcon} />
                <Text variant="labelSmall" style={styles.facebookConnectedText}>
                  Connected
                </Text>
              </View>
            )}
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
        <Surface style={{
          ...styles.section,
          ...styles.lastSection,
          backgroundColor: theme.colors.surface
        }} elevation={1}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>Referral Partners</Text>
              <Link href="/add-partner" asChild>
                <TouchableRipple 
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 12,
                    backgroundColor: '#E8F5E9',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 8
                  }}
                  borderless
                >
                  <Ionicons name="add" size={16} color="#003767" />
                </TouchableRipple>
              </Link>
            </View>
            {isBniConnected ? (
              <View style={styles.bniConnectedContainer}>
                <View style={styles.bniConnectedBadge}>
                  <Ionicons name="briefcase" size={16} color="#003767" style={styles.bniIcon} />
                  <Text variant="labelSmall" style={styles.bniConnectedText}>
                    Connected ({totalPartners}/{maxPartners})
                  </Text>
                </View>
                {bniPartners.length > 0 && (
                  <TouchableRipple 
                    onPress={handleGoToBniMembers} 
                    style={styles.viewBniButton}
                    borderless
                  >
                    <Ionicons name="search" size={16} color="#003767" />
                  </TouchableRipple>
                )}
              </View>
            ) : (
              <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                0/0
              </Text>
            )}
          </View>

          {!isBniConnected ? (
            <>
              <View style={{ 
                flexDirection: isSmallScreen ? 'column' : 'row', 
                paddingHorizontal: 20, 
                gap: isSmallScreen ? 0 : 20 
              }}>
                <Card style={{ 
                  flex: isSmallScreen ? 0 : 1, 
                  marginBottom: 15
                }}>
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
                
                {manuallyAddedPartners.length > 0 && (
                  <Card style={{ 
                    flex: isSmallScreen ? 0 : 1, 
                    marginBottom: 15
                  }}>
                    <Card.Content>
                      <Text variant="titleMedium" style={{ marginBottom: 10, color: theme.colors.onSurface }}>
                        Your Partners ({manuallyAddedPartners.length})
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
                        {manuallyAddedPartners.map((partner) => (
                          <Card key={`manual_${partner.id}`} style={styles.partnerCard} mode="outlined">
                            <Card.Content style={styles.partnerCardContent}>
                              <Image
                                source={{ uri: partner.image }}
                                style={styles.partnerImage}
                              />
                              <Text variant="titleMedium" style={{
                                ...styles.partnerName,
                                color: theme.colors.onSurface
                              }}>
                                {partner.name || partner.email}
                              </Text>
                              <Text variant="bodySmall" style={{
                                ...styles.partnerBusiness,
                                color: theme.colors.onSurfaceVariant
                              }}>
                                {partner.business || 'Pending Invitation'}
                              </Text>
                            </Card.Content>
                          </Card>
                        ))}
                      </ScrollView>
                    </Card.Content>
                  </Card>
                )}
              </View>
            </>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.partnersScroll}>
                {allDisplayablePartners.length > 0 ? (
                  allDisplayablePartners.map((partner) => (
                    <Card key={`partner_${partner.id}`} style={styles.partnerCard} mode="outlined">
                      <Card.Content style={styles.partnerCardContent}>
                        <Image
                          source={{ uri: partner.image }}
                          style={styles.partnerImage}
                        />
                        <Text variant="titleMedium" style={{
                          ...styles.partnerName,
                          color: theme.colors.onSurface
                        }}>
                          {partner.name || partner.email}
                        </Text>
                        <Text variant="bodySmall" style={{
                          ...styles.partnerBusiness,
                          color: theme.colors.onSurfaceVariant
                        }}>
                          {partner.business || 'Pending Invitation'}
                        </Text>
                      </Card.Content>
                    </Card>
                  ))
                ) : (
                  <Card style={[styles.partnerCard, { width: 200 }]} mode="outlined">
                    <Card.Content style={styles.partnerCardContent}>
                      <Text variant="bodyMedium" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                        No partners found. Try reconnecting to BNI.
                      </Text>
                    </Card.Content>
                  </Card>
                )}
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