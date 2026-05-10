import { useActivityLogs } from '@/hooks/useActivityLogs';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { styles } from './RecentActivity.styles';

interface ActivityProps {
  type: 'BOOKING' | 'COLLECTION' | 'REVIEW' | 'CANCELLED';
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
    CANCELLED: { color: '#F87171', icon: 'close-circle-outline', badgeBg: '#FEF2F2', badgeText: '#991B1B' },
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
  const { data: logs, isLoading } = useActivityLogs(5);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ActivityIndicator color="#0A0E5E" style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="list-circle-outline" size={32} color="#94A3B8" />
          <Text style={styles.emptyTextTitle}>No activity yet</Text>
          <Text style={styles.emptyText}>When bookings are made, they will appear here.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      <View style={styles.listCard}>
        {logs.map((log, idx) => {
          const isLast = idx === logs.length - 1;
          const timeFormatted = formatTime(log.createdAt);
          const locationName = log.location?.name || 'Store';

          if (log.type === 'NEW_BOOKING') {
            return (
              <ActivityItem
                key={log.id}
                type="BOOKING"
                title={`New Booking: ${log.payload?.itemsSummary || 'Items'}`}
                location={locationName}
                time={timeFormatted}
                statusText={log.payload?.status}
                isLast={isLast}
              />
            );
          }

          if (log.type === 'COLLECTION_COMPLETED') {
            return (
              <ActivityItem
                key={log.id}
                type="COLLECTION"
                title="Collection Completed"
                location={locationName}
                time={timeFormatted}
                statusText={log.payload?.orderNumber}
                isLast={isLast}
              />
            );
          }

          if (log.type === 'BOOKING_CANCELLED') {
            return (
              <ActivityItem
                key={log.id}
                type="CANCELLED"
                title="Booking Cancelled"
                location={locationName}
                time={timeFormatted}
                statusText={log.payload?.orderNumber}
                isLast={isLast}
              />
            );
          }

          if (log.type === 'REVIEW_RECEIVED') {
            return (
              <ActivityItem
                key={log.id}
                type="REVIEW"
                title="Review Received"
                location={locationName}
                time={timeFormatted}
                isLast={isLast}
              />
            );
          }

          // Fallback para otros tipos de evento
          return (
            <ActivityItem
              key={log.id}
              type="BOOKING"
              title="Activity Logged"
              location={locationName}
              time={timeFormatted}
              isLast={isLast}
            />
          );
        })}
      </View>
    </View>
  );
};