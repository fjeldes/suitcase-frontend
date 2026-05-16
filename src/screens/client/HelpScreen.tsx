import { faqService, FAQ } from '@/services/faqService';
import { useTheme } from '@/hooks/useTheme';
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
import { useTranslation } from 'react-i18next';

const CONTACT_EMAIL = 'support@suitcase.app';
const CONTACT_PHONE = '+1 (234) 567-890';

export default function HelpScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);
  const s = useMemo(() => createStyles(colors), [colors]);

  const { data: faqs, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => faqService.getAll(),
  });

  const groupedFaqs = useMemo(() => {
    if (!faqs) return {};
    const grouped: Record<string, FAQ[]> = {};
    faqs.forEach((faq: FAQ) => {
      const cat = faq.category || 'general';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(faq);
    });
    return grouped;
  }, [faqs]);

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.push('/(client)/profile')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('profile.help_support')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.iconColor} />}
      >
        <Text style={s.mainTitle}>{t('profile.help_support')}</Text>
        <Text style={s.description}>
          {t('help.find_answers')}
        </Text>

        {isLoading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color={colors.iconColor} />
          </View>
        ) : (
          Object.entries(groupedFaqs).map(([category, items]) => (
            <View key={category} style={s.section}>
              <Text style={s.sectionTitle}>{category.toUpperCase()}</Text>
              {items.map((faq) => {
                const isExpanded = expandedId === faq.id;
                return (
                  <TouchableOpacity
                    key={faq.id}
                    style={s.faqItem}
                    onPress={() => setExpandedId(isExpanded ? null : faq.id)}
                    activeOpacity={0.7}
                  >
                    <View style={s.faqHeader}>
                      <Text style={s.faqQuestion}>{faq.question}</Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.iconMuted} />
                    </View>
                    {isExpanded && <Text style={s.faqAnswer}>{faq.answer}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}

        <View style={s.contactCard}>
          <Ionicons name="headset" size={32} color={colors.primary} />
          <Text style={s.contactTitle}>{t('help.still_need_help')}</Text>
          <Text style={s.contactDesc}>{t('help.contact_desc')}</Text>

          <TouchableOpacity style={s.contactBtn} onPress={() => setShowContact(true)}>
            <Ionicons name="mail-outline" size={20} color="#FFF" />
            <Text style={s.contactBtnText}>{t('help.contact_us')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showContact} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>{t('profile.contact_us')}</Text>
            <Text style={s.modalDesc}>{t('help.reach_out')}</Text>

            <TouchableOpacity style={s.contactOption} onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}>
              <View style={[s.contactIconBox, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons name="mail-outline" size={22} color={colors.iconColor} />
              </View>
              <View>
                <Text style={s.contactLabel}>{t('help.email')}</Text>
                <Text style={s.contactValue}>{CONTACT_EMAIL}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.contactOption} onPress={() => Linking.openURL(`tel:${CONTACT_PHONE}`)}>
              <View style={[s.contactIconBox, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons name="call-outline" size={22} color={colors.iconColor} />
              </View>
              <View>
                <Text style={s.contactLabel}>{t('help.phone')}</Text>
                <Text style={s.contactValue}>{CONTACT_PHONE}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.closeBtn} onPress={() => setShowContact(false)}>
              <Text style={s.closeBtnText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceCardLow },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  scrollContent: { padding: 24, paddingBottom: 40 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  description: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 24 },
  center: { paddingVertical: 40, alignItems: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: colors.textMuted, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' },
  faqItem: { backgroundColor: colors.surfaceCard, borderRadius: 16, padding: 16, marginBottom: 10 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, flex: 1, marginRight: 12 },
  faqAnswer: { fontSize: 14, color: colors.textMuted, lineHeight: 20, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
  contactCard: { backgroundColor: colors.surfaceCard, borderRadius: 24, padding: 24, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: colors.border },
  contactTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 12, marginBottom: 8 },
  contactDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  contactBtn: { backgroundColor: colors.primary, flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, alignItems: 'center', gap: 8 },
  contactBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surfaceModal, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  modalDesc: { fontSize: 14, color: colors.textMuted, marginBottom: 24, lineHeight: 20 },
  contactOption: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, marginBottom: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  contactIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  contactValue: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  closeBtn: { padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center', marginTop: 8 },
  closeBtnText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
});
