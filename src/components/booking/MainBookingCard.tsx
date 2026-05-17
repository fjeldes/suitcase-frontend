import { ROUTES } from '@/constants/routes'
import { useBookingStore } from '@/store/useBookingStore'
import type { BookingData } from '@/types/booking.types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTheme } from '@/hooks/useTheme'
import React, { useMemo } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface MainBookingCardProps {
  booking: BookingData
  onReview?: () => void
}

export const MainBookingCard = ({ booking }: MainBookingCardProps) => {
  const { colors } = useTheme()
  const router = useRouter()
  const setCurrentBooking = useBookingStore((state) => state.setCurrentBooking)
  const s = useMemo(() => createStyles(colors), [colors])

  const startDate = new Date(booking.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const endDate = new Date(booking.endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  const handleViewQR = () => {
    setCurrentBooking(booking)
    router.push(ROUTES.CLIENT.BOOKING_TICKET)
  }

  const handleViewDetail = () => {
    setCurrentBooking(booking)
    // Pasando el ID dinámicamente
    router.push(ROUTES.CLIENT.BOOKING_DETAIL(booking.id))
  }
  console.log(booking)
  return (
    <View style={s.card}>
      <Image
        source={{ uri: booking.location?.imageUrl || 'https://via.placeholder.com/500' }}
        style={s.cardImage}
      />
      <View style={s.cardBody}>
        <View style={s.statusRow}>
          <View
            style={[
              s.badgeActive,
              booking.status === 'pending' && { backgroundColor: '#F6AD55' },
            ]}
          >
            <Ionicons
              name={booking.status === 'confirmed' ? 'lock-closed' : 'time'}
              size={12}
              color="white"
            />
            <Text style={s.badgeText}> {booking.status.toUpperCase()}</Text>
          </View>
          <View style={s.dateInfo}>
            <Text style={s.dateRange}>
              {startDate} - {endDate}
            </Text>
          </View>
        </View>

        <Text style={s.storeName}>{booking.location?.name}</Text>
        <View style={s.locationRow}>
          <Ionicons name="location" size={14} color="#0A0E5E" />
          <Text style={s.locationText} numberOfLines={1}>
            {' '}
            {booking.location?.address}
          </Text>
        </View>

        <View style={s.itemsRow}>
          {booking.items?.small > 0 && (
            <View style={s.itemTag}>
              <Text style={s.itemTagText}>{booking.items.small} Small</Text>
            </View>
          )}
          {booking.items?.medium > 0 && (
            <View style={s.itemTag}>
              <Text style={s.itemTagText}>{booking.items.medium} Med</Text>
            </View>
          )}
          {booking.items?.large > 0 && (
            <View style={s.itemTag}>
              <Text style={s.itemTagText}>{booking.items.large} Large</Text>
            </View>
          )}
        </View>

        <View style={s.buttonContainer}>
          <TouchableOpacity style={s.qrButton} onPress={handleViewQR} accessibilityLabel="View QR code" accessibilityRole="button">
            <Ionicons name="qr-code-outline" size={18} color="white" />
            <Text style={s.qrButtonText}> View QR Code</Text>
          </TouchableOpacity>

          {/* NUEVO BOTÓN PARA EL DETALLE QUE HICIMOS */}
          <TouchableOpacity style={s.detailButton} onPress={handleViewDetail} accessibilityLabel="View booking details" accessibilityRole="button">
            <Ionicons name="list-outline" size={18} color="#0A0E5E" />
            <Text style={s.detailButtonText}> View Booking Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
  },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 20 },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  badgeActive: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
  },
  badgeText: { color: colors.textInverse, fontSize: 11, fontWeight: '700' },
  dateRange: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  dateInfo: { alignItems: 'flex-end' },
  storeName: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { color: colors.textMuted, fontSize: 13, flex: 1 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15, marginBottom: 20 },
  itemTag: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  itemTagText: { color: colors.textPrimary, fontWeight: '600', fontSize: 12 },
  qrButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  qrButtonText: { color: colors.textInverse, fontWeight: '700', fontSize: 16 },
  buttonContainer: {
    gap: 10,
  },
  detailButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  detailButtonText: { color: colors.primary, fontWeight: '700', fontSize: 16 },
})
