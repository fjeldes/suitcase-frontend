import { UserAvatar } from '@/components/ui/UserAvatar'
import { BottomSheetModal } from '@/components/ui/BottomSheetModal'
import { ROUTES } from '@/constants/routes'
import { api } from '@/services/api'
import { useSwitchMode } from '@/hooks/useSwitchMode'
import { useAuthStore } from '@/store/useAuthStore'
import { useTheme } from '@/hooks/useTheme'
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

const NOTIF_KEYS = { BOOKINGS: 'notif_bookings', PROMOS: 'notif_promos', SYSTEM: 'notif_system' }

export const ProfileScreen = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const { switchMode } = useSwitchMode()
  const { colors } = useTheme()
  const router = useRouter()
  const isOwner = user?.roles.includes('owner')
  const isClient = user?.roles.includes('client')
  const isStaff = user?.roles.includes('staff')

  const [showProfile, setShowProfile] = useState(false)
  const [profileName, setProfileName] = useState(user?.name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [changingPw, setChangingPw] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [showNotif, setShowNotif] = useState(false)
  const [notifBookings, setNotifBookings] = useState(true)
  const [notifPromos, setNotifPromos] = useState(false)
  const [notifSystem, setNotifSystem] = useState(true)

  const [showContact, setShowContact] = useState(false)

  const handleSwitchToClient = () => {
    Alert.alert(t('profile.switch_to_client'), t('profile.switch_alert_desc'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.switch_btn'), onPress: () => switchMode('client') },
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
      Toast.show({ type: 'success', text1: t('settings.profile_updated') })
    } catch (e: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: e?.response?.data?.message || t('settings.error_update_profile') })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPw || !newPw) { Alert.alert(t('common.error'), t('settings.error_fields_required')); return }
    if (newPw.length < 6) { Alert.alert(t('common.error'), t('settings.password_min')); return }
    if (newPw !== confirmPw) { Alert.alert(t('common.error'), t('settings.password_mismatch')); return }
    setChangingPw(true)
    try {
      await api.patch('/auth/password', { currentPassword: currentPw, newPassword: newPw })
      setShowPassword(false); setCurrentPw(''); setNewPw(''); setConfirmPw('')
      Toast.show({ type: 'success', text1: t('settings.password_changed') })
    } catch (e: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: e?.response?.data?.message || t('settings.error_change_password') })
    } finally { setChangingPw(false) }
  }

  const toggleNotif = async (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value); await AsyncStorage.setItem(key, String(value))
  }

  const s = useMemo(() => createStyles(colors), [colors])

  const MenuItem = ({ icon, title, family = 'Ionicons', onPress }: any) => {
    const IconComponent = family === 'Ionicons' ? Ionicons : family === 'Material' ? MaterialCommunityIcons : FontAwesome5
    return (
      <TouchableOpacity style={s.menuItem} onPress={onPress} accessibilityLabel={title} accessibilityRole="button">
        <View style={s.menuItemLeft}>
          <View style={s.iconContainer}><IconComponent name={icon} size={20} color={colors.iconColor} /></View>
          <Text style={s.menuItemText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    )
  }

  const InputField = ({ label, value, onChange, placeholder, secure, showToggle, onToggle }: any) => (
    <View style={{ gap: 6, marginBottom: 12 }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: colors.iconColor, letterSpacing: 0.5 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight, borderRadius: 12, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: colors.border }}>
        <TextInput style={{ flex: 1, fontSize: 15, color: colors.textPrimary }} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.iconMuted} secureTextEntry={secure && !onToggle} />
        {showToggle && <TouchableOpacity onPress={onToggle} accessibilityLabel={secure ? 'Show password' : 'Hide password'} accessibilityRole="button"><Ionicons name={secure ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.iconMuted} /></TouchableOpacity>}
      </View>
    </View>
  )

  const renderModal = (visible: boolean, onClose: () => void, children: React.ReactNode) => (
    <BottomSheetModal visible={visible} onClose={onClose}>
      {children}
    </BottomSheetModal>
  )

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back" accessibilityRole="button"><Ionicons name="arrow-back" size={24} color={colors.iconColor} /></TouchableOpacity>
        <Text style={s.headerTitle}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => router.push(ROUTES.OWNER.NOTIFICATIONS)} accessibilityLabel="Open settings" accessibilityRole="button"><Ionicons name="settings-sharp" size={24} color={colors.iconColor} /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <View style={s.profileSection}>
          <View style={s.imageContainer}>
            <UserAvatar key={user?.profile?.avatar} name={user?.name} avatarUrl={user?.profile?.avatar} size={112} />
          </View>
          <Text style={s.userName}>{user?.name || t('profile.my_profile')}</Text>
          <View style={s.badge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#fff" />
            <Text style={s.badgeText}>{t('profile.storage_partner')}</Text>
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>{t('settings.account')}</Text>
          <View style={s.card}>
            <MenuItem icon="person" title={t('profile.personal_info')} onPress={() => { setProfileName(user?.name || ''); setShowProfile(true) }} />
            <MenuItem icon="shield-checkmark" title={t('profile.security')} onPress={() => setShowPassword(true)} />
            <MenuItem icon="notifications" title={t('profile.notifications')} onPress={() => setShowNotif(true)} />
          </View>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>{t('profile.business')}</Text>
          <View style={s.card}>
            <MenuItem icon="storefront-outline" title={t('profile.my_stores')} onPress={() => router.push(ROUTES.OWNER.STORES)} />
            <MenuItem icon="people-outline" title={t('profile.manage_staff')} onPress={() => router.push(ROUTES.OWNER.STAFF)} family="Ionicons" />
            <MenuItem icon="handshake" title={t('profile.partner_terms')} family="FontAwesome5" />
          </View>
        </View>

        {(isOwner || isStaff) && isClient && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>{t('profile.mode')}</Text>
            <TouchableOpacity style={s.switchCard} onPress={handleSwitchToClient} accessibilityLabel="Switch to client mode" accessibilityRole="button">
              <View style={s.switchIconBox}><Ionicons name="swap-horizontal-outline" size={22} color={colors.iconColor} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.switchTitle}>{t('profile.switch_to_client')}</Text>
                <Text style={s.switchSub}>{t('profile.switch_subtitle')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          </View>
        )}

        <View style={s.section}>
          <Text style={s.sectionTitle}>{t('profile.support')}</Text>
          <View style={s.card}>
            <MenuItem icon="headset" title={t('profile.contact_us')} onPress={() => setShowContact(true)} />
            <MenuItem icon="document-text-outline" title={t('settings.terms')} family="Ionicons" onPress={() => router.push(ROUTES.LEGAL(isOwner ? 'owner' : 'staff'))} />
            <MenuItem icon="lock-closed-outline" title={t('settings.privacy')} family="Ionicons" onPress={() => router.push(ROUTES.LEGAL('privacy'))} />
          </View>
        </View>

        <TouchableOpacity style={s.logoutBtn} onPress={logout} accessibilityLabel="Logout" accessibilityRole="button">
          <Ionicons name="log-out-outline" size={24} color="#E11D48" />
          <Text style={s.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderModal(showProfile, () => setShowProfile(false), (
        <>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 }}>{t('settings.edit_profile')}</Text>
          <InputField label={t('settings.full_name')} value={profileName} onChange={setProfileName} placeholder={t('settings.placeholder_full_name')} />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' }} onPress={() => setShowProfile(false)} accessibilityLabel="Cancel editing profile" accessibilityRole="button">
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMuted }}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', opacity: savingProfile ? 0.6 : 1 }} onPress={handleSaveProfile} disabled={savingProfile} accessibilityLabel="Save profile changes" accessibilityRole="button">
              {savingProfile ? <ActivityIndicator color="white" size="small" /> : <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textInverse }}>{t('common.save')}</Text>}
            </TouchableOpacity>
          </View>
        </>
      ))}

      {renderModal(showPassword, () => setShowPassword(false), (
        <>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 }}>{t('settings.change_password')}</Text>
          <InputField label={t('settings.current_password')} value={currentPw} onChange={setCurrentPw} placeholder={t('settings.placeholder_current_password')} secure showToggle={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
          <InputField label={t('settings.new_password')} value={newPw} onChange={setNewPw} placeholder={t('settings.placeholder_new_password')} secure showToggle={showNew} onToggle={() => setShowNew(!showNew)} />
          <InputField label={t('settings.confirm_new_password')} value={confirmPw} onChange={setConfirmPw} placeholder={t('settings.placeholder_confirm_password')} secure showToggle={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' }} onPress={() => setShowPassword(false)} accessibilityLabel="Cancel password change" accessibilityRole="button">
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMuted }}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', opacity: changingPw ? 0.6 : 1 }} onPress={handleChangePassword} disabled={changingPw} accessibilityLabel="Update password" accessibilityRole="button">
              {changingPw ? <ActivityIndicator color="white" size="small" /> : <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textInverse }}>{t('settings.update')}</Text>}
            </TouchableOpacity>
          </View>
        </>
      ))}

      {renderModal(showNotif, () => setShowNotif(false), (
        <>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 }}>{t('settings.notifications_title')}</Text>
          {[
            { label: t('settings.booking_updates'), value: notifBookings, set: (v: boolean) => toggleNotif(NOTIF_KEYS.BOOKINGS, v, setNotifBookings) },
            { label: t('settings.promotions'), value: notifPromos, set: (v: boolean) => toggleNotif(NOTIF_KEYS.PROMOS, v, setNotifPromos) },
            { label: t('settings.system'), value: notifSystem, set: (v: boolean) => toggleNotif(NOTIF_KEYS.SYSTEM, v, setNotifSystem) },
          ].map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{item.label}</Text>
              <Switch value={item.value} onValueChange={item.set} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="white" />
            </View>
          ))}
          <TouchableOpacity style={{ marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' }} onPress={() => setShowNotif(false)} accessibilityLabel="Close notifications settings" accessibilityRole="button">
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMuted }}>{t('common.done')}</Text>
          </TouchableOpacity>
        </>
      ))}

      {renderModal(showContact, () => setShowContact(false), (
        <>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 }}>{t('profile.contact_title')}</Text>
          <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 24, lineHeight: 20 }}>{t('profile.contact_desc')}</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: colors.surfaceLight, borderRadius: 14 }} onPress={() => Linking.openURL('mailto:support@suitcase.app')} accessibilityLabel="Send email to support" accessibilityRole="button">
            <View style={{ width: 44, height: 44, backgroundColor: colors.surfaceCard, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="mail-outline" size={22} color={colors.iconColor} />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>{t('profile.email_label')}</Text>
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>support@suitcase.app</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 16, padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' }} onPress={() => setShowContact(false)} accessibilityLabel="Close contact modal" accessibilityRole="button">
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textMuted }}>{t('common.close')}</Text>
          </TouchableOpacity>
        </>
      ))}
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceCardLow },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  scrollContent: { paddingBottom: 100 },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  imageContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: colors.surfaceCard, elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 15 },
  userName: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 10 },
  badge: { flexDirection: 'row', backgroundColor: colors.badgeOrange, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center', gap: 6 },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 15 },
  card: { backgroundColor: colors.surfaceCard, borderRadius: 20, paddingVertical: 5, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconContainer: { width: 40, height: 40, backgroundColor: colors.surfaceLight, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuItemText: { fontSize: 16, color: colors.textSecondary, fontWeight: '500' },
  switchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceCard, padding: 16, borderRadius: 20, gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
  switchIconBox: { width: 44, height: 44, backgroundColor: colors.tabBarActiveBg, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  switchTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40, gap: 10 },
  logoutText: { color: '#E11D48', fontSize: 18, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
})
