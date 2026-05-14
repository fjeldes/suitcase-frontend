import { BookingSummary } from '@/components/booking/BookingSummary';
import { LuggageItem } from '@/components/booking/LuggageItem';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { bookingService } from '@/services/bookingService';
import { QRGenerator } from '@/services/QRGenerator';
import { formatBookingDates } from '@/utils/dateFormatter';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function BookingDetail({ bookingId }: { bookingId?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. TODOS LOS HOOKS AL PRINCIPIO (Regla de oro de React)
  const { data: booking, isLoading, refetch, isRefetching } = useBookingDetail(bookingId as string);

  const { mutate: cancelBooking, isPending: isCanceling } = useMutation({
    mutationFn: bookingService.cancel,
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Booking Cancelled', text2: 'Your booking has been cancelled successfully.' });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      router.back();
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: 'Error', text2: err?.response?.data?.message || 'Could not cancel booking.' });
    }
  });

  // 2. MANEJO DE ESTADOS DE CARGA Y ERROR
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1A1F71" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Booking not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.mapsButton}>
          <Text style={styles.mapsButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. EXTRACCIÓN DE DATOS (Después de asegurar que booking existe)
  const {
    id,
    qrCode,
    status,
    totalPrice,
    items = { small: 0, medium: 0, large: 0 },
    location,
    startDate: startRaw,
    endDate: endRaw,
    surcharges = [],
    totalSurcharge = 0,
  } = booking;

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => cancelBooking(id) }
      ]
    );
  };

  const activeItems = Object.entries(items).filter(([_, qty]) => (qty as number) > 0);
  const { formattedStart, formattedEnd } = formatBookingDates(startRaw, endRaw);

  const days = Math.max(1, Math.ceil((new Date(endRaw).getTime() - new Date(startRaw).getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1F71" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Booking</Text>
          <Text style={styles.headerTitle}>Confirmation</Text>
        </View>
        <View style={[
          styles.confirmedBadge,
          status === 'cancelled' && { backgroundColor: '#FEE2E2' }
        ]}>
          <Ionicons
            name={status === 'cancelled' ? "close-circle-outline" : "checkmark-circle-outline"}
            size={16}
            color={status === 'cancelled' ? "#E53E3E" : "#FF8A00"}
          />
          <Text style={[styles.confirmedText, status === 'cancelled' && { color: '#E53E3E' }]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      >
        {/* QR Code Section */}
        <View style={styles.qrSection}>
          <QRGenerator value={qrCode || id} sizeScale={0.4} />
          <Text style={styles.bookingRef}>REF: {qrCode || id.substring(0, 8).toUpperCase()}</Text>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <Text style={styles.locationTitle}>{location?.name || 'Storage Location'}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text style={styles.locationText}>{location?.address}</Text>
          </View>
          <Image
            source={{ uri: location?.image || 'https://via.placeholder.com/300x150' }}
            style={styles.locationImage}
          />
          <TouchableOpacity style={styles.mapsButton}>
            <Ionicons name="map-outline" size={20} color="#FFF" />
            <Text style={styles.mapsButtonText}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View style={styles.statusContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusLabel}>STORAGE DURATION</Text>
            <Text style={styles.statusValue}>{formattedStart} — {formattedEnd}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.statusLabel}>SECURITY</Text>
            <Text style={[styles.statusValue, { color: '#27AE60' }]}>Safe & Locked</Text>
          </View>
        </View>

        {/* Luggage Breakdown */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="luggage" size={24} color="#A52A2A" />
          <Text style={styles.sectionHeaderText}>Luggage Breakdown</Text>
        </View>

        {Object.entries(items).map(([size, quantity]) => (
          (quantity as number) > 0 && (
            <LuggageItem
              key={size}
              size={size as 'small' | 'medium' | 'large'}
              quantity={quantity as number}
              pricePerDay={location?.pricePerDay?.[size] || 0}
              days={days}
            />
          )
        ))}

        <BookingSummary
          items={booking.items}
          pricePerDay={booking.location.pricePerDay}
          totalPrice={Number(booking.totalPrice) + totalSurcharge}
          days={days}
          currency="CLP"
          status={booking.status}
          isCanceling={isCanceling}
          onCancel={handleCancel}
          onViewReceipt={() => { /* lógica de recibo */ }}
        />

        {surcharges.length > 0 && (
          <View style={styles.surchargeSection}>
            <Text style={styles.surchargeTitle}>EXTRA CHARGES</Text>
            {surcharges.map((s: any, i: number) => (
              <View key={i} style={styles.surchargeRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.surchargeLabel}>{s.description}</Text>
                  <Text style={styles.surchargeDate}>{new Date(s.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.surchargeAmount}>+${Number(s.total).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    paddingTop: 50
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1F71' },
  confirmedBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFF2E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmedText: { color: '#FF8A00', fontWeight: 'bold', fontSize: 10, marginLeft: 4 },
  scrollContent: { padding: 16 },
  qrSection: { alignItems: 'center', marginVertical: 10 },
  bookingRef: { color: '#666', letterSpacing: 1, fontSize: 12, marginTop: 10, fontWeight: '600' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  locationTitle: { fontSize: 18, fontWeight: '700', color: '#1A1F71' },
  locationRow: { flexDirection: 'row', marginVertical: 5 },
  locationText: { color: '#666', fontSize: 14, marginLeft: 5 },
  locationImage: { width: '100%', height: 120, borderRadius: 15, marginVertical: 15 },
  mapsButton: {
    backgroundColor: '#0A0E50',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapsButtonText: { color: '#FFF', fontWeight: '600', marginLeft: 8 },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE'
  },
  statusLabel: { fontSize: 10, color: '#666', fontWeight: 'bold' },
  statusValue: { fontSize: 13, fontWeight: '700', color: '#1A1F71', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionHeaderText: { fontSize: 18, fontWeight: 'bold', color: '#1A1F71', marginLeft: 10 },
  paymentCard: { backgroundColor: '#162181', borderRadius: 24, padding: 25, marginTop: 10 },
  paymentTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  payLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  payValue: { color: '#FFF', fontWeight: '600' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 15 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  receiptButton: {
    backgroundColor: '#FF8A00',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  receiptButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E53E3E',
  },
  cancelButtonText: { color: '#E53E3E', fontWeight: 'bold', fontSize: 16 },
  surchargeSection: { marginTop: 20 },
  surchargeTitle: { fontSize: 12, fontWeight: '800', color: '#E53E3E', letterSpacing: 1, marginBottom: 10 },
  surchargeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F5', padding: 14, borderRadius: 14, marginBottom: 8 },
  surchargeLabel: { fontSize: 13, fontWeight: '600', color: '#1A202C' },
  surchargeDate: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  surchargeAmount: { fontSize: 16, fontWeight: '800', color: '#E53E3E' },
});