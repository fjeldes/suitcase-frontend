import { ROUTES } from '@/constants/routes';
import { useBookingStore } from '@/store/useBookingStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MainBookingCardProps {
  booking: any;
}

export const MainBookingCard = ({ booking }: MainBookingCardProps) => {
  const router = useRouter();
  const setCurrentBooking = useBookingStore((state) => state.setCurrentBooking);

  const startDate = new Date(booking.startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const endDate = new Date(booking.endDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

  const handleViewQR = () => {
    setCurrentBooking(booking);
    router.push(ROUTES.CLIENT.BOOKING_TICKET);
  };

  return (
    <View style={styles.card}>
      <Image 
        source={{ uri: booking.location?.image || 'https://via.placeholder.com/500' }} 
        style={styles.cardImage} 
      />
      <View style={styles.cardBody}>
        <View style={styles.statusRow}>
          <View style={[
            styles.badgeActive, 
            booking.status === 'pending' && { backgroundColor: '#F6AD55' }
          ]}>
            <Ionicons 
              name={booking.status === 'confirmed' ? "lock-closed" : "time"} 
              size={12} 
              color="white" 
            />
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

        <TouchableOpacity style={styles.qrButton} onPress={() => handleViewQR()}>
          <Ionicons name="qr-code-outline" size={18} color="white" />
          <Text style={styles.qrButtonText}> View QR Code</Text> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});