import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('auth.error_email_required') });
      return;
    }

    setIsSending(true);
    try {
      await api.post('/auth/forgot-password', { email });
      router.push({ pathname: '/(auth)/reset-password', params: { email } });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: err.response?.data?.message || t('auth.error_something_wrong') });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{t('auth.forgot_password')}</Text>
          <Text style={styles.subtitle}>
            {t('auth.forgot_subtitle')}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email address input"
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryButton, isSending && styles.disabledButton]}
            onPress={handleSendCode}
            disabled={isSending}
            accessibilityLabel="Send reset code"
            accessibilityRole="button"
          >
            {isSending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>{t('auth.send_reset_code')}</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FE' },
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', paddingBottom: 60 },
  title: { fontSize: 32, fontWeight: '800', color: '#0A0E5E', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#64748B', lineHeight: 24, marginBottom: 32 },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#1E293B' },
  
  primaryButton: {
    backgroundColor: '#0A0E5E',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { opacity: 0.7 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
