import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActivityLogsScreen() {
  const router = useRouter();
  const [limit] = useState(50);
  const { data: logs, isLoading, refetch, isRefetching } = useActivityLogs(limit);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const yesterday = new Date(); yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActivityConfig = (type: string) => {
    switch (type) {
      case 'NEW_BOOKING': return { icon: 'time-outline' as const, color: '#B45309', label: 'New Booking' };
      case 'COLLECTION_COMPLETED': return { icon: 'checkmark-circle-outline' as const, color: '#818CF8', label: 'Collection Completed' };
      case 'CHECK_IN': return { icon: 'log-in-outline' as const, color: '#22C55E', label: 'Check In' };
      case 'CHECK_OUT': return { icon: 'log-out-outline' as const, color: '#FF6D00', label: 'Check Out' };
      case 'BOOKING_CANCELLED': return { icon: 'close-circle-outline' as const, color: '#F87171', label: 'Cancelled' };
      case 'REVIEW_RECEIVED': return { icon: 'star' as const, color: '#F59E0B', label: 'Review' };
      default: return { icon: 'information-circle-outline' as const, color: '#64748B', label: 'Activity' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Activity Log</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#0A0E5E" /></View>
      ) : (
        <FlatList
          data={logs || []}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="list-circle-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyText}>No activity recorded yet</Text>
            </View>
          }
          renderItem={({ item }) => {
            const config = getActivityConfig(item.type);
            return (
              <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: config.color + '20' }]}>
                  <Ionicons name={config.icon} size={20} color={config.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{config.label}</Text>
                  {item.location?.name && <Text style={styles.rowSub}>{item.location.name}</Text>}
                </View>
                <Text style={styles.rowTime}>{formatTime(item.createdAt)}</Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FE' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#94A3B8', fontSize: 15, marginTop: 12 },
  list: { padding: 20, paddingBottom: 120 },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16,
    borderRadius: 16, marginBottom: 8, gap: 12,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 3,
  },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#1A202C' },
  rowSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  rowTime: { fontSize: 11, color: '#94A3B8' },
});
