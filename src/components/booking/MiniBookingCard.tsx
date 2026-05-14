import { ROUTES } from '@/constants/routes';
import type { BookingData } from '@/types/booking.types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MiniBookingCard = ({
  booking,
  onReview
}: {
  booking: BookingData,
  onReview?: () => void
}) => {
  const dateStr = new Date(booking.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const router = useRouter()
  const totalItems = (booking.items?.small || 0) + (booking.items?.medium || 0) + (booking.items?.large || 0);

  return (
    <View style={styles.miniCard}>
      <View style={styles.miniHeader}>
        <View style={[
          styles.badgeUpcoming,
          booking.status === 'completed' && { backgroundColor: '#EDFDFD' }
        ]}>
          <Text style={[
            styles.badgeTextUpcoming,
            booking.status === 'completed' && { color: '#319795' }
          ]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
        <Ionicons name="archive" size={18} color="#0A0E5E" />
      </View>
      <Text style={styles.miniStoreName}>{booking.location?.name}</Text>
      <Text style={styles.miniDate}>{dateStr}</Text>

      <View style={styles.miniFooter}>
        <View>
          <Text style={styles.itemTotal}>{totalItems} Items Total</Text>
        </View>

        <TouchableOpacity style={styles.modifyButton} onPress={() => router.push(ROUTES.CLIENT.PAST_BOOKING_DETAIL(booking.id))} accessibilityLabel="View booking details" accessibilityRole="button">
          <Text style={styles.modifyText}>Details </Text>
          <Ionicons name="chevron-forward" size={14} color="#A0522D" />
        </TouchableOpacity>
      </View>

      {booking.status === 'completed' && !booking.review && onReview && (
        <TouchableOpacity style={styles.reviewPrompt} onPress={onReview} activeOpacity={0.8} accessibilityLabel="Rate your experience" accessibilityRole="button">
          <View style={styles.reviewPromptLeft}>
            <Ionicons name="star" size={18} color="#FBB142" />
            <View>
              <Text style={styles.reviewPromptTitle}>How was your experience?</Text>
              <Text style={styles.reviewPromptSub}>Tap to rate {booking.location?.name || 'this store'}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FBB142" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  miniCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 2, marginBottom: 15 },
  miniHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeUpcoming: { backgroundColor: '#E0E7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTextUpcoming: { color: '#5469D4', fontSize: 10, fontWeight: '800' },
  miniStoreName: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  miniDate: { color: '#8898AA', marginTop: 4, fontSize: 13 },
  miniFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F3F9' },
  itemTotal: { color: '#0A0E5E', fontWeight: '500', fontSize: 13 },
  modifyButton: { flexDirection: 'row', alignItems: 'center' },
  modifyText: { color: '#A0522D', fontWeight: '700', fontSize: 13 },
  reviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
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
    color: '#92400E',
  },
  reviewPromptSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 1,
  },
});
