import { View, StyleSheet, ScrollView } from 'react-native';
import { useTheme, Text, Surface, Card, Chip } from 'react-native-paper';
import { useReceivedReferralsStore } from '../../../store/received-referrals';
import { usePartnersStore } from '../../../store/partners';
import NavigationBar from '../components/NavigationBar';

export default function ReceivedReferrals() {
  const theme = useTheme();
  const referrals = useReceivedReferralsStore(state => state.referrals);
  const getPartnerById = usePartnersStore(state => state.getPartnerById);

  const getStatusColor = (status: 'pending' | 'accepted' | 'declined') => {
    switch (status) {
      case 'pending':
        return theme.colors.primary;
      case 'accepted':
        return theme.colors.tertiary;
      case 'declined':
        return theme.colors.error;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavigationBar />
      
      <ScrollView style={styles.content}>
        <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onSurface }}>Received Referrals</Text>
        </Surface>

        {referrals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text variant="bodyLarge" style={{ textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                You haven't received any referrals yet.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          referrals.map((referral) => {
            const partner = getPartnerById(referral.partnerId);
            return (
              <Card key={referral.id} style={styles.referralCard} mode="outlined">
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.partnerInfo}>
                      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                        {partner?.name}
                      </Text>
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {partner?.business}
                      </Text>
                    </View>
                    <Chip
                      mode="flat"
                      textStyle={{ color: theme.colors.onSurface }}
                      style={[styles.statusChip, { backgroundColor: getStatusColor(referral.status) + '20' }]}
                    >
                      {referral.status}
                    </Chip>
                  </View>

                  <View style={styles.customerInfo}>
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {referral.customerName}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                      {referral.customerEmail}
                    </Text>
                    {referral.customerPhone && (
                      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        {referral.customerPhone}
                      </Text>
                    )}
                  </View>

                  {referral.notes && (
                    <Text 
                      variant="bodyMedium" 
                      style={[styles.notes, { color: theme.colors.onSurfaceVariant }]}
                    >
                      {referral.notes}
                    </Text>
                  )}

                  <Text 
                    variant="labelSmall" 
                    style={[styles.date, { color: theme.colors.onSurfaceVariant }]}
                  >
                    Received: {new Date(referral.date).toLocaleDateString()}
                  </Text>
                </Card.Content>
              </Card>
            );
          })
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
  emptyCard: {
    margin: 12,
    padding: 20,
  },
  referralCard: {
    margin: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  partnerInfo: {
    flex: 1,
    marginRight: 12,
  },
  statusChip: {
    borderRadius: 12,
  },
  customerInfo: {
    marginBottom: 12,
  },
  notes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  date: {
    marginTop: 12,
  },
}); 