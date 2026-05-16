import { useBookingsQuery } from '@/hooks/useMyBookings';
import type { BookingData } from '@/types/booking.types';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainBookingCard } from '../booking/MainBookingCard';
import { MiniBookingCard } from '../booking/MiniBookingCard';
import { ReviewModal } from '../booking/ReviewModal';

export default function BookingsScreen() {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingData | null>(null);
  const { data: bookings, isLoading, refetch } = useBookingsQuery();
  const s = useMemo(() => createStyles(colors), [colors]);

  // Auto-prompt review when switching to Past tab
  useEffect(() => {
    if (activeTab !== 'Past') return;
    AsyncStorage.getItem('review_skip').then((skip) => {
      if (skip === 'true') return;
      api.get('/reviews/eligible').then((res: any) => {
        if (res.eligible && res.bookings?.length > 0) {
          setSelectedBookingForReview(res.bookings[0]);
        }
      }).catch(() => {});
    });
  }, [activeTab]);

  const handleCloseReview = () => {
    setSelectedBookingForReview(null);
    AsyncStorage.setItem('review_skip', 'true');
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b: BookingData) => {
      if (activeTab === 'Active') {
        // B-03: Incluir in_storage para que la reserva no "desaparezca" tras el check-in
        return b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_storage';
      }
      return b.status === 'completed' || b.status === 'cancelled';
    });
  }, [bookings, activeTab]);

  if (isLoading && !bookings) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Image source={isDark ? require('@/assets/images/light-icon.png') : require('@/assets/images/login-logo.png')} style={{ width: 100, height: 48 }} resizeMode="contain" />
      </View>

      <Text style={s.pageTitle}>My Bookings</Text>

      <View style={s.tabContainer}>
        {(['Active', 'Past'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tabButton, activeTab === tab && s.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={s.emptyContainer}>
            <Ionicons name="archive-outline" size={60} color={colors.iconMuted} />
            <Text style={s.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
          </View>
        }
        renderItem={({ item }) => (
          activeTab === 'Active' ? (
            <MainBookingCard
              booking={item}
              onReview={() => setSelectedBookingForReview(item)}
            />
          ) : (
            <MiniBookingCard
              booking={item}
              onReview={() => setSelectedBookingForReview(item)}
            />
          )
        )}
      />

      {selectedBookingForReview && (
        <ReviewModal
          isVisible={!!selectedBookingForReview}
          onClose={handleCloseReview}
          booking={selectedBookingForReview}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceCardLow },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.primary, marginLeft: 8 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: colors.primary, paddingHorizontal: 20, marginTop: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.surfaceLight, marginHorizontal: 20, marginTop: 20, borderRadius: 25, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  tabButtonActive: { backgroundColor: colors.surfaceCard, elevation: 2 },
  tabText: { fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.primary },
  scrollContent: { padding: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: colors.textMuted, marginTop: 10, fontSize: 16 }
});