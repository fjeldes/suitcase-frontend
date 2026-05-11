import { useDashboardStats } from '@/hooks/useDashboard';
import { useOwnerStore } from '@/store/useOwnerStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StatsDetailScreen() {
  const router = useRouter();
  const { activeLocationId, activeLocationName } = useOwnerStore();
  const { data: stats } = useDashboardStats(activeLocationId || undefined, { enabled: !!activeLocationId });

  if (!stats) return null;

  const pct = (curr: number, tot: number) => tot > 0 ? Math.min(Math.round((curr / tot) * 100), 100) : 0;

  const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#1A202C' }}>{label}</Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#0A0E5E' }}>{value}</Text>
      </View>
      <View style={{ height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ width: `${pct(value, max)}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
      </View>
    </View>
  );

  const occupancy = stats.occupancy || [];
  const smallTotal = occupancy.find((o: any) => o.label.includes('Small'))?.percentage || 0;
  const mediumTotal = occupancy.find((o: any) => o.label.includes('Medium'))?.percentage || 0;
  const largeTotal = occupancy.find((o: any) => o.label.includes('Large'))?.percentage || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{activeLocationName || 'Stats'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Revenue Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REVENUE</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={styles.label}>Today</Text>
                <Text style={styles.value}>${stats.revenue.today.toFixed(0)}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Yesterday</Text>
                <Text style={styles.value}>${stats.revenue.yesterday.toFixed(0)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.label}>Change</Text>
              <Text style={[styles.value, stats.revenue.percentageIncrease >= 0 ? { color: '#22C55E' } : { color: '#E53E3E' }]}>
                {stats.revenue.percentageIncrease >= 0 ? '+' : ''}{stats.revenue.percentageIncrease}%
              </Text>
            </View>
          </View>
        </View>

        {/* Bookings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BOOKINGS</Text>
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              <View>
                <Text style={styles.label}>Active</Text>
                <Text style={styles.value}>{stats.bookings.activeCount}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Today Pickups</Text>
                <Text style={styles.value}>{stats.pickups.totalToday}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Today Dropoffs</Text>
                <Text style={styles.value}>{stats.dropoffs.totalToday}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Occupancy / Capacity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAPACITY</Text>
          <View style={styles.card}>
            <Bar label="Small Bags" value={smallTotal} max={100} color="#0A0E5E" />
            <Bar label="Medium Bags" value={mediumTotal} max={100} color="#6366F1" />
            <Bar label="Large Bags" value={largeTotal} max={100} color="#FF6D00" />
          </View>
        </View>

        {/* Next Events */}
        {(stats.pickups.nextPickup || stats.dropoffs.nextDropoff) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NEXT EVENTS</Text>
            <View style={styles.card}>
              {stats.dropoffs.nextDropoff && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                  <Ionicons name="log-in-outline" size={20} color="#FF6D00" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A202C' }}>Drop-off: {stats.dropoffs.nextDropoff.customerName}</Text>
                    <Text style={{ fontSize: 12, color: '#64748B' }}>{stats.dropoffs.nextDropoff.time} • {stats.dropoffs.nextDropoff.itemsDetail}</Text>
                  </View>
                </View>
              )}
              {stats.pickups.nextPickup && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 }}>
                  <Ionicons name="log-out-outline" size={20} color="#22C55E" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A202C' }}>Pickup: {stats.pickups.nextPickup.customerName}</Text>
                    <Text style={{ fontSize: 12, color: '#64748B' }}>{stats.pickups.nextPickup.time} • {stats.pickups.nextPickup.itemsDetail}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FE' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  scroll: { padding: 20, paddingBottom: 120 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 12, fontWeight: '800', color: '#8898AA', letterSpacing: 1,
    marginBottom: 10, marginLeft: 4,
  },
  card: {
    backgroundColor: 'white', borderRadius: 20, padding: 20,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5,
  },
  label: { fontSize: 12, color: '#64748B', fontWeight: '500', marginBottom: 4 },
  value: { fontSize: 24, fontWeight: '800', color: '#0A0E5E' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
});
