import { BookingSummary } from '@/components/booking/BookingSummary';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function BookingDetailsScreen({ bookingId }: { bookingId?: string }) {
    const router = useRouter();
    // El hook se encarga de todo: caché instantánea o fetch si no hay nada
    const { data: booking, isLoading } = useBookingDetail(bookingId as string);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0A0E5E" />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>No pudimos encontrar la reserva.</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.secondaryBtn}>
                    <Text>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- Helpers de Formateo ---
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            full: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    const start = formatDate(booking.startDate);
    const end = formatDate(booking.endDate);

    const days = Math.max(1, Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.navBar}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
                </TouchableOpacity>
                <Text style={styles.navTitle}>Booking Details</Text>
                <TouchableOpacity>
                    <Ionicons name="share-outline" size={24} color="#0A0E5E" />
                </TouchableOpacity>
            </View>

            <View style={styles.mainContent}>
                {/* Status Badge Dinámico */}
                <View style={[
                    styles.activeBadge,
                    booking.status === 'completed' ? styles.badgeCompleted : styles.badgeActive,
                    booking.status === 'cancelled' && styles.badgeCancelled
                ]}>
                    <Ionicons
                        name={booking.status === 'completed' ? "checkmark-done" : "time-outline"}
                        size={16}
                        color={booking.status === 'completed' ? "#475569" : "#FFF"}
                    />
                    <Text style={[
                        styles.activeBadgeText,
                        booking.status === 'completed' && { color: '#475569' }
                    ]}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.bookingId}>{booking.qrCode || `BK-${booking.id.slice(-6)}`}</Text>
                <Text style={styles.bookingDate}>Booked on {start.full}</Text>

                {/* Store Card */}
                <View style={styles.storeCard}>
                    <Image
                        source={{ uri: booking.location?.image || 'https://images.unsplash.com/photo-1590274853856-f22d5ee3d228' }}
                        style={styles.storeImage}
                    />
                    <View style={styles.storeInfo}>
                        <Text style={styles.storeTitle}>{booking.location?.name}</Text>
                        <Text style={styles.storeAddress}>{booking.location?.address}</Text>
                        <View style={styles.storeButtons}>
                            <TouchableOpacity style={styles.storeBtn}>
                                <MaterialCommunityIcons name="near-me" size={18} color="#0A0E5E" />
                                <Text style={styles.storeBtnText}>Maps</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.storeBtn}>
                                <Ionicons name="call-outline" size={18} color="#0A0E5E" />
                                <Text style={styles.storeBtnText}>Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Times Container */}
                <View style={styles.timesContainer}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeIcon}><Ionicons name="log-in-outline" size={20} color="#92400E" /></View>
                        <View>
                            <Text style={styles.timeLabel}>CHECK-IN</Text>
                            <Text style={styles.timeValue}>{start.full}</Text>
                            <Text style={styles.timeHour}>{start.time}</Text>
                        </View>
                    </View>
                    <View style={[styles.timeRow, { marginTop: 16 }]}>
                        <View style={[styles.timeIcon, { backgroundColor: '#F1F5F9' }]}><Ionicons name="log-out-outline" size={20} color="#475569" /></View>
                        <View>
                            <Text style={styles.timeLabel}>CHECK-OUT</Text>
                            <Text style={styles.timeValue}>{end.full}</Text>
                            <Text style={styles.timeHour}>{end.time}</Text>
                        </View>
                    </View>
                </View>

                <BookingSummary
                    items={booking.items}
                    pricePerDay={booking.location.pricePerDay}
                    totalPrice={Number(booking.totalPrice) + (booking.totalSurcharge || 0)}
                    days={days}
                    currency="CLP"
                    status={booking.status}
                    onViewReceipt={() => { /* lógica de recibo */ }}
                />

                {(booking.surcharges || []).length > 0 && (
                    <View style={{ marginTop: 16 }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#E53E3E', letterSpacing: 1, marginBottom: 8 }}>EXTRA CHARGES</Text>
                        {(booking.surcharges || []).map((s: any, i: number) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F5', padding: 12, borderRadius: 12, marginBottom: 6 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A202C' }}>{s.description}</Text>
                                    <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{new Date(s.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '800', color: '#E53E3E' }}>+${Number(s.total).toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Action Buttons */}
                <TouchableOpacity style={styles.primaryBtn}>
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
                    <Text style={styles.primaryBtnText}>Contact Support</Text>
                </TouchableOpacity>

                {booking.status === 'completed' && (
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Ionicons name="document-text-outline" size={20} color="#0A0E5E" />
                        <Text style={styles.secondaryBtnText}>Get Receipt</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.insuranceBox}>
                    <MaterialCommunityIcons name="shield-check" size={20} color="#0A0E5E" />
                    <Text style={styles.insuranceText}>PROTECTED UP TO $2,500</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: '#E53E3E', marginBottom: 10 },
    navBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', paddingTop: 60 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
    mainContent: { paddingHorizontal: 20, paddingBottom: 40 },
    activeBadge: { flexDirection: 'row', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, alignItems: 'center' },
    badgeActive: { backgroundColor: '#FF6D00' },
    badgeCompleted: { backgroundColor: '#E2E8F0' },
    badgeCancelled: { backgroundColor: '#FEE2E2' },
    activeBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    bookingId: { fontSize: 32, fontWeight: 'bold', color: '#0A0E5E', marginTop: 10 },
    bookingDate: { fontSize: 16, color: '#64748B', marginTop: 4 },
    storeCard: { backgroundColor: '#FFF', borderRadius: 24, marginTop: 24, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
    storeImage: { width: '100%', height: 160 },
    storeInfo: { padding: 20 },
    storeTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
    storeAddress: { fontSize: 14, color: '#64748B', marginTop: 4 },
    storeButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
    storeBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 6 },
    storeBtnText: { fontSize: 12, fontWeight: 'bold', color: '#0A0E5E' },
    timesContainer: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginTop: 24 },
    timeRow: { flexDirection: 'row', gap: 16 },
    timeIcon: { width: 40, height: 40, backgroundColor: '#FFF7ED', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    timeLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 1 },
    timeValue: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
    timeHour: { fontSize: 14, color: '#64748B' },
    summaryCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, marginTop: 24 },
    summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 20 },
    itemRow: { flexDirection: 'row', alignItems: 'center' },
    itemIcon: { width: 48, height: 48, backgroundColor: '#EEF2FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#0A0E5E' },
    itemQty: { fontSize: 14, color: '#64748B' },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#0A0E5E' },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
    totalLabel: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
    totalValue: { fontSize: 24, fontWeight: 'bold', color: '#0A0E5E' },
    paidText: { fontSize: 10, color: '#92400E', fontWeight: 'bold' },
    primaryBtn: { backgroundColor: '#0A0E5E', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 24 },
    primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    secondaryBtn: { backgroundColor: '#F1F5F9', padding: 18, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12 },
    secondaryBtnText: { color: '#0A0E5E', fontWeight: 'bold', fontSize: 16 },
    insuranceBox: { backgroundColor: '#DBEAFE', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 },
    insuranceText: { fontSize: 11, fontWeight: '800', color: '#0A0E5E', letterSpacing: 0.5 }
});