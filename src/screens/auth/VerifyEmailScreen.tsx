import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email, staffToken } = useLocalSearchParams<{ email: string; staffToken?: string }>();
  const setTokens = useAuthStore((state) => state.setTokens);

  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const s = useMemo(() => createStyles(colors), [colors]);

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(email || '');
  const [devCode, setDevCode] = useState<string | null>(null);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    // Solo permitimos números
    const value = text.replace(/[^0-9]/g, '');
    if (value.length > 1) {
      // Si el usuario pegó el código completo
      const digits = value.split('').slice(0, 6);
      const newCode = [...code];
      digits.forEach((d, i) => (newCode[i] = d));
      setCode(newCode);
      if (digits.length === 6) {
        inputRefs.current[5]?.focus();
      }
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto avanzar al siguiente input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Si presiona borrar y está vacío, vuelve al anterior
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < 6) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('auth.code_incomplete'),
        position: 'bottom',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post('/auth/verify-email', { email, code: fullCode });
      if (response.data?.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
        Toast.show({ type: 'success', text1: t('auth.verify_success'), position: 'bottom' });

        if (staffToken) {
          try {
            const { staffService } = await import('@/services/staffService');
            const result = await staffService.acceptInvitation(staffToken, response.data.user.id);
            if (result.accepted) {
              const refresh = await api.post('/auth/refresh', { refresh_token: response.data.refreshToken });
              if (refresh.data?.accessToken) {
                setTokens(refresh.data.accessToken, refresh.data.refreshToken, refresh.data.user);
              }
              Toast.show({ type: 'success', text1: t('auth.invite_accepted'), text2: t('auth.invite_desc', { locationName: result.locationName }) });
            }
          } catch {
            // Silently fail
          }
        }

        const currentUser = (await import('@/store/useAuthStore')).useAuthStore.getState().user;
        const newRoles = currentUser?.roles || [];
        router.replace(newRoles.includes('owner') || newRoles.includes('staff') ? '/(owner)' : '/(client)');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: err.response?.data?.message || t('auth.code_invalid'),
        position: 'bottom',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const isChanged = newEmail && newEmail !== email;
      const res = isChanged
        ? await api.post('/auth/change-email', { oldEmail: email, newEmail })
        : await api.post('/auth/resend-code', { email: newEmail });
      if (res.data?.code) setDevCode(res.data.code);
      if (res.data?.email) router.setParams({ email: res.data.email });
      setEditingEmail(false);
      Toast.show({
        type: 'success',
        text1: t('auth.sent_label'),
        text2: t('auth.sent_desc'),
        position: 'bottom',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: err.response?.data?.message || t('auth.resend_failed'),
        position: 'bottom',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Header App-like */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Image source={isDark ? require('@/assets/images/light-icon.png') : require('@/assets/images/login-logo.png')} style={{ width: 100, height: 48 }} resizeMode="contain" />
          <View style={{ width: 40 }} />
        </View>

        <View style={s.content}>
          <View style={s.card}>
            {/* Icono central */}
            <View style={s.iconWrapper}>
              <View style={s.iconCircle}>
                <MaterialCommunityIcons name="email" size={40} color={colors.primary} />
                <View style={s.shieldBadge}>
                  <MaterialCommunityIcons name="shield-check" size={12} color={colors.surfaceCard} />
                </View>
              </View>
            </View>

            <Text style={s.title}>{t('auth.verify_email')}</Text>
            <Text style={s.subtitle}>{t('auth.verify_subtitle')}</Text>

            {/* Email display with edit */}
            {editingEmail ? (
              <View style={s.emailEditRow}>
                <TextInput
                  style={s.emailInput}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder={t('auth.change_email_placeholder')}
                  placeholderTextColor={colors.iconMuted}
                />
                <TouchableOpacity onPress={() => setEditingEmail(false)} style={s.emailEditBtn}>
                  <Text style={s.emailEditBtnText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingEmail(true)} style={s.emailRow}>
                <Text style={s.emailText}>{newEmail || email || 'your@email.com'}</Text>
                <MaterialCommunityIcons name="pencil" size={16} color={colors.primary} />
              </TouchableOpacity>
            )}

            {/* Inputs de 6 dígitos */}
            <View style={s.codeContainer}>
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (inputRefs.current[idx] = ref)}
                  style={s.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, idx)}
                  onKeyPress={(e) => handleKeyPress(e, idx)}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Botón principal */}
            <TouchableOpacity 
              style={[s.verifyButton, isVerifying && s.disabledButton]}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color={colors.surfaceCard} />
              ) : (
                <Text style={s.verifyButtonText}>{t('auth.verify_button')}</Text>
              )}
            </TouchableOpacity>

            {/* Botón de reenvío */}
            <View style={s.footerRow}>
              <Text style={s.footerText}>{t('auth.didnt_receive_code')} </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={s.resendLink}>{isResending ? t('auth.sending') : t('auth.resend_code')}</Text>
              </TouchableOpacity>
            </View>

            {/* Dev code display */}
            {devCode && (
              <TouchableOpacity style={s.devCodeBtn} onPress={() => {
                const newCode = devCode.split('').map(c => c);
                setCode(newCode.length === 6 ? newCode : code);
              }}>
                <Text style={s.devCodeText}>⚡ Fill code from dev: {devCode}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceCardLow },
  flex: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: colors.surfaceCardLow,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  
  iconWrapper: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: colors.surfaceCard,
  },
  shieldBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.badgeOrange,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surfaceCard,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },

  verifyButton: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: colors.surfaceCard,
    fontSize: 16,
    fontWeight: '700',
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  emailRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginBottom: 24, paddingVertical: 8,
  },
  emailText: { fontSize: 14, color: colors.textMuted, textDecorationLine: 'underline' },
  emailEditRow: { flexDirection: 'row', gap: 8, marginBottom: 24, alignItems: 'center' },
  emailInput: {
    flex: 1, backgroundColor: colors.surfaceLight, borderRadius: 12, padding: 12,
    fontSize: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border,
  },
  emailEditBtn: { backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  emailEditBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  devCodeBtn: { marginTop: 16, padding: 12, borderRadius: 12, backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.warning, alignItems: 'center' },
  devCodeText: { fontSize: 13, fontWeight: '700', color: colors.warning },
});
