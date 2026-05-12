import { ROUTES } from '@/constants/routes';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  const { t } = useTranslation();
  const router = useRouter()
  const { user, logout, setUser } = useAuthStore()
  const [uploading, setUploading] = useState(false);

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ENCABEZADO */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.avatarWrapper} 
            onPress={pickImage}
            disabled={uploading}
          >
            <View style={styles.avatarCircle}>
              {uploading ? (
                <View style={styles.loadingContainer}>
                   <ActivityIndicator size="small" color="#0A0E5E" />
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
            <View style={styles.verifiedBadge}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user?.name || t('profile.my_profile')}</Text>
            <Text style={styles.joinedDate}>{t('profile.joined_date')}</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>{t('profile.traveler_badge')}</Text>
            </View>
          </View>
        </View>

        {/* SECCIÓN: BECOME A PARTNER (Banner azul con degradado) */}
        <LinearGradient colors={['#1A1F71', '#0A0E5E']} style={styles.partnerCard}>
          <Text style={styles.partnerTitle}>{t('profile.partner_title')}</Text>
          <Text style={styles.partnerSubtitle}>
            {t('profile.partner_desc')}
          </Text>

          <TouchableOpacity 
            style={styles.partnerButton}
            onPress={() => router.push('/(client)/become-owner')}
          >
            <Text style={styles.partnerButtonText}>{t('profile.become_partner')}</Text>
          </TouchableOpacity>

          <Image
            style={styles.previewImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* LISTA DE OPCIONES (Estilo refinado) */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push(ROUTES.CLIENT.SETTINGS)}
          >
            <View style={styles.optionIconBox}>
              <Ionicons name="settings-outline" size={22} color="#0A0E5E" />
            </View>
            <Text style={styles.optionItemText}>{t('profile.settings')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.optionItem}
            onPress={() => router.push('/(client)/payment-methods')}
          >
            <View style={styles.optionIconBox}>
              <Ionicons name="card-outline" size={22} color="#0A0E5E" />
            </View>
            <Text style={styles.optionItemText}>{t('profile.payment_methods')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => router.push(ROUTES.CLIENT.HELP)}
          >
            <View style={styles.optionIconBox}>
              <Ionicons name="help-circle-outline" size={22} color="#0A0E5E" />
            </View>
            <Text style={styles.optionItemText}>{t('profile.help_support')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
          </TouchableOpacity>
        </View>

        {/* SECCIÓN DE SEGURIDAD */}
        <View style={styles.securityBox}>
          <View style={styles.securityIconBox}>
            <Ionicons name="lock-closed" size={20} color="#C05621" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>{t('profile.security_title')}</Text>
            <Text style={styles.securitySubtitle}>
              {t('profile.security_subtitle')}
            </Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FAFC' },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, marginTop: 10 },
  avatarWrapper: { position: 'relative' },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
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
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWhite: 2,
    borderColor: 'white',
    borderWidth: 2,
  },
  headerInfo: { marginLeft: 20 },
  userName: { fontSize: 22, fontWeight: '800', color: '#0A0E5E' },
  joinedDate: { color: '#718096', fontSize: 14, marginVertical: 4 },
  premiumBadge: {
    backgroundColor: '#1A1F71',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

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
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 15,
  },
  partnerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  partnerButton: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 15,
    marginBottom: 30,
  },
  partnerButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  previewImage: {
    width: width * 0.7,
    height: 180,
    marginBottom: -20,
  },

  // Options
  optionsContainer: { width: '100%', gap: 12, marginBottom: 25 },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  optionIconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#F7FAFC',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionItemText: { flex: 1, fontSize: 16, fontWeight: '700', color: '#1A202C' },

  // Security
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F9',
    padding: 20,
    borderRadius: 40,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E0',
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
  securityTitle: { fontSize: 15, fontWeight: '700', color: '#2D3748' },
  securitySubtitle: { fontSize: 12, color: '#718096', marginTop: 2 },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  logoutText: { color: '#E53E3E', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
