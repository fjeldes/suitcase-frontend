import { ROUTES } from '@/constants/routes'
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyLocations } from '@/hooks/useDashboard'
import { useOwnerStore } from '@/store/useOwnerStore'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { theme } from '@/styles/globalStyles';

export const HeaderDashboard = ({
  onPress,
  showChevron
}: {
  onPress?: () => void;
  showChevron?: boolean;
}) => {
  const router = useRouter()
  const { data: stores } = useMyLocations();
  const { user } = useAuthStore();
  const isStaff = user?.roles?.includes('staff');
  const { data: staffLocations } = useQuery({
    queryKey: ['staff-locations'],
    queryFn: () => staffService.getMyLocations(),
  });
  const { activeLocationId, setActiveLocation, activeLocationName } = useOwnerStore();
  const assignedLocations = isStaff ? (staffLocations || []).map((s: any) => s.location).filter(Boolean) : [];

  useEffect(() => {
    const locations = isStaff ? assignedLocations : stores;
    if (locations && locations.length > 0 && !activeLocationId) {
      setActiveLocation(locations[0].id, locations[0].name);
    }
  }, [stores, assignedLocations, activeLocationId, isStaff]);

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerLeft} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
        <View style={styles.storeIconBg}>
          <MaterialCommunityIcons name="storefront" size={20} color="#000666" />
        </View>
        <View>
          <Text style={styles.headerSubtitle}>ACTIVE HUB</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.headerTitle}>{activeLocationName}</Text>
            {showChevron && <Ionicons name="chevron-down" size={14} color="#6366F1" />}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.push(ROUTES.OWNER.SCANNER)}>
          <Ionicons name="qr-code-outline" size={22} color="#000666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.push(ROUTES.OWNER.NOTIFICATIONS)}>
          <Ionicons name="notifications" size={22} color="#000666" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  storeIconBg: {
    width: 40, height: 40, backgroundColor: '#f3f3f3', borderRadius: theme.borderRadius.lg,
    justifyContent: 'center', alignItems: 'center',
  },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#454652', letterSpacing: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#1a1c1c' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { position: 'relative' },
  notificationDot: {
    position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#fd6c00', borderWidth: 1.5, borderColor: '#FFF',
  },
})
