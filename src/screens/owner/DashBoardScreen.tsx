import { ROUTES } from "@/constants/routes";
import { CapacitySection } from "@/components/owner/dashboard/CapacityCircles";
import { HeaderDashboard } from "@/components/owner/dashboard/Header";
import { StatMiniCards } from "@/components/owner/dashboard/StatMiniCards";
import { RecentActivity } from "@/components/owner/RecentActivity";
import { staffService } from "@/services/staffService";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStats, useMyLocations } from "@/hooks/useDashboard";
import { useOwnerStore } from "@/store/useOwnerStore";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import dayjs from 'dayjs';
import { styles } from "./DashBoardScreen.styles";
import { LoadingDashboard } from "./LoadingDashboard";

export default function DashboardScreen() {
    const router = useRouter();
    const { data: stores } = useMyLocations();
    const { data: staffLocations } = useQuery({
        queryKey: ['staff-locations'],
        queryFn: () => staffService.getMyLocations(),
    });
    const [showSelector, setShowSelector] = useState(false);
    const { activeLocationId, activeLocationName, setActiveLocation } = useOwnerStore();
    const { user } = useAuthStore();
    const isStaff = user?.roles?.includes('staff');
    const isOwner = user?.roles?.includes('owner');
    const assignedLocations = isStaff ? (staffLocations || []).map((s: any) => s.location).filter(Boolean) : [];

    useEffect(() => {
        const locations = isStaff ? assignedLocations : stores;
        if (locations && locations.length > 0 && !activeLocationId) {
            setActiveLocation(locations[0].id, locations[0].name);
        }
    }, [stores, assignedLocations, activeLocationId, isStaff]);

    const { data: dashboardData, isLoading, refetch } = useDashboardStats(
        activeLocationId || undefined,
        { enabled: !!activeLocationId },
    );

    if ((isStaff && !staffLocations) || (!isStaff && !stores)) return <LoadingDashboard />;
    if (isStaff && assignedLocations.length === 0) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Ionicons name="business-outline" size={64} color="#CBD5E0" />
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginTop: 16, textAlign: 'center' }}>
                    No store assigned yet
                </Text>
                <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                    A store owner needs to invite you. Ask them to send you an invitation.
                </Text>
            </SafeAreaView>
        );
    }
    if (!activeLocationId) return <LoadingDashboard />;
    if (isLoading || !dashboardData) return <LoadingDashboard />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderDashboard
                onPress={() => stores && stores.length > 1 ? setShowSelector(true) : null}
                showChevron={stores && stores.length > 1}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
            >
                {/* Modal Selector */}
                <Modal visible={showSelector} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            activeOpacity={1}
                            onPress={() => setShowSelector(false)}
                        />
                        <View style={{
                            backgroundColor: '#fff',
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            paddingHorizontal: 25,
                            paddingTop: 15,
                            paddingBottom: 40, // Espacio extra para el notch/barra inferior
                            maxHeight: '70%'
                        }}>
                            {/* Tirador visual para indicar que se puede deslizar/cerrar */}
                            <View style={{
                                width: 40,
                                height: 5,
                                backgroundColor: '#E2E8F0',
                                borderRadius: 3,
                                alignSelf: 'center',
                                marginBottom: 20
                            }} />

                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0A0E5E', marginBottom: 20 }}>
                                Select a location
                            </Text>

                            <FlatList
                                data={stores}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    const isSelected = item.id === activeLocationId;
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                paddingVertical: 18,
                                                borderBottomWidth: 1,
                                                borderBottomColor: '#F8FAFC',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}
                                                    onPress={() => {
                                                        setActiveLocation(item.id, item.name);
                                                        setShowSelector(false);
                                                    }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                <View style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 8,
                                                    backgroundColor: isSelected ? '#EEF2FF' : '#F1F5F9',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <MaterialCommunityIcons
                                                        name="storefront"
                                                        size={18}
                                                        color={isSelected ? '#6366F1' : '#64748B'}
                                                    />
                                                </View>
                                                <Text style={{
                                                    fontSize: 16,
                                                    color: isSelected ? '#0A0E5E' : '#334155',
                                                    fontWeight: isSelected ? '700' : '500'
                                                }}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            {isSelected && <Ionicons name="checkmark-circle" size={24} color="#6366F1" />}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Staff sees a simplified view */}
                {isStaff && (
                    <View style={{ padding: 16, backgroundColor: '#EEF2FF', borderRadius: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="briefcase-outline" size={20} color="#0A0E5E" />
                        <Text style={{ fontSize: 13, color: '#0A0E5E', fontWeight: '500', flex: 1 }}>
                            Staff view — showing data for {activeLocationName || 'assigned location'}
                        </Text>
                    </View>
                )}

                <StatMiniCards
                    todayRevenue={dashboardData.revenue.today}
                    activeBookings={dashboardData.bookings.activeCount}
                    pickupsToday={dashboardData.pickups.totalToday}
                    dropoffsToday={dashboardData.dropoffs.totalToday}
                    percentageIncrease={dashboardData.revenue.percentageIncrease}
                    onViewDetails={() => router.push(ROUTES.OWNER.STATS)}
                />

                {/* Upcoming Events */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#8898AA', letterSpacing: 1, marginBottom: 10, marginLeft: 4 }}>
                        UPCOMING TODAY
                    </Text>
                    <View style={{ backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 }}>
                        {dashboardData.dropoffs.nextDropoff && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                                <View style={{ width: 40, height: 40, backgroundColor: '#FFF7ED', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                    <Ionicons name="log-in-outline" size={20} color="#FF6D00" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A202C' }}>Drop-off: {dashboardData.dropoffs.nextDropoff.customerName}</Text>
                                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{dashboardData.dropoffs.nextDropoff.time} • {dashboardData.dropoffs.nextDropoff.itemsDetail}</Text>
                                </View>
                            </View>
                        )}
                        {dashboardData.pickups.nextPickup && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: dashboardData.dropoffs.nextDropoff ? 1 : 0, borderBottomColor: '#F1F5F9' }}>
                                <View style={{ width: 40, height: 40, backgroundColor: '#F0FDF4', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                                    <Ionicons name="log-out-outline" size={20} color="#22C55E" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A202C' }}>Pickup: {dashboardData.pickups.nextPickup.customerName}</Text>
                                    <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{dashboardData.pickups.nextPickup.time} • {dashboardData.pickups.nextPickup.itemsDetail}</Text>
                                </View>
                            </View>
                        )}
                        {!dashboardData.dropoffs.nextDropoff && !dashboardData.pickups.nextPickup && (
                            <View style={{ alignItems: 'center', padding: 24 }}>
                                <Text style={{ fontSize: 14, color: '#94A3B8' }}>No upcoming events today</Text>
                            </View>
                        )}
                        <TouchableOpacity style={{ padding: 14, alignItems: 'center' }} onPress={() => router.navigate(ROUTES.OWNER.BOOKINGS)}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0E5E' }}>View All Bookings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#8898AA', letterSpacing: 1, marginBottom: 10, marginLeft: 4 }}>
                        QUICK ACTIONS
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, gap: 8 }} onPress={() => router.push(ROUTES.OWNER.SCANNER)}>
                            <View style={{ width: 48, height: 48, backgroundColor: '#EEF2FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="qr-code-outline" size={24} color="#0A0E5E" />
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A202C' }}>Scan QR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, gap: 8 }} onPress={() => router.navigate(ROUTES.OWNER.BOOKINGS)}>
                            <View style={{ width: 48, height: 48, backgroundColor: '#EEF2FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="briefcase-outline" size={24} color="#0A0E5E" />
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A202C' }}>Bookings</Text>
                        </TouchableOpacity>
                        {!isStaff && (
                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5, gap: 8 }} onPress={() => router.navigate(ROUTES.OWNER.STORES)}>
                                <View style={{ width: 48, height: 48, backgroundColor: '#EEF2FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }}>
                                    <Ionicons name="storefront-outline" size={24} color="#0A0E5E" />
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1A202C' }}>Stores</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {!isStaff && <CapacitySection data={dashboardData.occupancy} />}

                {!isStaff && <RecentActivity />}
            </ScrollView>
        </SafeAreaView>
    );
}