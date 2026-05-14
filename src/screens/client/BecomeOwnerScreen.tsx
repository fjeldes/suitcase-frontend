import { useBecomeOwner } from '@/hooks/useBecomeOwner';
import { ROUTES } from '@/constants/routes';
import { termsService } from '@/services/termsService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: 'cash-outline' as const,
    family: 'Ionicons',
    title: 'Earn passive income',
    desc: 'Hosts earn an average of $5,400+ per year just from their unused space.',
    accent: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    icon: 'pricetag-outline' as const,
    family: 'Ionicons',
    title: 'Set your own prices',
    desc: 'You decide how much to charge per bag size per day. Full control, always.',
    accent: '#6366F1',
    bg: '#EEF2FF',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    family: 'Ionicons',
    title: 'Secure & Insured',
    desc: 'Every booking is backed by our protection policy. Peace of mind for you and your guests.',
    accent: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: 'star-outline' as const,
    family: 'Ionicons',
    title: 'World class vetting',
    desc: 'Our review system ensures only trustworthy travelers use your space.',
    accent: '#0EA5E9',
    bg: '#F0F9FF',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'List your space',
    desc: 'Add your location, set capacity and pricing in under 5 minutes.',
  },
  {
    number: '02',
    title: 'Approve requests',
    desc: 'Review and confirm bookings. Accept travelers you trust.',
  },
  {
    number: '03',
    title: 'Start earning',
    desc: 'Receive payouts directly. No middlemen, no hassle.',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statBadge}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FeatureCard({ item }: { item: (typeof FEATURES)[0] }) {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.featureIconBox, { backgroundColor: item.bg }]}>
        <Ionicons name={item.icon} size={26} color={item.accent} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDesc}>{item.desc}</Text>
      </View>
    </View>
  );
}

function StepRow({ step, isLast }: { step: (typeof STEPS)[0]; isLast: boolean }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepLeft}>
        <View style={styles.stepNumberBox}>
          <Text style={styles.stepNumber}>{step.number}</Text>
        </View>
        {!isLast && <View style={styles.stepLine} />}
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BecomeOwnerScreen() {
  const router = useRouter();
  const { mutate: becomeOwner, isPending } = useBecomeOwner();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [termsModal, setTermsModal] = useState(false);
  const [ownerTerms, setOwnerTerms] = useState<any>(null);
  const [loadingTerms, setLoadingTerms] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleGetStarted = async () => {
    setLoadingTerms(true);
    try {
      const terms = await termsService.getLatest('owner');
      setOwnerTerms(terms);
      setTermsModal(true);
    } catch {
      becomeOwner(undefined, {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Welcome, Partner!', text2: "You're now a Secure Custodian host. Let's create your first storage location." });
          router.replace(ROUTES.OWNER.CREATE_LOCATION);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
          Toast.show({ type: 'error', text1: 'Error', text2: msg });
        },
      });
    } finally {
      setLoadingTerms(false);
    }
  };

  const handleAcceptTerms = async () => {
    if (!ownerTerms) return;
    try {
      await termsService.accept(ownerTerms.id);
      setTermsModal(false);
      becomeOwner(undefined, {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Welcome, Partner!', text2: "You're now a Secure Custodian host. Let's create your first storage location." });
          router.replace(ROUTES.OWNER.CREATE_LOCATION);
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Something went wrong. Please try again.';
          Toast.show({ type: 'error', text1: 'Error', text2: msg });
        },
      });
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not accept terms. Please try again.' });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Floating header (appears on scroll) */}
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={() => router.navigate('/(client)/profile')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.floatingTitle}>Become a Partner</Text>
        <View style={{ width: 36 }} />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {/* ── HERO ── */}
        <LinearGradient colors={['#0A0E5E', '#1A237E', '#283593']} style={styles.hero}>
          <TouchableOpacity onPress={() => router.navigate('/(client)/profile')} style={styles.heroBack}>
            <Ionicons name="arrow-back" size={22} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#22C55E" />
            <Text style={styles.heroBadgeText}>Secure Custodian Partner</Text>
          </View>

          <Text style={styles.heroTitle}>
            Turn your unused{'\n'}space into{'\n'}
            <Text style={styles.heroTitleAccent}>guaranteed income.</Text>
          </Text>

          <Text style={styles.heroSub}>
            Join the only luggage-storage platform that pays you fairly, protects your space, and connects you with verified global travelers.
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatBadge value="$5,400+" label="Avg yearly earnings" />
            <View style={styles.statDivider} />
            <StatBadge value="4.9★" label="Partner rating" />
            <View style={styles.statDivider} />
            <StatBadge value="100%" label="Free to join" />
          </View>
        </LinearGradient>

        {/* ── WHY SECTION ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>WHY HOST WITH US</Text>
          <Text style={styles.sectionTitle}>Everything you need,{'\n'}nothing you don't.</Text>

          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} item={f} />
            ))}
          </View>
        </View>

        {/* ── EARNINGS HIGHLIGHT ── */}
        <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.earningsCard}>
          <View style={styles.earningsLeft}>
            <Text style={styles.earningsLabel}>AVERAGE EARNINGS</Text>
            <Text style={styles.earningsAmount}>$5,400</Text>
            <Text style={styles.earningsSub}>per year · per location</Text>
          </View>
          <View style={styles.earningsRight}>
            <MaterialCommunityIcons name="trending-up" size={48} color="#22C55E" />
          </View>
        </LinearGradient>

        {/* ── GETTING STARTED ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
          <Text style={styles.sectionTitle}>Getting started{'\n'}is seamless.</Text>

          <View style={styles.stepsContainer}>
            {STEPS.map((step, i) => (
              <StepRow key={step.number} step={step} isLast={i === STEPS.length - 1} />
            ))}
          </View>
        </View>

        {/* ── CTA ── */}
        <LinearGradient colors={['#FF6B00', '#FF8F00']} style={styles.ctaCard}>
          <MaterialCommunityIcons name="shield-lock" size={40} color="rgba(255,255,255,0.9)" style={{ marginBottom: 16 }} />
          <Text style={styles.ctaTitle}>Ready to become a{'\n'}Custodian?</Text>
          <Text style={styles.ctaSub}>
            It takes less than 5 minutes to list your first space. No commitment required.
          </Text>
          <TouchableOpacity
            style={[styles.ctaButton, isPending && { opacity: 0.7 }]}
            onPress={handleGetStarted}
            disabled={isPending}
            activeOpacity={0.85}
          >
            {isPending ? (
              <ActivityIndicator color="#FF6B00" />
            ) : (
              <>
                <Text style={styles.ctaButtonText}>Get Started Now</Text>
                <Ionicons name="arrow-forward" size={20} color="#FF6B00" />
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Terms Modal */}
      <Modal visible={termsModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32,
            padding: 24, paddingBottom: 40, maxHeight: '80%',
          }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 }} />
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0A0E5E', marginBottom: 4 }}>Terms & Conditions</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>Version {ownerTerms?.version} - Owner Agreement</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
              <Text style={{ fontSize: 14, color: '#1A202C', lineHeight: 22 }}>{ownerTerms?.content}</Text>
            </ScrollView>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity
                style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' }}
                onPress={() => setTermsModal(false)}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center' }}
                onPress={handleAcceptTerms}
              >
                <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },

  // Floating header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  floatingTitle: { fontSize: 16, fontWeight: '700', color: '#0A0E5E' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Hero
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  heroBack: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  heroBadgeText: { color: '#22C55E', fontWeight: '700', fontSize: 12, letterSpacing: 0.5 },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroTitleAccent: { color: '#FF6B00' },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
    marginBottom: 28,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  statBadge: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3, textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },

  // Section
  section: { paddingHorizontal: 24, paddingVertical: 36 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF6B00',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0A0E5E',
    lineHeight: 36,
    marginBottom: 28,
  },

  // Features
  featuresGrid: { gap: 12 },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    alignItems: 'flex-start',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: '#0A0E5E', marginBottom: 4 },
  featureDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },

  // Earnings
  earningsCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningsLeft: {},
  earningsLabel: { fontSize: 10, fontWeight: '700', color: '#16A34A', letterSpacing: 1.2, marginBottom: 4 },
  earningsAmount: { fontSize: 42, fontWeight: '900', color: '#0A0E5E' },
  earningsSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  earningsRight: {},

  // Steps
  stepsContainer: { gap: 0 },
  stepRow: { flexDirection: 'row', gap: 16, minHeight: 80 },
  stepLeft: { alignItems: 'center', width: 44 },
  stepNumberBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A0E5E',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumber: { color: '#fff', fontWeight: '800', fontSize: 13 },
  stepLine: { width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 6 },
  stepContent: { flex: 1, paddingBottom: 28, paddingTop: 8 },
  stepTitle: { fontSize: 17, fontWeight: '700', color: '#0A0E5E', marginBottom: 4 },
  stepDesc: { fontSize: 13, color: '#64748B', lineHeight: 18 },

  // CTA
  ctaCard: {
    marginHorizontal: 24,
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 12,
  },
  ctaSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  ctaButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaButtonText: { fontSize: 16, fontWeight: '800', color: '#FF6B00' },
});
