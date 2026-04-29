import { useCreateBooking } from '@/hooks/useCreateBooking'
import { useStoreDetail } from '@/hooks/useStoreDetail'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

interface Props {
  storeId: string | string[]
}

export default function BookingDetail({ storeId }: Props) {
  const router = useRouter()

  // Hooks de datos y mutación
  const { data: store, isLoading, error } = useStoreDetail(storeId)
  const { mutate: createBooking, isPending } = useCreateBooking()

  // Estados de maletas inicializados en 0
  const [bags, setBags] = useState({
    small: 0,
    medium: 0,
    large: 0,
  })

  // Resetear maletas si cambia el store o carga inicialmente
  useEffect(() => {
    if (store) {
      setBags({ small: 0, medium: 0, large: 0 })
    }
  }, [store])

  // Fechas por defecto
  const [startDate] = useState(new Date())
  const [endDate] = useState(new Date(new Date().getTime() + 8 * 60 * 60 * 1000))

  // Cálculo de precio total basado en disponibilidad real
  const totalPrice = useMemo(() => {
    if (!store || !store.pricePerDay) return 0

    const smallPrice = store.pricePerDay.small || 0
    const mediumPrice = store.pricePerDay.medium || 0
    const largePrice = store.pricePerDay.large || 0

    return bags.small * smallPrice + bags.medium * mediumPrice + bags.large * largePrice
  }, [bags, store])

  const updateQuantity = (type: keyof typeof bags, delta: number) => {
    const newValue = bags[type] + delta

    if (newValue < 0) return

    // USAMOS availability QUE VIENE DEL BACKEND (Capacidad - Ocupado)
    const limit = store?.availability?.[type] ?? 0

    if (newValue > limit) {
      Alert.alert(
        'No Space Available',
        `Sorry, this location only has ${limit} ${type} slots left.`,
      )
      return
    }

    setBags({ ...bags, [type]: newValue })
  }

  const handleConfirm = () => {
    if (isPending || totalPrice === 0) return

    createBooking({
      locationId: Array.isArray(storeId) ? storeId[0] : storeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      items: bags,
    })
  }

  if (isLoading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A0E5E" />
      </View>
    )

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading store details</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={{
              uri:
                store?.image ||
                'https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=1000&auto=format&fit=crop',
            }}
            style={styles.bannerImage}
          />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#0A0E5E" />
          </TouchableOpacity>

          <View style={styles.headerInfoCard}>
            <Text style={styles.storeName}>{store?.name || 'Loading...'}</Text>
            <Text style={styles.subInfo}>
              <Ionicons name="navigate" size={14} color="#0A0E5E" /> {store?.address?.split(',')[0]}{' '}
              • 24/7 Access
            </Text>
          </View>
        </View>

        {/* INFO BARS */}
        <View style={styles.statsContainer}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}> 4.9 (128 Reviews)</Text>
          </View>
        </View>

        {/* SECURITY SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#0A0E5E" />
            <Text style={styles.sectionTitle}> Security</Text>
          </View>
          <View style={styles.securityGrid}>
            <Text style={styles.securityItem}>• 24/7 CCTV Monitoring</Text>
            <Text style={styles.securityItem}>• Insured up to $3,000</Text>
          </View>
        </View>

        {/* CONFIGURATION */}
        <View style={styles.whiteSection}>
          <Text style={styles.configMainTitle}>Configure Storage</Text>

          <View style={styles.dateTimeRow}>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>DROP-OFF</Text>
              <Text style={styles.dateValue}>{startDate.toLocaleDateString()} - 10:00 AM</Text>
            </View>
            <View style={styles.dateInput}>
              <Text style={styles.dateLabel}>PICK-UP</Text>
              <Text style={styles.dateValue}>{endDate.toLocaleDateString()} - 06:00 PM</Text>
            </View>
          </View>

          <Text style={styles.luggageLabel}>LUGGAGE ITEMS</Text>

          {/* ITEM SELECTORS */}
          {(['small', 'medium', 'large'] as const).map((type) => {
            const available = store?.availability?.[type] ?? 0
            const remaining = available - bags[type]

            return (
              <View key={type} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>
                    {type === 'small'
                      ? 'Small / Backpack'
                      : type === 'medium'
                      ? 'Medium Suitcase'
                      : 'Large / Overweight'}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>${store?.pricePerDay?.[type] || 0}/day</Text>
                    <View
                      style={[styles.availabilityBadge, remaining === 0 && styles.soldOutBadge]}
                    >
                      <Text
                        style={[styles.availabilityText, remaining === 0 && styles.soldOutText]}
                      >
                        {remaining > 0 ? `${remaining} left` : 'Sold out'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(type, -1)}
                    style={styles.counterBtn}
                  >
                    <Ionicons
                      name="remove-outline"
                      size={20}
                      color={bags[type] > 0 ? '#0A0E5E' : '#CBD5E0'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.countNumber}>{bags[type]}</Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(type, 1)}
                    style={styles.counterBtn}
                    disabled={remaining <= 0}
                  >
                    <Ionicons
                      name="add-outline"
                      size={20}
                      color={remaining > 0 ? '#0A0E5E' : '#CBD5E0'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}

          {/* TOTAL & CONFIRM */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalHoursLabel}>Total Price</Text>
              <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.confirmButton, (totalPrice === 0 || isPending) && styles.disabledBtn]}
              disabled={totalPrice === 0 || isPending}
              onPress={handleConfirm}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Confirm </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: { height: 280, width: '100%', marginBottom: 10 },
  bannerImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10,
  },
  headerInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  storeName: { fontSize: 22, fontWeight: 'bold', color: '#0A0E5E' },
  subInfo: { fontSize: 13, color: '#8898AA', marginTop: 5 },
  statsContainer: { paddingHorizontal: 25, marginTop: 15 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#0A0E5E', fontWeight: '600', fontSize: 14 },
  sectionCard: { margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  securityGrid: { gap: 8 },
  securityItem: { color: '#4A5568', fontSize: 14 },
  whiteSection: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    marginTop: 10,
    elevation: 20,
  },
  configMainTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 20 },
  dateTimeRow: { gap: 12, marginBottom: 25 },
  dateInput: {
    backgroundColor: '#F8F9FB',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  dateLabel: { fontSize: 10, color: '#8898AA', fontWeight: 'bold', marginBottom: 4 },
  dateValue: { fontSize: 13, color: '#0A0E5E', fontWeight: '600' },
  luggageLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8898AA',
    marginBottom: 15,
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#0A0E5E' },
  itemPrice: { fontSize: 13, color: '#8898AA' },
  availabilityBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  availabilityText: { fontSize: 10, color: '#2E7D32', fontWeight: '800' },
  soldOutBadge: { backgroundColor: '#FFEBEE' },
  soldOutText: { color: '#C62828' },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  counterBtn: { padding: 5 },
  countNumber: { marginHorizontal: 15, fontWeight: '800', fontSize: 16, color: '#0A0E5E' },
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  totalHoursLabel: { fontSize: 12, color: '#8898AA' },
  totalAmount: { fontSize: 32, fontWeight: 'bold', color: '#0A0E5E' },
  confirmButton: {
    backgroundColor: '#0A0E5E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 20,
    elevation: 5,
  },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { backgroundColor: '#CBD5E0' },
  errorText: { color: '#64748B', marginBottom: 20 },
  retryBtn: { backgroundColor: '#0A0E5E', padding: 12, borderRadius: 8 },
  retryBtnText: { color: 'white', fontWeight: 'bold' },
})
