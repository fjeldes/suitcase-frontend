import { UserAvatar } from '@/components/ui/UserAvatar'
import { ROUTES } from '@/constants/routes'
import { api } from '@/services/api'
import { ROUTES } from '@/constants/routes'
import { useSwitchMode } from '@/hooks/useSwitchMode'
import { useAuthStore } from '@/store/useAuthStore'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NOTIF_KEYS = { BOOKINGS: 'notif_bookings', PROMOS: 'notif_promos', SYSTEM: 'notif_system' }

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore()
  const { switchMode } = useSwitchMode()
  const router = useRouter()
  const isOwner = user?.roles.includes('owner')
  const isClient = user?.roles.includes('client')
  const isStaff = user?.roles.includes('staff')

  // Profile edit
  const [showProfile, setShowProfile] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  // Password
  const [showPassword, setShowPassword] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Notifications
  const [showNotif, setShowNotif] = useState(false)
  const [notifBookings, setNotifBookings] = useState(true)
  const [notifPromos, setNotifPromos] = useState(false)
  const [notifSystem, setNotifSystem] = useState(true)

  // Contact
  const [showContact, setShowContact] = useState(false)

  const handleSwitchToClient = () => {
    Alert.alert('Switch to Traveler Mode', "You'll be redirected to the Explore screen.", [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Switch', onPress: () => switchMode('client') },
    ]);
  }

  const handleSaveProfile = async () => {
    if (!profileName.trim()) return
    setSavingProfile(true)
    try {
      const parts = profileName.trim().split(' ')
      const res = await api.patch('/users/me/profile', { firstName: parts[0], lastName: parts.slice(1).join(' ') || '' })
      const { useAuthStore: store } = await import('@/store/useAuthStore')
      await store.useAuthStore.getState().setUser(res.data)
      setShowProfile(false)
      Toast.show({ type: 'success', text1: 'Profile updated' })
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e?.response?.data?.message || 'Could not update' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) { Alert.alert('Error', 'All fields required'); return }
    if (newPw.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return }
    if (newPw !== confirmPw) { Alert.alert('Error', 'Passwords do not match'); return }
    setChangingPw(true)
    try {
      await api.patch('/auth/password', { currentPassword: currentPw, newPassword: newPw })
      setShowPassword(false); setCurrentPw(''); setNewPw(''); setConfirmPw('')
      Toast.show({ type: 'success', text1: 'Password changed' })
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: e?.response?.data?.message || 'Could not change password' })
    } finally { setChangingPw(false) }
  }

  const toggleNotif = async (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value); await AsyncStorage.setItem(key, String(value))
  }

  const MenuItem = ({ icon, title, family = 'Ionicons', onPress }: any) => {
    const IconComponent = family === 'Ionicons' ? Ionicons : family === 'Material' ? MaterialCommunityIcons : FontAwesome5
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemLeft}>
          <View style={styles.iconContainer}><IconComponent name={icon} size={20} color="#0A0E5E" /></View>
          <Text style={styles.menuItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#64748B" />
      </TouchableOpacity>
    )
  }

  const InputField = ({ label, value, onChange, placeholder, secure, showToggle, onToggle }: any) => (
    <View style={{ gap: 6, marginBottom: 12 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: '#0A0E5E', letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FB', borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: '#E2E8F0' }}>
        <TextInput style={{ flex: 1, fontSize: 15, color: '#1A202C' }} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94A3B8" secureTextEntry={secure && !onToggle} />
        {showToggle && <TouchableOpacity onPress={onToggle}><Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94A3B8" /></TouchableOpacity>}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#0A0E5E" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => router.push(ROUTES.OWNER.NOTIFICATIONS)}><Ionicons name="settings-sharp" size={24} color="#0A0E5E" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <UserAvatar key={user?.profile?.avatar} name={user?.name} avatarUrl={user?.profile?.avatar} size={112} />
          </View>
          <Text style={styles.userName}>{user?.name || 'My Profile'}</Text>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
            <Text style={styles.badgeText}>Storage Partner</Text>
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <MenuItem icon="person" title="Personal Info" onPress={() => { setProfileName(user?.name || ''); setShowProfile(true) }} />
            <MenuItem icon="shield-checkmark" title="Security" onPress={() => setShowPassword(true)} />
            <MenuItem icon="notifications" title="Notifications" onPress={() => setShowNotif(true)} />
          </View>
        </View>

        {/* Business */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business</Text>
          <View style={styles.card}>
            <MenuItem icon="storefront-outline" title="My Stores" onPress={() => router.push(ROUTES.OWNER.STORES)} />
            <MenuItem icon="people-outline" title="Manage Staff" onPress={() => router.push(ROUTES.OWNER.STAFF)} family="Ionicons" />
            <MenuItem icon="handshake" title="Partner Terms" family="FontAwesome5" />
          </View>
        </View>

        {/* Switch Mode */}
        {(isOwner || isStaff) && isClient && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mode</Text>
            <TouchableOpacity style={styles.switchCard} onPress={handleSwitchToClient}>
              <View style={styles.switchIconBox}><Ionicons name="swap-horizontal-outline" size={22} color="#0A0E5E" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Switch to Traveler Mode</Text>
                <Text style={styles.switchSub}>View the app as a client</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          </View>
        )}

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <MenuItem icon="headset" title="Contact Us" onPress={() => setShowContact(true)} />
            <MenuItem icon="document-text-outline" title="Terms & Conditions" family="Ionicons" onPress={() => router.push(ROUTES.LEGAL(isOwner ? 'owner' : 'staff'))} />
            <MenuItem icon="lock-closed-outline" title="Privacy Policy" family="Ionicons" onPress={() => router.push(ROUTES.LEGAL('privacy'))} />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="#E11D48" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={showProfile} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 16 }}>Edit Profile</Text>
            <InputField label="Full Name" value={profileName} onChange={setProfileName} placeholder="Your name" />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' }} onPress={() => setShowProfile(false)}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center', opacity: savingProfile ? 0.6 : 1 }} onPress={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? <ActivityIndicator color="white" size="small" /> : <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal visible={showPassword} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 16 }}>Change Password</Text>
            <InputField label="Current Password" value={currentPw} onChange={setCurrentPw} placeholder="Enter current password" secure showToggle={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
            <InputField label="New Password" value={newPw} onChange={setNewPw} placeholder="Enter new password" secure showToggle={showNew} onToggle={() => setShowNew(!showNew)} />
            <InputField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} placeholder="Confirm new password" secure showToggle={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' }} onPress={() => setShowPassword(false)}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center', opacity: changingPw ? 0.6 : 1 }} onPress={handleChangePassword} disabled={changingPw}>
                {changingPw ? <ActivityIndicator color="white" size="small" /> : <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Update</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={showNotif} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 16 }}>Notifications</Text>
            {[
              { label: 'Booking Updates', value: notifBookings, set: (v: boolean) => toggleNotif(NOTIF_KEYS.BOOKINGS, v, setNotifBookings) },
              { label: 'Promotions & Offers', value: notifPromos, set: (v: boolean) => toggleNotif(NOTIF_KEYS.PROMOS, v, setNotifPromos) },
              { label: 'System Announcements', value: notifSystem, set: (v: boolean) => toggleNotif(NOTIF_KEYS.SYSTEM, v, setNotifSystem) },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#1A202C' }}>{item.label}</Text>
                <Switch value={item.value} onValueChange={item.set} trackColor={{ false: '#E2E8F0', true: '#0A0E5E' }} thumbColor="white" />
              </View>
            ))}
            <TouchableOpacity style={{ marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' }} onPress={() => setShowNotif(false)}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Contact Modal */}
      <Modal visible={showContact} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 }}>Contact Support</Text>
            <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 20 }}>Send us an email and we'll get back to you within 24 hours.</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: '#F8F9FB', borderRadius: 14 }} onPress={() => Linking.openURL('mailto:support@suitcase.app')}>
              <View style={{ width: 44, height: 44, backgroundColor: 'white', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="mail-outline" size={22} color="#0A0E5E" />
              </View>
              <View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A202C' }}>Email</Text>
                <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>support@suitcase.app</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 16, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' }} onPress={() => setShowContact(false)}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#64748B' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  scrollContent: { paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  imageContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff', elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  badge: { flexDirection: 'row', backgroundColor: '#F97316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 15 },
  card: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconContainer: { width: 40, height: 40, backgroundColor: '#F1F5F9', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuItemText: { fontSize: 16, color: '#334155', fontWeight: '500' },
  switchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
  switchIconBox: { width: 44, height: 44, backgroundColor: '#EEF2FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  switchTitle: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  switchSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 10 },
  logoutText: { color: '#E11D48', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
})
