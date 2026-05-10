import { UserAvatar } from '@/components/ui/UserAvatar'
import { ROUTES } from '@/constants/routes'
import { useSwitchMode } from '@/hooks/useSwitchMode'
import { useAuthStore } from '@/store/useAuthStore'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore()
  const { switchMode } = useSwitchMode()
  const router = useRouter()
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace(ROUTES.OWNER.DASHBOARD)
    }
  }

  const isOwner = user?.roles.includes('owner')
  const isClient = user?.roles.includes('client')
  const isStaff = user?.roles.includes('staff')

  const handleSwitchToClient = () => {
    Alert.alert(
      'Switch to Traveler Mode',
      "You'll be redirected to the Explore screen.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', onPress: () => switchMode('client') },
      ],
    );
  };

  const MenuItem = ({ icon, title, family = 'Ionicons', onPress }: any) => {
    const IconComponent =
      family === 'Ionicons'
        ? Ionicons
        : family === 'Material'
          ? MaterialCommunityIcons
          : FontAwesome5

    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}>
            <IconComponent name={icon} size={20} color="#0A0E5E" />
          </View>
          <Text style={styles.menuItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748B" />
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* 3. Agregar el onPress para volver */}
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={24} color="#0A0E5E" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {/* B-05: Usar iniciales como fallback en lugar de imagen placeholder */}
            <UserAvatar 
              key={user?.profile?.avatar}
              name={user?.name} 
              avatarUrl={user?.profile?.avatar}
              size={112} 
            />
          </View>
          <Text style={styles.userName}>{user?.name || 'Mi perfil'}</Text>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
            <Text style={styles.badgeText}>Storage Partner</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <MenuItem icon="person" title="Personal Info" />
            <MenuItem icon="shield-checkmark" title="Security" />
            <MenuItem icon="notifications" title="Notifications" />
          </View>
        </View>

        {/* Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.card}>
            <MenuItem 
              icon="storefront-outline" 
              title="My Stores" 
              onPress={() => router.push(ROUTES.OWNER.STORES)}
            />
            <MenuItem icon="card" title="Payout Methods" />
            <MenuItem icon="newspaper" title="Tax Info" family="Ionicons" />
            <MenuItem icon="handshake" title="Partner Terms" family="FontAwesome5" />
          </View>
        </View>

        {/* Support Section */}
        {/* Switch Mode */}
        {(isOwner || isStaff) && isClient && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MODE</Text>
            <TouchableOpacity style={styles.switchCard} onPress={handleSwitchToClient}>
              <View style={styles.switchIconBox}>
                <Ionicons name="swap-horizontal-outline" size={22} color="#0A0E5E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Switch to Traveler Mode</Text>
                <Text style={styles.switchSub}>View the app as a client</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <MenuItem icon="help-circle" title="Help Center" />
            <MenuItem icon="headset" title="Contact Us" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#E11D48" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  scrollContent: { paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 15,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 60 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  badge: {
    flexDirection: 'row',
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 6,
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: { fontSize: 16, color: '#334155', fontWeight: '500' },
  switchCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    padding: 16, borderRadius: 20, gap: 14,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5,
  },
  switchIconBox: {
    width: 44, height: 44, backgroundColor: '#EEF2FF', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  switchTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  switchSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },
  logoutText: { color: '#E11D48', fontSize: 18, fontWeight: 'bold' },
})
