import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface Member {
  id: string;
  name: string;
  business: string;
  slogan: string;
  category: string;
  image: string;
}

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    business: 'Evergreen Financial Planning',
    slogan: 'Building Wealth, Securing Futures',
    category: 'Financial Advisor',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80'
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    business: 'Elite Real Estate Group',
    slogan: 'Your Dream Home Awaits',
    category: 'Real Estate Agent',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80'
  },
  {
    id: '3',
    name: 'Jennifer Park',
    business: 'Bright Smile Dental',
    slogan: 'Creating Beautiful Smiles Daily',
    category: 'Dentist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
  },
  {
    id: '4',
    name: 'David Thompson',
    business: 'Thompson Law Firm',
    slogan: 'Justice Served with Excellence',
    category: 'Business Attorney',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80'
  },
  {
    id: '5',
    name: 'Lisa Martinez',
    business: 'Digital Marketing Solutions',
    slogan: 'Growing Your Digital Presence',
    category: 'Digital Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80'
  },
  {
    id: '6',
    name: 'Robert Kim',
    business: 'InsureRight',
    slogan: 'Protection for What Matters Most',
    category: 'Insurance Broker',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  },
  {
    id: '7',
    name: 'Emily Watson',
    business: 'Watson Web Development',
    slogan: 'Bringing Your Vision to Life',
    category: 'Web Developer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80'
  },
  {
    id: '8',
    name: 'James Wilson',
    business: 'Elite Mortgage Solutions',
    slogan: 'Making Homeownership Possible',
    category: 'Mortgage Broker',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80'
  },
  {
    id: '9',
    name: 'Maria Garcia',
    business: 'Healthy Life Chiropractic',
    slogan: 'Align Your Life with Wellness',
    category: 'Chiropractor',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80'
  },
  {
    id: '10',
    name: 'Thomas Anderson',
    business: 'Anderson IT Solutions',
    slogan: 'Technology Made Simple',
    category: 'IT Services',
    image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&q=80'
  },
  {
    id: '11',
    name: 'Rachel Green',
    business: 'Green Interior Design',
    slogan: 'Transform Your Space',
    category: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80'
  },
  {
    id: '12',
    name: 'Kevin Patel',
    business: 'Patel Accounting',
    slogan: 'Numbers You Can Trust',
    category: 'CPA',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80'
  },
  {
    id: '13',
    name: 'Amanda Lee',
    business: 'Social Media Mastery',
    slogan: 'Elevating Your Social Presence',
    category: 'Social Media Manager',
    image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=400&q=80'
  },
];

export default function Success() {
  const [loadedMembers, setLoadedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading members gradually
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < MEMBERS.length) {
        setLoadedMembers(prev => [...prev, MEMBERS[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setLoading(false);
        // Navigate to dashboard after all members are loaded
        setTimeout(() => {
          router.replace('/(app)');
        }, 2000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient
      colors={['#4A90E2', '#357ABD']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Importing Your Network</Text>
        <Text style={styles.subtitle}>
          Andi is importing your BNI chapter members as referral partners
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {loadedMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <Image
              source={{ uri: member.image }}
              style={styles.memberImage}
            />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.businessName}>{member.business}</Text>
              <Text style={styles.slogan}>{member.slogan}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{member.category}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>
            Loading members ({loadedMembers.length}/{MEMBERS.length})
          </Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollContent: {
    padding: 15,
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  slogan: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
});