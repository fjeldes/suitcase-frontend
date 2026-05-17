import { ROUTES } from '@/constants/routes';
import { useMyLocations } from '@/hooks/useDashboard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function MyStoresScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: stores, isLoading, refetch } = useMyLocations();

  // Función para navegar a la edición
  const handleEdit = (locationId: string) => {
    router.push({
      pathname: ROUTES.OWNER.EDIT_STORE,
      params: { locationId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1F71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('createLocation.storage_partners')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push(ROUTES.OWNER.CREATE_LOCATION)}
        >
          <Ionicons name="add" size={28} color="#1A1F71" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading && !!stores} onRefresh={refetch} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.mainTitle}>{t('profile.my_stores')}</Text>
          <Text style={styles.subtitle}>{t('createLocation.manage_stores')}</Text>

          {isLoading && !stores && (
            <View style={{ paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#1A1F71" />
            </View>
          )}

          {!isLoading && stores?.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('createLocation.no_stores')}</Text>
            </View>
          )}

          {/* Listado de Tiendas */}
          <View style={styles.listContainer}>
            {stores?.map((store) => (
              <TouchableOpacity
                key={store.id}
                style={styles.storeCard}
                onPress={() => handleEdit(store.id)}
                activeOpacity={0.7}
              >
                <View style={styles.cardMainRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.storeHeader}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: store.status === 'active' ? '#10B981' : store.status === 'rejected' ? '#EF4444' : '#F59E0B' }
                        ]}
                      />
                      <Text style={styles.storeName}>{store.name}</Text>
                      {store.status && store.status !== 'active' && (
                        <View style={[styles.statusBadge, { backgroundColor: store.status === 'rejected' ? '#FEE2E2' : '#FEF3C7' }]}>
                          <Text style={[styles.statusBadgeText, { color: store.status === 'rejected' ? '#DC2626' : '#D97706' }]}>
                            {store.status.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.storeAddress} numberOfLines={1}>{store.address}</Text>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={24} color="#CBD5E1" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('createLocation.add_new_store')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.dashedButton}
            onPress={() => router.push(ROUTES.OWNER.CREATE_LOCATION)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="business" size={24} color="#1A1F71" />
            </View>
            <Text style={styles.registerTitle}>{t('createLocation.register_new')}</Text>
            <Text style={styles.registerSubtitle}>{t('createLocation.setup_time')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1F71' },
  addButton: { padding: 4 },
  scrollContent: { paddingBottom: 40 },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  mainTitle: { fontSize: 32, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748B', lineHeight: 22, marginBottom: 32 },
  emptyContainer: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#94A3B8' },
  listContainer: { gap: 16, marginBottom: 32 },
  storeCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  cardMainRow: { flexDirection: 'row', alignItems: 'center' },
  storeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  storeName: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  storeAddress: { fontSize: 14, color: '#64748B', marginLeft: 18 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  statusBadgeText: { fontSize: 9, fontWeight: '800' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.5 },
  dashedButton: { borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 24, padding: 32, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  registerTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E', marginBottom: 4 },
  registerSubtitle: { fontSize: 14, color: '#64748B' }
});