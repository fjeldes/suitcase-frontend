import { useBookingsQuery } from '@/hooks/useMyBookings';
import type { BookingData } from '@/types/booking.types';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KipGoLogo } from '@/components/ui/KipGoLogo';
import { Ionicons } from '@expo/vector-icons';
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
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingData | null>(null);
  const { data: bookings, isLoading, refetch } = useBookingsQuery();

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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0A0E5E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={20} color="#0A0E5E" />
        <KipGoLogo width={100} height={30} />
      </View>

      <Text style={styles.pageTitle}>My Bookings</Text>

      <View style={styles.tabContainer}>
        {(['Active', 'Past'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#0A0E5E" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="archive-outline" size={60} color="#CBD5E0" />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E', marginLeft: 8 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: '#0A0E5E', paddingHorizontal: 20, marginTop: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#EDF0F7', marginHorizontal: 20, marginTop: 20, borderRadius: 25, padding: 4 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
  tabButtonActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontWeight: '600', color: '#8898AA' },
  tabTextActive: { color: '#0A0E5E' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#8898AA', marginTop: 10, fontSize: 16 }
});