import { useBookingsQuery } from '@/hooks/useMyBookings';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
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

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  const { data: bookings, isLoading, refetch } = useBookingsQuery();

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b: any) => {
      if (activeTab === 'Active') {
        return b.status === 'confirmed' || b.status === 'pending';
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
        <Text style={styles.headerTitle}>Secure Custodian</Text>
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
        renderItem={({ item, index }) => (
          index === 0 && activeTab === 'Active' ? (
            <MainBookingCard booking={item} />
          ) : (
            <MiniBookingCard booking={item} />
          )
        )}
      />
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