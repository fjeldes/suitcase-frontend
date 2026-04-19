import { useMyBookings } from '@/hooks/useMyBookings';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<'Active' | 'Past'>('Active');
  
  // 1. Obtenemos los datos reales del hook
  const { data: bookings, isLoading, refetch } = useMyBookings();

  // 2. Filtramos según el tab seleccionado
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b: any) => {
      if (activeTab === 'Active') {
        return b.status === 'confirmed' || b.status === 'pending';
      }
      return b.status === 'completed' || b.status === 'cancelled';
    });
  }, [bookings, activeTab]);

  if (isLoading) {
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

      {/* Selector de Tabs */}
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
          // Si es la primera de la lista Active, usamos la card grande. 
          // Si no, usamos la mini card para que la UI no sea monótona.
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

// Componente para la reserva Principal
function MainBookingCard({ booking }: any) {
  const startDate = new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: booking.location?.image || 'https://via.placeholder.com/500' }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardBody}>
        <View style={styles.statusRow}>
          <View style={[styles.badgeActive, booking.status === 'pending' && { backgroundColor: '#F6AD55' }]}>
            <Ionicons name={booking.status === 'confirmed' ? "lock-closed" : "time"} size={12} color="white" />
            <Text style={styles.badgeText}> {booking.status.toUpperCase()}</Text>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.dateRange}>{startDate} - {endDate}</Text>
          </View>
        </View>

        <Text style={styles.storeName}>{booking.location?.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={14} color="#0A0E5E" />
          <Text style={styles.locationText} numberOfLines={1}> {booking.location?.address}</Text>
        </View>

        <View style={styles.itemsRow}>
          {booking.items?.small > 0 && (
            <View style={styles.itemTag}>
              <Text style={styles.itemTagText}>{booking.items.small} Small</Text>
            </View>
          )}
          {booking.items?.medium > 0 && (
            <View style={styles.itemTag}>
              <Text style={styles.itemTagText}>{booking.items.medium} Med</Text>
            </View>
          )}
          {booking.items?.large > 0 && (
            <View style={styles.itemTag}>
              <Text style={styles.itemTagText}>{booking.items.large} Large</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.qrButton}>
          <Ionicons name="qr-code-outline" size={18} color="white" />
          <Text style={styles.qrButtonText}> View QR Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Componente para las reservas secundarias o pasadas
function MiniBookingCard({ booking }: any) {
  const dateStr = new Date(booking.startDate).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  return (
    <View style={styles.miniCard}>
      <View style={styles.miniHeader}>
        <View style={[styles.badgeUpcoming, booking.status === 'completed' && { backgroundColor: '#EDFDFD' }]}>
          <Text style={[styles.badgeTextUpcoming, booking.status === 'completed' && { color: '#319795' }]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
        <Ionicons name="archive" size={18} color="#0A0E5E" />
      </View>
      <Text style={styles.miniStoreName}>{booking.location?.name}</Text>
      <Text style={styles.miniDate}>{dateStr}</Text>
      
      <View style={styles.miniFooter}>
        <Text style={styles.itemTotal}>
          {booking.items.small + booking.items.medium + booking.items.large} Items Total
        </Text>
        <TouchableOpacity style={styles.modifyButton}>
          <Text style={styles.modifyText}>Details </Text>
          <Ionicons name="chevron-forward" size={14} color="#A0522D" />
        </TouchableOpacity>
      </View>
    </View>
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
  card: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 3 },
  cardImage: { width: '100%', height: 180 },
  cardBody: { padding: 20 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  badgeActive: { flexDirection: 'row', backgroundColor: '#0A0E5E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignItems: 'center' },
  badgeText: { color: 'white', fontSize: 11, fontWeight: '700' },
  dateRange: { fontSize: 14, fontWeight: '700', color: '#0A0E5E' },
  dateInfo: { alignItems: 'flex-end' },
  storeName: { fontSize: 22, fontWeight: '700', color: '#0A0E5E' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationText: { color: '#8898AA', fontSize: 13, flex: 1 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 15, marginBottom: 20 },
  itemTag: { backgroundColor: '#F1F3F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  itemTagText: { color: '#0A0E5E', fontWeight: '600', fontSize: 12 },
  qrButton: { backgroundColor: '#0A0E5E', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  qrButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
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
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#8898AA', marginTop: 10, fontSize: 16 }
});