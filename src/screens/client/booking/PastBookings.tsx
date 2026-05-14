import { BookingSummary } from '@/components/booking/BookingSummary';
import { ReviewModal } from '@/components/booking/ReviewModal';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { useBookingDetail } from '@/hooks/useBookingDetail';
import { useTheme } from '@/hooks/useTheme';
import { claimService, type ClaimType } from '@/services/claimService';
import { uploadService } from '@/services/uploadService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

export default function BookingDetailsScreen({ bookingId }: { bookingId?: string }) {
    const router = useRouter();
    const { colors } = useTheme();
    const [showReview, setShowReview] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [showClaim, setShowClaim] = useState(false);
    const [claimSubject, setClaimSubject] = useState('');
    const [claimDesc, setClaimDesc] = useState('');
    const [claimType, setClaimType] = useState<ClaimType>('damage');
    const [claimPhotos, setClaimPhotos] = useState<string[]>([]);
    const [submittingClaim, setSubmittingClaim] = useState(false);
    const { data: booking, isLoading, refetch, isRefetching } = useBookingDetail(bookingId as string);
    const s = useMemo(() => createStyles(colors), [colors]);

    if (isLoading) {
        return (
            <View style={s.center}>
                <ActivityIndicator size="large" color={colors.iconColor} />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={s.center}>
                <Text style={s.errorText}>No pudimos encontrar la reserva.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 12 }} accessibilityLabel="Go back" accessibilityRole="button">
                    <Text style={{ color: colors.iconColor, fontWeight: '600' }}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

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

    const statusStyle = booking.status === 'completed' ? s.badgeCompleted
        : booking.status === 'cancelled' ? s.badgeCancelled
        : s.badgeActive;

    return (
        <ScrollView style={s.container} showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
            <View style={s.navBar}>
                <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
                    <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
                </TouchableOpacity>
                <Text style={s.navTitle}>Booking Details</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={s.mainContent}>
                <View style={[s.statusBadge, statusStyle]}>
                    <Ionicons
                        name={booking.status === 'completed' ? "checkmark-done" : "time-outline"}
                        size={16}
                        color={statusStyle.color || '#FFF'}
                    />
                    <Text style={[s.statusBadgeText, booking.status === 'completed' && { color: '#475569' }]}>
                        {booking.status.replace('_', ' ').toUpperCase()}
                    </Text>
                </View>

                <Text style={s.bookingId}>{booking.qrCode || `BK-${booking.id.slice(-6)}`}</Text>
                <Text style={s.bookingDate}>Booked on {start.full}</Text>

                <SurfaceCard variant="flat" padding={0} style={{ marginTop: 24 }}>
                    <Image
                        source={{ uri: booking.location?.image || 'https://images.unsplash.com/photo-1590274853856-f22d5ee3d228' }}
                        style={s.storeImage}
                    />
                    <View style={{ padding: 20 }}>
                        <Text style={s.storeTitle}>{booking.location?.name}</Text>
                        <Text style={s.storeAddress}>{booking.location?.address}</Text>
                        <View style={s.storeButtons}>
                            <TouchableOpacity style={s.storeBtn} accessibilityLabel="Open store location in maps" accessibilityRole="button">
                                <MaterialCommunityIcons name="near-me" size={18} color={colors.iconColor} />
                                <Text style={s.storeBtnText}>Maps</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={s.storeBtn} accessibilityLabel="Contact store" accessibilityRole="button">
                                <Ionicons name="call-outline" size={18} color={colors.iconColor} />
                                <Text style={s.storeBtnText}>Contact</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SurfaceCard>

                <SurfaceCard variant="elevated" style={{ marginTop: 24 }}>
                    <View style={s.timeRow}>
                        <View style={[s.timeIcon, { backgroundColor: '#FFF7ED' }]}>
                            <Ionicons name="log-in-outline" size={20} color="#92400E" />
                        </View>
                        <View>
                            <Text style={s.timeLabel}>CHECK-IN</Text>
                            <Text style={s.timeValue}>{start.full}</Text>
                            <Text style={s.timeHour}>{start.time}</Text>
                        </View>
                    </View>
                    <View style={[s.timeRow, { marginTop: 16 }]}>
                        <View style={[s.timeIcon, { backgroundColor: colors.surfaceLight }]}>
                            <Ionicons name="log-out-outline" size={20} color="#475569" />
                        </View>
                        <View>
                            <Text style={s.timeLabel}>CHECK-OUT</Text>
                            <Text style={s.timeValue}>{end.full}</Text>
                            <Text style={s.timeHour}>{end.time}</Text>
                        </View>
                    </View>
                </SurfaceCard>

                <BookingSummary
                    items={booking.items}
                    pricePerDay={booking.location.pricePerDay}
                    totalPrice={Number(booking.totalPrice) + (booking.totalSurcharge || 0)}
                    days={days}
                    currency="CLP"
                    status={booking.status}
                    onViewReceipt={() => {}}
                />

                {(booking.surcharges || []).length > 0 && (
                    <SurfaceCard variant="flat" padding={12} style={{ marginTop: 16, backgroundColor: '#FFF5F5', borderColor: '#FECACA' }}>
                        <Text style={{ fontSize: 11, fontWeight: '800', color: '#E53E3E', letterSpacing: 1, marginBottom: 8 }}>EXTRA CHARGES</Text>
                        {(booking.surcharges || []).map((s: any, i: number) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>{s.description}</Text>
                                    <Text style={{ fontSize: 11, color: colors.iconMuted, marginTop: 2 }}>{new Date(s.createdAt).toLocaleDateString()}</Text>
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '800', color: '#E53E3E' }}>+${Number(s.total).toLocaleString()}</Text>
                            </View>
                        ))}
                    </SurfaceCard>
                )}

                {booking.status === 'completed' && !reviewSubmitted && !booking.review && (
                    <TouchableOpacity style={s.reviewPrompt} onPress={() => setShowReview(true)} activeOpacity={0.8} accessibilityLabel="Rate your experience" accessibilityRole="button">
                        <View style={s.reviewPromptLeft}>
                            <Ionicons name="star" size={24} color="#FBB142" />
                            <View style={{ flex: 1 }}>
                                <Text style={s.reviewPromptTitle}>How was your experience?</Text>
                                <Text style={s.reviewPromptSub}>Tap to rate {booking.location?.name}</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#FBB142" />
                    </TouchableOpacity>
                )}

                {(reviewSubmitted || booking.review) && (
                    <SurfaceCard variant="flat" padding={16} style={{ marginTop: 24, backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#166534', flex: 1 }}>You reviewed this store. Thank you!</Text>
                        </View>
                    </SurfaceCard>
                )}

                <PrimaryButton variant="secondary" style={{ marginTop: 24 }} onPress={() => setShowClaim(true)} accessibilityLabel="Report an issue">
                    <Ionicons name="alert-circle-outline" size={20} color={colors.iconColor} />
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>Report an Issue</Text>
                </PrimaryButton>

                <PrimaryButton style={{ marginTop: 12 }} accessibilityLabel="Contact support">
                    <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
                    <Text style={s.primaryBtnText}>Contact Support</Text>
                </PrimaryButton>

                {booking.status === 'completed' && (
                    <PrimaryButton variant="secondary" style={{ marginTop: 12 }} accessibilityLabel="Get receipt">
                        <Ionicons name="document-text-outline" size={20} color={colors.iconColor} />
                        <Text style={{ fontWeight: '700', fontSize: 16 }}>Get Receipt</Text>
                    </PrimaryButton>
                )}

                <SurfaceCard variant="flat" padding={16} style={{ marginTop: 24, backgroundColor: '#DBEAFE', borderColor: '#93C5FD', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialCommunityIcons name="shield-check" size={20} color={colors.iconColor} />
                        <Text style={{ fontSize: 11, fontWeight: '800', color: colors.iconColor, letterSpacing: 0.5 }}>PROTECTED UP TO $2,500</Text>
                    </View>
                </SurfaceCard>
            </View>

            <ReviewModal isVisible={showReview} onClose={() => setShowReview(false)} booking={booking} onSuccess={() => setReviewSubmitted(true)} />

            <BottomSheetModal visible={showClaim} onClose={() => setShowClaim(false)}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>Report an Issue</Text>
                <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 20 }}>
                    Describe what happened and add photos as evidence. We'll review and get back to you.
                </Text>

                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textLabel, marginBottom: 6 }}>Issue Type</Text>
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                    {(['damage', 'loss', 'theft', 'other'] as ClaimType[]).map((t) => (
                        <TouchableOpacity key={t} onPress={() => setClaimType(t)}
                            style={[{
                                paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                borderWidth: 1.5, borderColor: colors.border,
                            }, claimType === t && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: claimType === t ? '#FFF' : colors.textMuted }}>
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textLabel, marginBottom: 6 }}>Subject</Text>
                <TextInput style={s.claimInput} placeholder="e.g. Damaged suitcase handle" placeholderTextColor={colors.iconMuted}
                    value={claimSubject} onChangeText={setClaimSubject} />

                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textLabel, marginBottom: 6 }}>Description</Text>
                <TextInput style={[s.claimInput, { height: 100, textAlignVertical: 'top' }]} placeholder="Describe what happened in detail..."
                    placeholderTextColor={colors.iconMuted} multiline value={claimDesc} onChangeText={setClaimDesc} />

                {claimPhotos.length > 0 && (
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                        {claimPhotos.map((uri, i) => (
                            <View key={i} style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden' }}>
                                <Image source={{ uri }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                <TouchableOpacity style={{ position: 'absolute', top: -4, right: -4 }}
                                    onPress={() => setClaimPhotos((p) => p.filter((_, idx) => idx !== i))}>
                                    <Ionicons name="close-circle" size={20} color={colors.dotRed} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={s.claimPhotoBtn} onPress={async () => {
                    const { status } = await ImagePicker.requestCameraPermissionsAsync();
                    if (status !== 'granted') { Toast.show({ type: 'error', text1: 'Permission needed', text2: 'Camera access is required.' }); return; }
                    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 0.7 });
                    if (!result.canceled && result.assets[0]) {
                        const url = await uploadService.uploadImage(result.assets[0].uri, 'claims');
                        setClaimPhotos((p) => [...p, url]);
                    }
                }} disabled={claimPhotos.length >= 4}>
                    <Ionicons name="camera-outline" size={20} color={colors.iconColor} />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.iconColor }}>
                        {claimPhotos.length >= 4 ? 'Max 4 photos' : 'Add Photo'}
                    </Text>
                </TouchableOpacity>

                <PrimaryButton style={{ marginTop: 20 }} loading={submittingClaim}
                    disabled={!claimSubject.trim() || !claimDesc.trim() || submittingClaim}
                    onPress={async () => {
                        setSubmittingClaim(true);
                        try {
                            await claimService.create({
                                bookingId: booking.id, subject: claimSubject, description: claimDesc,
                                type: claimType, photos: claimPhotos.length > 0 ? claimPhotos : undefined,
                            });
                            setShowClaim(false);
                            setClaimSubject(''); setClaimDesc(''); setClaimType('damage'); setClaimPhotos([]);
                            Toast.show({ type: 'success', text1: 'Report Submitted', text2: 'We have received your report and will review it shortly.' });
                        } catch (e: any) {
                            Toast.show({ type: 'error', text1: 'Error', text2: e?.response?.data?.message || 'Could not submit report' });
                        } finally { setSubmittingClaim(false); }
                    }}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16 }}>Submit Report</Text>
                </PrimaryButton>
            </BottomSheetModal>
        </ScrollView>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surfaceCardLow },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surfaceCardLow },
    errorText: { color: colors.dotRed, marginBottom: 10 },
    navBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', paddingTop: 60 },
    navTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
    mainContent: { paddingHorizontal: 20, paddingBottom: 40 },
    statusBadge: { flexDirection: 'row', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, alignItems: 'center' },
    badgeActive: { backgroundColor: '#FF6D00', color: '#FFF' },
    badgeCompleted: { backgroundColor: colors.surfaceLight, color: '#475569' },
    badgeCancelled: { backgroundColor: colors.errorLight, color: colors.error },
    statusBadgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    bookingId: { fontSize: 32, fontWeight: 'bold', color: colors.textPrimary, marginTop: 10 },
    bookingDate: { fontSize: 16, color: colors.textMuted, marginTop: 4 },
    storeImage: { width: '100%', height: 160 },
    storeTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
    storeAddress: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
    storeButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
    storeBtn: { flex: 1, flexDirection: 'row', backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 6 },
    storeBtnText: { fontSize: 12, fontWeight: 'bold', color: colors.iconColor },
    timeRow: { flexDirection: 'row', gap: 16 },
    timeIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    timeLabel: { fontSize: 10, fontWeight: '800', color: colors.textMuted, letterSpacing: 1 },
    timeValue: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
    timeHour: { fontSize: 14, color: colors.textMuted },
    primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    reviewPrompt: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#FFFBEB', borderRadius: 20, padding: 18, marginTop: 24,
        borderWidth: 1, borderColor: '#FDE68A',
    },
    reviewPromptLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
    reviewPromptTitle: { fontSize: 16, fontWeight: '700', color: '#92400E' },
    reviewPromptSub: { fontSize: 13, color: '#B45309', marginTop: 2 },
    claimInput: {
        backgroundColor: colors.surfaceLight, borderRadius: 14, padding: 16, fontSize: 15,
        color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: 16,
    },
    claimPhotoBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: colors.surfaceLight, borderRadius: 14, padding: 14,
        borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed',
    },
});
