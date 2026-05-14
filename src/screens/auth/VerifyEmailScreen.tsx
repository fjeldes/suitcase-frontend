import { KipGoLogo } from '@/components/ui/KipGoLogo'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
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

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
        text1: 'Error',
        text2: 'Please enter the complete 6-digit code.',
        position: 'bottom',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post('/auth/verify-email', { email, code: fullCode });
      if (response.data?.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken, response.data.user);
        Toast.show({ type: 'success', text1: 'Success', text2: 'Email verified successfully!', position: 'bottom' });

        if (staffToken) {
          try {
            const { staffService } = await import('@/services/staffService');
            const result = await staffService.acceptInvitation(staffToken, response.data.user.id);
            if (result.accepted) {
              const refresh = await api.post('/auth/refresh', { refresh_token: response.data.refreshToken });
              if (refresh.data?.accessToken) {
                setTokens(refresh.data.accessToken, refresh.data.refreshToken, refresh.data.user);
              }
              Toast.show({ type: 'success', text1: 'Invitation Accepted', text2: `You are now staff at ${result.locationName}!` });
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
        text1: 'Error',
        text2: err.response?.data?.message || 'Invalid or expired code.',
        position: 'bottom',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/resend-code', { email });
      Toast.show({
        type: 'success',
        text1: 'Sent',
        text2: 'A new verification code has been sent to your email.',
        position: 'bottom',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Could not resend code.',
        position: 'bottom',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Header App-like */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
          </TouchableOpacity>
          <KipGoLogo width={100} height={30} />
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            {/* Icono central */}
            <View style={styles.iconWrapper}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="email" size={40} color="#0A0E5E" />
                <View style={styles.shieldBadge}>
                  <MaterialCommunityIcons name="shield-check" size={12} color="#FFF" />
                </View>
              </View>
            </View>

            <Text style={styles.title}>Verify your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to your email address. Please enter it below to confirm your identity.
            </Text>

            {/* Inputs de 6 dígitos */}
            <View style={styles.codeContainer}>
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (inputRefs.current[idx] = ref)}
                  style={styles.codeInput}
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
              style={[styles.verifyButton, isVerifying && styles.disabledButton]}
              onPress={handleVerify}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.verifyButtonText}>Verify Account</Text>
              )}
            </TouchableOpacity>

            {/* Botón de reenvío */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={styles.resendLink}>{isResending ? 'Sending...' : 'Resend Code'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
  flex: { flex: 1 },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0E5E',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  shieldBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF6B00',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A0E5E',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0E5E',
    textAlign: 'center',
  },

  verifyButton: {
    backgroundColor: '#0A0E5E',
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
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  resendLink: {
    color: '#0A0E5E',
    fontSize: 14,
    fontWeight: '700',
  },
});
