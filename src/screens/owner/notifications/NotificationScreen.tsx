import { ROUTES } from '@/constants/routes';
import { useNotifications } from '@/hooks/useNotifications';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationItem } from './NotificationItem';
import { createStyles } from './Notifications.style';
dayjs.extend(relativeTime);

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const CATEGORIES = useMemo(() => [
    t('notifications.category_all'),
    t('notifications.category_bookings'),
    t('notifications.category_system'),
    t('notifications.category_marketing'),
  ], [t]);
  const [activeTab, setActiveTab] = useState(t('notifications.category_all'));
  const router = useRouter();
  const { colors } = useTheme();

  const {
    notifications,
    isLoading,
    markAllRead,
    refetch,
    isRefetching
  } = useNotifications(activeTab);

  useEffect(() => {
    markAllRead();
  }, []);

  const handleNotificationPress = (item: any) => {
    if (item.metadata?.bookingId) {
      router.push(ROUTES.OWNER.BOOKING_DETAIL(item.metadata.bookingId.id))
    }
  };

  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="chevron-back" size={28} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
        <View style={styles.avatarMini}>
          <Ionicons name="shield-checkmark" size={18} color={colors.iconColor} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.iconColor} />
        }
      >
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>{t('notifications.activity_overview')}</Text>
          <Text style={styles.sectionSubtitle}>{t('notifications.subtitle')}</Text>
          <TouchableOpacity
            style={styles.markAllButton}
            activeOpacity={0.7}
            onPress={() => markAllRead()}
            accessibilityLabel="Mark all notifications as read"
            accessibilityRole="button"
          >
            <Ionicons name="checkmark-done-outline" size={18} color={colors.iconColor} />
            <Text style={styles.markAllText}>{t('notifications.mark_all_read')}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterTab,
                  activeTab === cat && styles.filterTabActive
                ]}
                onPress={() => setActiveTab(cat)}
                activeOpacity={0.8}
                accessibilityLabel={`Filter by ${cat}`}
                accessibilityRole="button"
              >
                <Text style={[
                  styles.filterTabText,
                  activeTab === cat && styles.filterTabTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {isLoading && !isRefetching ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={colors.iconColor} />
            </View>
          ) : (
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                type={item.category === 'TRANSACTIONAL' ? 'CRITICAL' : 'LOG'}
                title={item.title}
                time={dayjs(item.createdAt).fromNow(true).toUpperCase() + ' ' + t('notifications.ago')}
                description={item.message}
                isUnread={!item.isRead}
                showButtons={item.category === 'TRANSACTIONAL' && !item.isRead}
                onPrimaryPress={() => handleNotificationPress(item)}
              />
            ))
          )}

          {!isLoading && notifications.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 40 }}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.iconMuted} />
              <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 12, fontSize: 16 }}>
                {t('notifications.empty')}
              </Text>
            </View>
          )}
        </View>

        {!isLoading && notifications.length > 0 && (
          <TouchableOpacity
            style={styles.loadMore}
            activeOpacity={0.6}
            onPress={() => refetch()}
            accessibilityLabel="Refresh notifications"
            accessibilityRole="button"
          >
            <Text style={styles.loadMoreText}>{t('notifications.refresh')}</Text>
            <Ionicons name="refresh-outline" size={20} color={colors.iconColor} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
