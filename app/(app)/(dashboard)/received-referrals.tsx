import { View, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme, Text, Surface, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../components/NavigationBar';
import { useReceivedReferralsStore } from '../../../store/received-referrals';
import { usePartnersStore } from '../../../store/partners';
import { usePostsStore } from '../../../store/posts';
import { useProfileStore } from '../../../store/profile';
import AccessDeniedScreen from '../../../components/AccessDeniedScreen';

// Helper function moved directly to the component
const isUserConnectedToBNI = (): boolean => {
  const profile = useProfileStore.getState().profile;
  const isAuthenticated = profile.email !== 'pat@example.com';
  // Only check for BNI connection, not Facebook connection
  return isAuthenticated && profile.business === 'BNI Member Business';
};

export default function ReceivedReferrals() {
  const theme = useTheme();
  const referrals = useReceivedReferralsStore(state => state.referrals);
  const getPartnerById = usePartnersStore(state => state.getPartnerById);
  const getPostById = usePostsStore(state => state.getPostById);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the user has BNI access
    setIsAuthorized(isUserConnectedToBNI());
  }, []);

  // If user doesn't have BNI access, show Access Denied screen
  if (!isAuthorized) {
    return <AccessDeniedScreen type="bni" />;
  }

  const getSourceIcon = (source: 'facebook' | 'instagram' | 'linkedin' | 'nextdoor' | 'alignable') => {
    switch (source) {
      case 'facebook': return 'logo-facebook';
      case 'instagram': return 'logo-instagram';
      case 'linkedin': return 'logo-linkedin';
      case 'nextdoor': return 'home-outline';
      case 'alignable': return 'business-outline';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Received Referrals</Text>
        </Surface>

        {referrals.map((referral) => {
          const partner = getPartnerById(referral.partnerId);
          const opportunity = getPostById(referral.referralOpportunityId);
          
          if (!partner || !opportunity) return null;

          const referralComment = opportunity.comments_list?.find(
            comment => comment.id === referral.referralPostId
          );

          return (
            <Card key={referral.id} style={styles.referralCard} mode="outlined">
              <Card.Content>
                {/* Partner Info */}
                <View style={styles.partnerSection}>
                  <View style={styles.partnerHeader}>
                    <Text variant="titleMedium">From Partner</Text>
                  </View>
                  <View style={styles.partnerInfo}>
                    <Text variant="titleLarge">{partner.name}</Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {partner.business}
                    </Text>
                  </View>
                </View>

                {/* Original Post */}
                <View style={styles.opportunitySection}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>Original Request</Text>
                  <View style={styles.postHeader}>
                    <Ionicons 
                      name={getSourceIcon(opportunity.source)} 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                    <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                      {opportunity.timestamp}
                    </Text>
                  </View>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {opportunity.content}
                  </Text>
                </View>

                {/* Referral Comment */}
                {referralComment && (
                  <View style={styles.referralSection}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Referral Message</Text>
                    <Surface 
                      style={[styles.referralMessage, { backgroundColor: theme.colors.surfaceVariant }]} 
                      elevation={0}
                    >
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                        {referralComment.content}
                      </Text>
                      <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                        {referralComment.timestamp}
                      </Text>
                    </Surface>
                  </View>
                )}

                <Text variant="labelSmall" style={styles.date}>
                  Received {referral.date}
                </Text>
              </Card.Content>
            </Card>
          );
        })}
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
  referralCard: {
    margin: 12,
  },
  partnerSection: {
    marginBottom: 20,
  },
  partnerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  partnerInfo: {
    marginBottom: 8,
  },
  opportunitySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  referralSection: {
    marginBottom: 16,
  },
  referralMessage: {
    padding: 16,
    borderRadius: 8,
  },
  date: {
    textAlign: 'right',
    marginTop: 8,
    color: '#666',
  },
}); 