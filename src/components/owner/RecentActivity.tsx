import { ROUTES } from '@/constants/routes';
import { useActivityLogs } from '@/hooks/useActivityLogs';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from './RecentActivity.styles';

interface ActivityProps {
  type: 'BOOKING' | 'COLLECTION' | 'REVIEW' | 'CANCELLED';
  title: string;
  location: string;
  time: string;
  statusText?: string;
  isLast?: boolean;
}

const ActivityItem = ({ type, title, location, time, statusText, isLast }: ActivityProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const config = {
    BOOKING: { color: '#B45309', icon: 'time-outline' as const, badgeBg: colors.surfaceLight, badgeText: colors.textPrimary },
    COLLECTION: { color: '#818CF8', icon: 'checkmark-circle-outline' as const, badgeBg: '#F0FDF4', badgeText: '#166534' },
    REVIEW: { color: '#CBD5E1', icon: 'star' as const, badgeBg: 'transparent', badgeText: '' },
    CANCELLED: { color: '#F87171', icon: 'close-circle-outline' as const, badgeBg: '#FEF2F2', badgeText: '#991B1B' },
  };

  const current = config[type];

  return (
    <View style={styles.itemWrapper}>
      <View style={styles.timelineContainer}>
        <View style={[styles.dot, { backgroundColor: current.color }]} />
        {!isLast && <View style={styles.line} />}
      </View>

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

export const RecentActivity = ({ maxItems = 3 }: { maxItems?: number }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data: logs, isLoading } = useActivityLogs(10);

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
        <ActivityIndicator color={colors.iconColor} style={{ marginTop: 20 }} />
      </View>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyCard}>
          <Ionicons name="list-circle-outline" size={32} color={colors.iconMuted} />
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
        {logs.slice(0, maxItems).map((log, idx) => {
          const isLast = idx === Math.min(logs.length, maxItems) - 1;
          const timeFormatted = formatTime(log.createdAt);
          const locationName = log.location?.name || 'Store';

          const props = (type: ActivityProps['type'], title: string, statusText?: string) => (
            <ActivityItem key={log.id} type={type} title={title} location={locationName} time={timeFormatted} statusText={statusText} isLast={isLast} />
          );

          if (log.type === 'NEW_BOOKING') return props('BOOKING', `New Booking: ${log.payload?.itemsSummary || 'Items'}`, log.payload?.status);
          if (log.type === 'COLLECTION_COMPLETED') return props('COLLECTION', 'Collection Completed', log.payload?.orderNumber);
          if (log.type === 'BOOKING_CANCELLED') return props('CANCELLED', 'Booking Cancelled', log.payload?.orderNumber);
          if (log.type === 'REVIEW_RECEIVED') return props('REVIEW', 'Review Received');
          return props('BOOKING', 'Activity Logged');
        })}
      </View>

      {logs.length > maxItems && (
        <TouchableOpacity style={{ padding: 14, alignItems: 'center' }} onPress={() => router.push(ROUTES.OWNER.ACTIVITY_LOGS)}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.iconColor }}>View All Activity</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
