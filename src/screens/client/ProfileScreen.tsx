import { ROUTES } from '@/constants/routes';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSwitchMode } from '@/hooks/useSwitchMode';
import { useTheme } from '@/hooks/useTheme';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { uploadService } from '@/services/uploadService';
import { api } from '@/services/api';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window')

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()
  const { switchMode } = useSwitchMode()
  const [uploading, setUploading] = useState(false);
  const isOwner = user?.roles?.includes('owner')
  const s = useMemo(() => createStyles(colors), [colors]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: t('profile.permission_denied'),
        text2: t('profile.permission_desc'),
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const imageUri = result.assets[0].uri;

        const publicUrl = await uploadService.uploadImage(imageUri, 'profiles');

        const { data: updatedUser } = await api.patch('/users/me/profile', {
          avatar: publicUrl
        });

        await setUser(updatedUser);

        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: t('profile.upload_success'),
        });
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('profile.upload_fail'),
        });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO */}
        <View style={s.headerRow}>
          <TouchableOpacity 
            style={s.avatarWrapper} 
            onPress={pickImage}
            disabled={uploading}
          >
            <View style={s.avatarCircle}>
              {uploading ? (
                <View style={s.loadingContainer}>
                   <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : (
                <UserAvatar 
                  key={user?.profile?.avatar}
                  name={user?.name} 
                  avatarUrl={user?.profile?.avatar} 
                  size={82} 
                />
              )}
            </View>
            <View style={s.verifiedBadge}>
              <Ionicons name="camera" size={14} color={colors.textInverse} />
            </View>
          </TouchableOpacity>

          <View style={s.headerInfo}>
            <Text style={s.userName}>{user?.name || t('profile.my_profile')}</Text>
            <Text style={s.joinedDate}>{t('profile.joined_date')}</Text>
            <View style={s.premiumBadge}>
              <Text style={s.premiumText}>{t('profile.traveler_badge')}</Text>
            </View>
          </View>
        </View>

        {/* MODO OWNER (solo si tiene rol owner y está en modo cliente) */}
        {isOwner && (
          <View style={s.sectionContainer}>
            <Text style={s.sectionTitle}>{t('profile.mode')}</Text>
            <TouchableOpacity style={s.switchCard} onPress={() => switchMode('owner')}>
              <View style={s.switchIconBox}>
                <Ionicons name="swap-horizontal-outline" size={22} color={colors.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.switchTitle}>{t('profile.switch_to_owner')}</Text>
                <Text style={s.switchSub}>{t('profile.switch_subtitle')}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
            </TouchableOpacity>
          </View>
        )}

        {/* SECCIÓN: BECOME A PARTNER (solo si NO es owner) */}
        {!isOwner && (
          <LinearGradient colors={[colors.primary, colors.primary]} style={s.partnerCard}>
            <Text style={s.partnerTitle}>{t('profile.partner_title')}</Text>
            <Text style={s.partnerSubtitle}>
              {t('profile.partner_desc')}
            </Text>

            <TouchableOpacity 
              style={s.partnerButton}
              onPress={() => router.push('/(client)/become-owner')}
            >
              <Text style={s.partnerButtonText}>{t('profile.become_partner')}</Text>
            </TouchableOpacity>

            <Image
              style={s.previewImage}
              resizeMode="contain"
            />
          </LinearGradient>
        )}

        {/* SECCIÓN: AJUSTES */}
        <View style={s.sectionContainer}>
          <Text style={s.sectionTitle}>{t('settings.account')}</Text>
          <View style={s.card}>
            <TouchableOpacity
              style={s.optionItem}
              onPress={() => router.push(ROUTES.CLIENT.SETTINGS)}
            >
              <View style={s.optionIconBox}>
                <Ionicons name="settings-outline" size={22} color={colors.primary} />
              </View>
              <Text style={s.optionItemText}>{t('profile.settings')}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.iconMuted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={s.optionItem}
              onPress={() => router.push('/(client)/payment-methods')}
            >
              <View style={s.optionIconBox}>
                <Ionicons name="card-outline" size={22} color={colors.primary} />
              </View>
              <Text style={s.optionItemText}>{t('profile.payment_methods')}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECCIÓN: SOPORTE */}
        <View style={s.sectionContainer}>
          <Text style={s.sectionTitle}>{t('profile.support')}</Text>
          <View style={s.card}>
            <TouchableOpacity
              style={s.optionItem}
              onPress={() => router.push(ROUTES.CLIENT.HELP)}
            >
              <View style={s.optionIconBox}>
                <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
              </View>
              <Text style={s.optionItemText}>{t('profile.help_support')}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.iconMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={s.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.dotRed} />
          <Text style={s.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceCardLow },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarWrapper: { position: 'relative' },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceCard,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    padding: 4,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 45 },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.badgeOrange,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.surfaceCard,
    borderWidth: 2,
  },
  headerInfo: { marginLeft: 20 },
  userName: { fontSize: 22, fontWeight: '800', color: colors.primary },
  joinedDate: { color: colors.textMuted, fontSize: 14, marginVertical: 4 },
  premiumBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: { color: colors.textInverse, fontSize: 10, fontWeight: 'bold' },

  // Partner Card
  partnerCard: {
    width: '100%',
    borderRadius: 30,
    padding: 25,
    paddingBottom: 0,
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'visible',
  },
  partnerTitle: {
    color: colors.textInverse,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 15,
  },
  partnerSubtitle: {
    color: colors.textInverse,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  partnerButton: {
    backgroundColor: colors.badgeOrange,
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 15,
    marginBottom: 30,
  },
  partnerButtonText: { color: colors.textInverse, fontWeight: 'bold', fontSize: 16 },
  previewImage: {
    width: width * 0.7,
    height: 180,
    marginBottom: -20,
  },

  // Options
  card: { backgroundColor: colors.surfaceCard, borderRadius: 20, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionIconBox: {
    width: 45,
    height: 45,
    backgroundColor: colors.surfaceCardLow,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionItemText: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textPrimary },

  // Shared
  sectionContainer: { marginTop: 28 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 15 },
  switchCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceCard, padding: 16, borderRadius: 20, gap: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
  switchIconBox: { width: 44, height: 44, backgroundColor: colors.tabBarActiveBg, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  switchTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  switchSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 20,
    borderRadius: 40,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.iconMuted,
  },
  securityIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#FEEBC8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  securityTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  securitySubtitle: { fontSize: 12, color: colors.textMuted, marginTop: 2 },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logoutText: { color: colors.dotRed, fontSize: 16, fontWeight: '700', marginLeft: 8 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
