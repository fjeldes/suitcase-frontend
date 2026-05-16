import { FormInput } from '@/components/ui/FormInput';
import { ROUTES } from '@/constants/routes';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

const APP_VERSION = '1.0.0';
const NOTIF_KEYS = {
  BOOKINGS: 'notif_bookings',
  PROMOS: 'notif_promos',
  SYSTEM: 'notif_system',
};

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  // Profile Modal
  const [showProfile, setShowProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Modal
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Language
  const [language, setLanguage] = useState('es');
  const [showLanguage, setShowLanguage] = useState(false);

  // Notifications
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [notifSystem, setNotifSystem] = useState(true);

  useEffect(() => {
    AsyncStorage.multiGet([NOTIF_KEYS.BOOKINGS, NOTIF_KEYS.PROMOS, NOTIF_KEYS.SYSTEM, 'app_language']).then(
      ([b, p, s, lang]) => {
        if (b[1] !== null) setNotifBookings(b[1] === 'true');
        if (p[1] !== null) setNotifPromos(p[1] === 'true');
        if (s[1] !== null) setNotifSystem(s[1] === 'true');
        if (lang[1] !== null) setLanguage(lang[1]);
      },
    );
  }, []);

  const toggleNotif = async (key: string, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    await AsyncStorage.setItem(key, String(value));
  };

  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    setShowLanguage(false);
    await AsyncStorage.setItem('app_language', lang);
    const { default: i18n } = await import('@/i18n');
    i18n.changeLanguage(lang);
    Toast.show({ type: 'success', text1: t('settings.language_changed') });
  };

  // Profile form
  const profileForm = useForm({ defaultValues: { name: user?.name || '' } });
  useEffect(() => {
    if (showProfile) profileForm.setValue('name', user?.name || '');
  }, [showProfile]);

  const handleSaveProfile = async (data: { name: string }) => {
    if (!data.name.trim()) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('settings.error_empty_name') });
      return;
    }
    try {
      setSavingProfile(true);
      const res = await api.patch('/users/me/profile', {
        firstName: data.name.trim().split(' ')[0],
        lastName: data.name.trim().split(' ').slice(1).join(' ') || '',
      });
      await setUser(res.data);
      setShowProfile(false);
      Toast.show({ type: 'success', text1: t('settings.profile_updated') });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: e?.response?.data?.message || t('settings.error_update_profile') });
    } finally {
      setSavingProfile(false);
    }
  };

  // Password form
  const passwordForm = useForm({ defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' } });

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
    if (!data.currentPassword || !data.newPassword) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('settings.error_fields_required') });
      return;
    }
    if (data.newPassword.length < 6) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('settings.password_min') });
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('settings.password_mismatch') });
      return;
    }
    try {
      setChangingPassword(true);
      await api.patch('/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setShowPassword(false);
      passwordForm.reset();
      Toast.show({ type: 'success', text1: t('settings.password_changed') });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: e?.response?.data?.message || t('settings.error_change_password') });
    } finally {
      setChangingPassword(false);
    }
  };

  const settingsSections = [
    {
      title: t('settings.account'),
      items: [
        { icon: 'person-outline' as const, label: t('settings.edit_profile'), onPress: () => setShowProfile(true) },
        { icon: 'lock-closed-outline' as const, label: t('settings.change_password'), onPress: () => setShowPassword(true) },
      ],
    },
    {
      title: t('settings.notifications_title'),
      items: [
        {
          icon: 'briefcase-outline' as const,
          label: t('settings.booking_updates'),
          right: (
            <Switch
              value={notifBookings}
              onValueChange={(v) => toggleNotif(NOTIF_KEYS.BOOKINGS, v, setNotifBookings)}
              trackColor={{ false: '#E2E8F0', true: '#0A0E5E' }}
              thumbColor="white"
            />
          ),
        },
        {
          icon: 'pricetag-outline' as const,
          label: t('settings.promotions'),
          right: (
            <Switch
              value={notifPromos}
              onValueChange={(v) => toggleNotif(NOTIF_KEYS.PROMOS, v, setNotifPromos)}
              trackColor={{ false: '#E2E8F0', true: '#0A0E5E' }}
              thumbColor="white"
            />
          ),
        },
        {
          icon: 'shield-outline' as const,
          label: t('settings.system'),
          right: (
            <Switch
              value={notifSystem}
              onValueChange={(v) => toggleNotif(NOTIF_KEYS.SYSTEM, v, setNotifSystem)}
              trackColor={{ false: '#E2E8F0', true: '#0A0E5E' }}
              thumbColor="white"
            />
          ),
        },
      ],
    },
    {
      title: t('settings.app'),
      items: [
        {
          icon: 'language-outline' as const,
          label: t('settings.language'),
          right: <Text style={styles.langValue}>{language === 'es' ? 'Español' : 'English'}</Text>,
          onPress: () => setShowLanguage(true),
        },
        {
          icon: 'information-circle-outline' as const,
          label: t('settings.version'),
          right: <Text style={styles.versionText}>{APP_VERSION}</Text>,
        },
        {
          icon: 'document-text-outline' as const,
          label: t('settings.terms'),
          right: <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />,
          onPress: () => router.push(ROUTES.LEGAL('client')),
        },
        {
          icon: 'lock-closed-outline' as const,
          label: t('settings.privacy'),
          right: <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />,
          onPress: () => router.push(ROUTES.LEGAL('privacy')),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/(client)/profile')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{t('settings.title')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.settingRow, ii < section.items.length - 1 && styles.settingRowBorder]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                  activeOpacity={item.onPress ? 0.6 : 1}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIconBox}>
                      <Ionicons name={item.icon} size={20} color="#0A0E5E" />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.right || (item.onPress && <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />)}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={showProfile} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('settings.edit_profile')}</Text>

            <View style={{ gap: 16, marginTop: 10 }}>
              <FormInput
                control={profileForm.control}
                name="name"
                label={t('settings.full_name')}
                icon="person-outline"
                placeholder={t('settings.placeholder_full_name')}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowProfile(false)}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, savingProfile && { opacity: 0.6 }]}
                onPress={profileForm.handleSubmit(handleSaveProfile)}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>{t('common.save')}</Text>
                )}
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
            <Text style={styles.modalTitle}>{t('settings.change_password')}</Text>

            <View style={{ gap: 12, marginTop: 10 }}>
              <FormInput
                control={passwordForm.control}
                name="currentPassword"
                label={t('settings.current_password')}
                icon="lock-closed-outline"
                placeholder={t('settings.placeholder_current_password')}
                isPassword
                showPassword={showCurrentPw}
                togglePassword={() => setShowCurrentPw(!showCurrentPw)}
              />
              <FormInput
                control={passwordForm.control}
                name="newPassword"
                label={t('settings.new_password')}
                icon="lock-open-outline"
                placeholder={t('settings.placeholder_new_password')}
                isPassword
                showPassword={showNewPw}
                togglePassword={() => setShowNewPw(!showNewPw)}
              />
              <FormInput
                control={passwordForm.control}
                name="confirmPassword"
                label={t('settings.confirm_new_password')}
                icon="checkmark-circle-outline"
                placeholder={t('settings.placeholder_confirm_password')}
                isPassword
                showPassword={showConfirmPw}
                togglePassword={() => setShowConfirmPw(!showConfirmPw)}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowPassword(false)}>
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, changingPassword && { opacity: 0.6 }]}
                onPress={passwordForm.handleSubmit(handleChangePassword)}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.modalConfirmText}>{t('settings.update')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLanguage} transparent animationType="fade">
        <View style={styles.langModalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setShowLanguage(false)} />
          <View style={styles.langModalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('settings.select_language')}</Text>
            {[
              { code: 'es', label: 'Español' },
              { code: 'en', label: 'English' },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, language === lang.code && styles.langOptionActive]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={[styles.langOptionText, language === lang.code && styles.langOptionTextActive]}>
                  {lang.label}
                </Text>
                {language === lang.code && <Ionicons name="checkmark-circle" size={22} color="#0A0E5E" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAFC' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { padding: 5 },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // Sections
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8898AA',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  settingIconBox: {
    width: 38,
    height: 38,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: { fontSize: 15, fontWeight: '600', color: '#1A202C' },

  // Language & Version
  langValue: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  versionText: { fontSize: 14, color: '#94A3B8' },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalCancel: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  modalConfirm: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#0A0E5E',
    alignItems: 'center',
  },
  modalConfirmText: { fontSize: 15, fontWeight: '700', color: 'white' },

  // Language Modal
  langModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  langModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    backgroundColor: '#F8F9FB',
  },
  langOptionActive: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#0A0E5E' },
  langOptionText: { fontSize: 16, fontWeight: '600', color: '#1A202C' },
  langOptionTextActive: { color: '#0A0E5E' },
});
