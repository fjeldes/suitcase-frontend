import { useTheme } from '@/hooks/useTheme';
import { usePayment } from '@/hooks/usePayment';
import { paymentService } from '@/services/paymentServices';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function PaymentMethodsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setupPaymentSheet, loading: isSettingUp } = usePayment();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { data: cards, isLoading, isFetching } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentService.getSavedCards(),
  });

  const handleAddCard = async () => {
    const result = await setupPaymentSheet();
    if (result.success) {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    }
  };

  const renderCard = ({ item }: { item: any }) => (
    <View style={s.cardItem}>
      <View style={s.cardIconBox}>
        <Ionicons
          name={item.brand === 'visa' ? 'card' : 'card-outline'}
          size={24}
          color={colors.iconColor}
        />
      </View>
      <View style={s.cardInfo}>
        <Text style={s.cardNumber}>•••• •••• •••• {item.last4}</Text>
        <Text style={s.cardBrand}>
          {item.brand?.toUpperCase()} • {t('payment.expires')} {item.expMonth}/{item.expYear}
        </Text>
      </View>
      {item.isDefault && (
        <View style={s.defaultBadge}>
          <Text style={s.defaultBadgeText}>{t('payment.default')}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.push('/(client)/profile')} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('profile.payment_methods')}</Text>
        <Ionicons name="lock-closed-outline" size={22} color={colors.iconColor} />
      </View>

      <View style={s.container}>
        <Text style={s.secureWallet}>{t('payment.secure_wallet')}</Text>
        <Text style={s.mainTitle}>{t('payment.saved_cards')}</Text>
        <Text style={s.description}>
          {t('payment.manage_desc')}
        </Text>

        {isLoading || isFetching ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={colors.iconColor} />
          </View>
        ) : cards && cards.length > 0 ? (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            contentContainerStyle={s.listContent}
          />
        ) : (
          <View style={s.emptyCard}>
            <View style={s.walletIconContainer}>
              <View style={s.walletIconInner}>
                <Ionicons name="wallet-outline" size={40} color={colors.iconColor} />
              </View>
            </View>

            <Text style={s.emptyTitle}>{t('payment.no_cards')}</Text>
            <Text style={s.emptySubtitle}>
              {t('payment.no_cards_desc')}
            </Text>

            <TouchableOpacity
              style={[s.primaryAddBtn, isSettingUp && s.disabledBtn]}
              onPress={handleAddCard}
              disabled={isSettingUp}
            >
              {isSettingUp ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={s.primaryAddBtnText}>{t('payment.add_method')}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {cards && cards.length > 0 && (
          <TouchableOpacity
            style={[s.floatingAddBtn, isSettingUp && s.disabledBtn]}
            onPress={handleAddCard}
            disabled={isSettingUp}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceCardLow },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  secureWallet: { fontSize: 12, fontWeight: '800', color: colors.warning, letterSpacing: 1, marginBottom: 8 },
  mainTitle: { fontSize: 34, fontWeight: '900', color: colors.textPrimary, marginBottom: 16 },
  description: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center' },
  emptyCard: { backgroundColor: colors.surfaceCard, borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  walletIconContainer: { width: 100, height: 100, backgroundColor: colors.surfaceLight, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  walletIconInner: { width: 70, height: 70, backgroundColor: colors.surfaceCard, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 30, paddingHorizontal: 10 },
  primaryAddBtn: { backgroundColor: colors.primary, flexDirection: 'row', height: 58, borderRadius: 18, width: '100%', justifyContent: 'center', alignItems: 'center' },
  primaryAddBtnText: { color: colors.textInverse, fontSize: 16, fontWeight: '700' },
  listContent: { paddingBottom: 20 },
  cardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceCard, padding: 18, borderRadius: 22, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  cardIconBox: { width: 50, height: 50, backgroundColor: colors.surfaceCard, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1 },
  cardNumber: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardBrand: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  defaultBadge: { backgroundColor: colors.successLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  defaultBadgeText: { color: colors.success, fontSize: 10, fontWeight: '800' },
  floatingAddBtn: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  disabledBtn: { backgroundColor: colors.iconMuted },
});
