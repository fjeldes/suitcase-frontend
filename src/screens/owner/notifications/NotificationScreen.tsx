import { ROUTES } from '@/constants/routes';
import { useNotifications } from '@/hooks/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { styles } from './Notifications.style';
dayjs.extend(relativeTime);

const CATEGORIES = ['All Notifications', 'Bookings', 'System', 'Marketing'];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('All Notifications');
  const router = useRouter();

  // Hook conectado a TanStack Query y al servicio de NestJS
  const {
    notifications,
    isLoading,
    markAllRead,
    refetch,
    isRefetching
  } = useNotifications(activeTab);

  const handleNotificationPress = (item: any) => {
    // Si la notificación está vinculada a una reserva, navegamos directamente
    if (item.metadata?.bookingId) {
      router.push(ROUTES.OWNER.BOOKING_DETAIL(item.metadata.bookingId.id))
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Superior */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.avatarMini}>
          <Ionicons name="shield-checkmark" size={18} color="#0A0E5E" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0A0E5E" />
        }
      >
        {/* Intro Section */}
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>Activity Overview</Text>
          <Text style={styles.sectionSubtitle}>
            Manage your business pulse with real-time updates and critical monitoring.
          </Text>
          <TouchableOpacity
            style={styles.markAllButton}
            activeOpacity={0.7}
            onPress={() => markAllRead()}
          >
            <Ionicons name="checkmark-done-outline" size={18} color="#0A0E5E" />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* Filtros por Categoría */}
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

        {/* Feed de Actividad Real */}
        <View style={styles.listContainer}>
          {isLoading && !isRefetching ? (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#0A0E5E" />
            </View>
          ) : (
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                type={item.category === 'TRANSACTIONAL' ? 'CRITICAL' : 'LOG'}
                title={item.title}
                // USANDO DAYJS: Convierte el ISO de la DB a "2 hours ago"
                time={dayjs(item.createdAt).fromNow(true).toUpperCase() + ' AGO'}
                description={item.message}
                isUnread={!item.isRead}
                showButtons={item.category === 'TRANSACTIONAL' && !item.isRead}
                onPrimaryPress={() => handleNotificationPress(item)}
              />
            ))
          )}

          {/* Estado Vacío */}
          {!isLoading && notifications.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 40 }}>
              <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
              <Text style={{ color: '#64748B', textAlign: 'center', marginTop: 12, fontSize: 16 }}>
                Everything is up to date! Check back later for new activities.
              </Text>
            </View>
          )}
        </View>

        {/* Acción de Carga / Refresh */}
        {!isLoading && notifications.length > 0 && (
          <TouchableOpacity
            style={styles.loadMore}
            activeOpacity={0.6}
            onPress={() => refetch()}
          >
            <Text style={styles.loadMoreText}>Refresh history</Text>
            <Ionicons name="refresh-outline" size={20} color="#0A0E5E" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}