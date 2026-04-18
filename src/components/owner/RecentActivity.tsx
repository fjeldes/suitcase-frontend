import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityProps {
  type: 'BOOKING' | 'COLLECTION' | 'REVIEW';
  title: string;
  location: string;
  time: string;
  statusText?: string;
  isLast?: boolean;
}

const ActivityItem = ({ type, title, location, time, statusText, isLast }: ActivityProps) => {
  // Configuración según el tipo de actividad
  const config = {
    BOOKING: { color: '#B45309', icon: 'time-outline', badgeBg: '#F1F5F9', badgeText: '#1E293B' },
    COLLECTION: { color: '#818CF8', icon: 'checkmark-circle-outline', badgeBg: '#F0FDF4', badgeText: '#166534' },
    REVIEW: { color: '#CBD5E1', icon: 'star', badgeBg: 'transparent', badgeText: '' },
  };

  const current = config[type];

  return (
    <View style={styles.itemWrapper}>
      {/* Línea de tiempo y Círculo */}
      <View style={styles.timelineContainer}>
        <View style={[styles.dot, { backgroundColor: current.color }]} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Contenido */}
      <View style={styles.contentContainer}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{location} · {time}</Text>
        
        {type === 'REVIEW' ? (
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons key={s} name="star" size={14} color="#F59E0B" style={{ marginRight: 2 }} />
            ))}
          </View>
        ) : (
          <View style={[styles.badge, { backgroundColor: current.badgeBg }]}>
            <Ionicons name={current.icon} size={12} color={current.badgeText} />
            <Text style={[styles.badgeText, { color: current.badgeText }]}>{statusText}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export const RecentActivity = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      <View style={styles.listCard}>
        <ActivityItem 
          type="BOOKING"
          title="New Booking: 2x Suitcase"
          location="The Grand Archive"
          time="12:45 PM"
          statusText="Pending Drop-off"
        />
        <ActivityItem 
          type="COLLECTION"
          title="Collection Completed"
          location="St. Pancras Vault"
          time="10:20 AM"
          statusText="Order #8921"
        />
        <ActivityItem 
          type="REVIEW"
          title="Review Received"
          location="The Grand Archive"
          time="Yesterday"
          isLast={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 25, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 20 },
  listCard: { backgroundColor: '#fff', borderRadius: 24, paddingVertical: 20 },
  itemWrapper: { flexDirection: 'row', minHeight: 80, paddingHorizontal: 20 },
  timelineContainer: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 14, height: 14, borderRadius: 7, zIndex: 1 },
  line: { flex: 1, width: 2, backgroundColor: '#F1F5F9', marginVertical: 4 },
  contentContainer: { flex: 1, paddingBottom: 25 },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  activitySubtitle: { fontSize: 14, color: '#64748B', marginBottom: 10 },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10,
    gap: 6
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  starsRow: { flexDirection: 'row', marginTop: 4 }
});