import { usePayment } from '@/hooks/usePayment';
import { paymentService } from '@/services/paymentServices';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setupPaymentSheet, loading: isSettingUp } = usePayment();

  const { data: cards, isLoading } = useQuery({
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
    <View style={styles.cardItem}>
      <View style={styles.cardIconBox}>
        {/* Usamos el brand que viene directo del objeto mapeado */}
        <Ionicons
          name={item.brand === 'visa' ? 'card' : 'card-outline'}
          size={24}
          color="#0A0E5E"
        />
      </View>
      <View style={styles.cardInfo}>
        {/* Cambiamos item.card.last4 por item.last4 */}
        <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
        <Text style={styles.cardBrand}>
          {item.brand?.toUpperCase()} • Expires {item.expMonth}/{item.expYear}
        </Text>
      </View>
      {/* Si decides implementar lógica de default después */}
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>DEFAULT</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Payment Methods</Text>
        <Ionicons name="lock-closed-outline" size={22} color="#0A0E5E" />
      </View>

      <View style={styles.container}>
        <Text style={styles.secureWallet}>SECURE WALLET</Text>
        <Text style={styles.mainTitle}>Saved Cards</Text>
        <Text style={styles.description}>
          Manage your payment methods securely. All transactions are encrypted with bank-level security.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0A0E5E" />
          </View>
        ) : cards && cards.length > 0 ? (
          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            renderItem={renderCard}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          /* EMPTY STATE CARD (AS IN IMAGE) */
          <View style={styles.emptyCard}>
            <View style={styles.walletIconContainer}>
              <View style={styles.walletIconInner}>
                <Ionicons name="wallet-outline" size={40} color="#0A0E5E" />
              </View>
            </View>

            <Text style={styles.emptyTitle}>No cards saved yet</Text>
            <Text style={styles.emptySubtitle}>
              It looks like you haven't added any payment methods to your account for faster checkouts.
            </Text>

            <TouchableOpacity
              style={[styles.primaryAddBtn, isSettingUp && styles.disabledBtn]}
              onPress={handleAddCard}
              disabled={isSettingUp}
            >
              {isSettingUp ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Ionicons name="card-outline" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={styles.primaryAddBtnText}>Add Payment Method</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Floating Add Button only shows if there are cards already */}
        {cards && cards.length > 0 && (
          <TouchableOpacity
            style={[styles.floatingAddBtn, isSettingUp && styles.disabledBtn]}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0E5E',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  secureWallet: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C05621', // Naranja/Marrón de la imagen
    letterSpacing: 1,
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0A0E5E',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  walletIconContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#EDF2F7',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  walletIconInner: {
    width: 70,
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0E5E',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  primaryAddBtn: {
    backgroundColor: '#111860',
    flexDirection: 'row',
    height: 58,
    borderRadius: 18,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryAddBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 20,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardIconBox: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  cardBrand: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  defaultBadge: {
    backgroundColor: '#EDFDFD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultBadgeText: {
    color: '#319795',
    fontSize: 10,
    fontWeight: '800',
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111860',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
});
