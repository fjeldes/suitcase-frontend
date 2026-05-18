import { ROUTES } from '@/constants/routes'
import { useBookingStore } from '@/store/useBookingStore'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const ITEM_LABELS: Record<string, string> = {
  small: 'Small Bag',
  medium: 'Medium Suitcase',
  large: 'Large Suitcase',
}

export const CheckInSuccess = () => {
  const router = useRouter()
  const { currentBooking, clearCurrentBooking } = useBookingStore()

  if (!currentBooking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A0E5E" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading booking data...</Text>
      </View>
    )
  }

  const isCheckIn = currentBooking.status === 'in_storage'
  const bookingIdDisplay = currentBooking.id?.slice(0, 8).toUpperCase()
  const items = currentBooking.items || { small: 0, medium: 0, large: 0 }
  const hasItems = Object.values(items).some((v: any) => v > 0)

  const handleDone = () => {
    clearCurrentBooking()
    router.replace(ROUTES.OWNER.DASHBOARD)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={48} color="#22C55E" />
            </View>
          </View>
          <Text style={styles.title}>
            {isCheckIn ? 'Check-in Successful!' : 'Check-out Successful!'}
          </Text>
          <Text style={styles.subtitle}>
            {isCheckIn
              ? 'The items have been safely stored.'
              : 'The booking has been completed and items returned.'}
          </Text>
        </View>

        {/* Customer Card */}
        <View style={styles.card}>
          <Text style={styles.label}>CUSTOMER</Text>
          <Text style={styles.customerName}>
            {currentBooking.user?.profile
              ? `${currentBooking.user.profile.firstName} ${currentBooking.user.profile.lastName}`
              : 'Guest User'}
          </Text>
          <Text style={styles.bookingId}>Booking ID: #{bookingIdDisplay}</Text>
          <View style={styles.identityBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#0A0E5E" />
            <Text style={styles.identityText}> Identity Confirmed</Text>
          </View>
        </View>

        {/* Items Card */}
        {hasItems && (
          <View style={styles.card}>
            <Text style={styles.label}>ITEMS TO STORE</Text>
            {Object.entries(items).map(([key, value]) => {
              if (!value || (value as number) === 0) return null
              return (
                <View key={key} style={styles.itemRow}>
                  <View style={styles.itemIconBox}>
                    <MaterialCommunityIcons
                      name={key === 'large' ? 'briefcase' : 'bag-personal'}
                      size={24}
                      color="#0A0E5E"
                    />
                  </View>
                  <View>
                    <Text style={styles.itemName}>
                      {value} {ITEM_LABELS[key] || key}
                    </Text>
                    <Text style={styles.itemType}>Scan verified</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <MaterialCommunityIcons name="archive-arrow-down-outline" size={22} color="white" />
          <Text style={styles.doneButtonText}> Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40 },
  successSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  outerCircle: {
    width: 130, height: 130, borderRadius: 65, backgroundColor: '#E8FBF2',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  innerCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: 'white',
    justifyContent: 'center', alignItems: 'center',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5,
  },
  title: { fontSize: 28, fontWeight: '900', color: '#0A0E5E', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  card: {
    backgroundColor: 'white', borderRadius: 30, padding: 25, marginBottom: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  label: { fontSize: 11, fontWeight: '800', color: '#FF7A00', letterSpacing: 1, marginBottom: 12 },
  customerName: { fontSize: 22, fontWeight: '700', color: '#0A0E5E', marginBottom: 4 },
  bookingId: { fontSize: 15, color: '#4B5563', marginBottom: 15 },
  identityBadge: { flexDirection: 'row', alignItems: 'center' },
  identityText: { fontSize: 14, fontWeight: '600', color: '#0A0E5E' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  itemIconBox: {
    width: 45, height: 45, backgroundColor: '#F1F3F9', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  itemName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  itemType: { fontSize: 13, color: '#6B7280' },
  doneButton: {
    backgroundColor: '#0A0E5E', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingVertical: 18, borderRadius: 20, marginTop: 10,
  },
  doneButtonText: { color: 'white', fontSize: 18, fontWeight: '700' },
})
