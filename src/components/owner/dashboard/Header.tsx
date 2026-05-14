import { ROUTES } from '@/constants/routes'
import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMyLocations } from '@/hooks/useDashboard'
import { useOwnerStore } from '@/store/useOwnerStore'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router'
import React, { useEffect, useMemo } from 'react'
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
  const { colors } = useTheme();
  const isStaff = user?.roles?.includes('staff');
  const { hasUnread } = useUnreadCount();
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

  const s = useMemo(() => createStyles(colors), [colors])

  return (
    <View style={s.header}>
      <TouchableOpacity style={s.headerLeft} onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
        <View style={s.storeIconBg}>
          <MaterialCommunityIcons name="storefront" size={20} color={colors.iconColor} />
        </View>
        <View>
          <Text style={s.headerSubtitle}>ACTIVE HUB</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={s.headerTitle}>{activeLocationName}</Text>
            {showChevron && <Ionicons name="chevron-down" size={14} color="#6366F1" />}
          </View>
        </View>
      </TouchableOpacity>
      <View style={s.headerRight}>
        <TouchableOpacity style={s.iconCircle} onPress={() => router.push(ROUTES.OWNER.SCANNER)}>
          <Ionicons name="qr-code-outline" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={s.iconCircle} onPress={() => router.push(ROUTES.OWNER.NOTIFICATIONS)}>
          <Ionicons name="notifications" size={22} color={colors.iconColor} />
          {hasUnread && <View style={s.notificationDot} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.headerBg,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  storeIconBg: {
    width: 40, height: 40, backgroundColor: colors.surfaceLight, borderRadius: theme.borderRadius.lg,
    justifyContent: 'center', alignItems: 'center',
  },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { position: 'relative' },
  notificationDot: {
    position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.warning, borderWidth: 1.5, borderColor: colors.surfaceCard,
  },
})
