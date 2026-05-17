import { ROUTES } from '@/constants/routes';
import type { BookingData } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MiniBookingCard = ({
  booking,
  onReview
}: {
  booking: BookingData,
  onReview?: () => void
}) => {
  const { colors } = useTheme()
  const dateStr = new Date(booking.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const router = useRouter()
  const s = useMemo(() => createStyles(colors), [colors])
  const totalItems = (booking.items?.small || 0) + (booking.items?.medium || 0) + (booking.items?.large || 0);

  return (
    <View style={s.miniCard}>
      <View style={s.miniHeader}>
        <View style={[
          s.badgeUpcoming,
          booking.status === 'completed' && { backgroundColor: '#EDFDFD' }
        ]}>
          <Text style={[
            s.badgeTextUpcoming,
            booking.status === 'completed' && { color: '#319795' }
          ]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
        <Ionicons name="archive" size={18} color="#0A0E5E" />
      </View>
      <Text style={s.miniStoreName}>{booking.location?.name}</Text>
      <Text style={s.miniDate}>{dateStr}</Text>

      <View style={s.miniFooter}>
        <View>
          <Text style={s.itemTotal}>{totalItems} Items Total</Text>
        </View>

        <TouchableOpacity style={s.modifyButton} onPress={() => router.push(ROUTES.CLIENT.PAST_BOOKING_DETAIL(booking.id))} accessibilityLabel="View booking details" accessibilityRole="button">
          <Text style={s.modifyText}>Details </Text>
          <Ionicons name="chevron-forward" size={14} color="#A0522D" />
        </TouchableOpacity>
      </View>

      {booking.status === 'completed' && !booking.review && onReview && (
        <TouchableOpacity style={s.reviewPrompt} onPress={onReview} activeOpacity={0.8} accessibilityLabel="Rate your experience" accessibilityRole="button">
          <View style={s.reviewPromptLeft}>
            <Ionicons name="star" size={18} color="#FBB142" />
            <View>
              <Text style={s.reviewPromptTitle}>How was your experience?</Text>
              <Text style={s.reviewPromptSub}>Tap to rate {booking.location?.name || 'this store'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FBB142" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  miniCard: { backgroundColor: colors.surfaceCard, borderRadius: 20, padding: 20, elevation: 2, marginBottom: 15 },
  miniHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeUpcoming: { backgroundColor: colors.tabBarActiveBg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTextUpcoming: { color: colors.primary, fontSize: 10, fontWeight: '800' },
  miniStoreName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  miniDate: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  miniFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border },
  itemTotal: { color: colors.textPrimary, fontWeight: '500', fontSize: 13 },
  modifyButton: { flexDirection: 'row', alignItems: 'center' },
  modifyText: { color: colors.badgeOrange, fontWeight: '700', fontSize: 13 },
  reviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewPromptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reviewPromptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reviewPromptSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
});
