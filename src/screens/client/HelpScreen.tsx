import { faqService, FAQ } from '@/services/faqService';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';

export default function HelpScreen() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);

  const { data: faqs, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqService.getAll(),
  });

  const groupedFaqs = useMemo(() => {
    if (!faqs) return {};
    const groups: Record<string, FAQ[]> = {};
    faqs.forEach((faq) => {
      if (!groups[faq.category]) groups[faq.category] = [];
      groups[faq.category].push(faq);
    });
    return groups;
  }, [faqs]);

  const categoryLabels: Record<string, string> = {
    general: 'General',
    bookings: 'Bookings',
    payments: 'Payments',
    account: 'Account',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconBox}>
            <Ionicons name="help-buoy-outline" size={32} color="#0A0E5E" />
          </View>
          <Text style={styles.heroTitle}>How can we help you?</Text>
          <Text style={styles.heroSubtitle}>
            Find answers to common questions or contact our support team.
          </Text>
        </View>

        {/* FAQs */}
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0A0E5E" />
          </View>
        ) : faqs && faqs.length > 0 ? (
          Object.entries(groupedFaqs).map(([category, items]) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {categoryLabels[category] || category}
              </Text>
              <View style={styles.sectionCard}>
                {items.map((faq) => {
                  const isOpen = expandedId === faq.id;
                  return (
                    <View
                      key={faq.id}
                      style={[
                        styles.faqItem,
                        items.indexOf(faq) < items.length - 1 && styles.faqBorder,
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.faqHeader}
                        onPress={() => setExpandedId(isOpen ? null : faq.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                        <Ionicons
                          name={isOpen ? 'chevron-up' : 'chevron-down'}
                          size={20}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                      {isOpen && (
                        <View style={styles.faqAnswerWrap}>
                          <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyFaqs}>
            <Ionicons name="document-text-outline" size={48} color="#CBD5E0" />
            <Text style={styles.emptyFaqsText}>No FAQs available yet</Text>
          </View>
        )}

        {/* Contact Support */}
        <TouchableOpacity style={styles.contactCard} onPress={() => setShowContact(true)}>
          <View style={styles.contactIconBox}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0A0E5E" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactTitle}>Still need help?</Text>
            <Text style={styles.contactSubtitle}>Contact our support team</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
        </TouchableOpacity>
      </ScrollView>

      {/* Contact Modal */}
      <Modal visible={showContact} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Contact Support</Text>
            <Text style={styles.modalSubtitle}>
              Reach out to us and we'll get back to you within 24 hours.
            </Text>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => Linking.openURL('mailto:support@suitcase.app')}
            >
              <View style={styles.contactOptionIcon}>
                <Ionicons name="mail-outline" size={22} color="#0A0E5E" />
              </View>
              <View>
                <Text style={styles.contactOptionLabel}>Email</Text>
                <Text style={styles.contactOptionValue}>support@suitcase.app</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => Linking.openURL('tel:+1234567890')}
            >
              <View style={styles.contactOptionIcon}>
                <Ionicons name="call-outline" size={22} color="#0A0E5E" />
              </View>
              <View>
                <Text style={styles.contactOptionLabel}>Phone</Text>
                <Text style={styles.contactOptionValue}>+1 (234) 567-890</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeContactBtn}
              onPress={() => setShowContact(false)}
            >
              <Text style={styles.closeContactBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAFC' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { padding: 5 },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  center: { justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },

  // Hero
  heroSection: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  heroIconBox: {
    width: 72,
    height: 72,
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },

  // FAQ sections
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8898AA',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  faqItem: {},
  faqBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1A202C', marginRight: 12 },
  faqAnswerWrap: { paddingHorizontal: 16, paddingBottom: 16 },
  faqAnswer: { fontSize: 14, color: '#64748B', lineHeight: 20 },

  // Empty
  emptyFaqs: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  emptyFaqsText: { fontSize: 15, color: '#94A3B8' },

  // Contact card
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 20,
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  contactIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactTitle: { fontSize: 16, fontWeight: '700', color: '#1A202C' },
  contactSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },

  // Contact Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 24 },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#F8F9FB',
    borderRadius: 14,
    marginBottom: 10,
  },
  contactOptionIcon: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactOptionLabel: { fontSize: 14, fontWeight: '700', color: '#1A202C' },
  contactOptionValue: { fontSize: 13, color: '#64748B', marginTop: 2 },
  closeContactBtn: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  closeContactBtnText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
});
