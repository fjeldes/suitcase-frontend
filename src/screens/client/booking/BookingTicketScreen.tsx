import { ItemSummary } from '@/components/booking/ticket/ItemSummary'
import { TicketCard } from '@/components/booking/ticket/TicketCard'
import { TicketInfoSection } from '@/components/booking/ticket/TicketInfoSection'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { BookingData } from '@/types/bookings/BookingData'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/hooks/useTheme'
import React, { useMemo } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function BookingTicketScreen({ booking }: { booking: BookingData }) {
  const { t } = useTranslation()
  const { colors, isDark } = useTheme()
  const router = useRouter()
  const s = useMemo(() => createStyles(colors), [colors])
  const fullName = `${booking.user.profile.firstName} ${booking.user.profile.lastName}`
  const storeName = booking.location.name

  // Formateo de fechas: "Oct 24 - Oct 26"
  const startDate = dayjs(booking.startDate).format('MMM DD')
  const endDate = dayjs(booking.endDate).format('MMM DD')
  const period = `${startDate} - ${endDate}`
  return (
    <SafeAreaView style={s.safe}>
      <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
        <Ionicons name="arrow-back" size={28} color={colors.textPrimary} />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={s.scroll}>
        <StatusBadge label={t('booking.active')} />

        <View style={s.mainCard}>
          <TicketCard qrValue={booking.qrCode} bookingId={booking.id.split('-')[0].toUpperCase()} />
          <TicketInfoSection customerName={fullName} location={storeName} period={period} />
        </View>

        <ItemSummary items={booking.items} />

        <View style={s.helpBox}>
          <Ionicons name="information-circle" size={24} color={colors.badgeOrange} />
          <Text style={s.helpText}>
            <Text style={{ fontWeight: 'bold' }}>{t('booking.how_to_use')}: </Text>
            {t('booking.qr_code_hint')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surfaceCardLow },
  backButton: { padding: 16, zIndex: 10 },
  scroll: { padding: 20, paddingBottom: 100 },
  mainCard: {
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  itemsSection: { marginTop: 25 },
  itemsTitle: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginBottom: 10 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
  },
  itemText: { color: colors.textPrimary, fontWeight: '600' },
  helpBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    padding: 15,
    borderRadius: 20,
    marginTop: 25,
    gap: 10,
    alignItems: 'center',
  },
  helpText: { flex: 1, color: colors.textPrimary, fontSize: 13, lineHeight: 18 },
})
