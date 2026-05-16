import { FormInput } from '@/components/ui/FormInput'
import { useSignupMutation } from '@/hooks/useSignUp'
import { useTheme } from '@/hooks/useTheme'
import { SignUpFormData, signupSchema } from '@/schemas/auth.schema'
import { termsService } from '@/services/termsService'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { useTranslation } from 'react-i18next'

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceCardLow },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { marginTop: 20, marginBottom: 24 },
  headerTextContainer: { marginBottom: 32 },
  logoContainer: { alignItems: 'flex-start', marginBottom: 10 },
  logoText: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, lineHeight: 34 },
  title: { fontSize: 32, fontWeight: '800', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted },
  formContainer: { gap: 20 },
  inputWrapper: { gap: 8 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, color: colors.textPrimary, fontSize: 15 },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  signUpButtonDisabled: { opacity: 0.6 },
  signUpButtonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 40 },
  footerText: { fontSize: 14, color: colors.textMuted },
  loginLink: { fontSize: 14, fontWeight: 'bold', color: colors.primary, marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surfaceModal, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 16 },
  modalScroll: { maxHeight: 300 },
  modalText: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
  acceptBtn: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 20 },
  acceptBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  termsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  termsCheckbox: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxUnchecked: { borderWidth: 2, borderColor: colors.border },
  termsText: { fontSize: 13, color: colors.textMuted, lineHeight: 20, flex: 1 },
  termsLink: { color: colors.primary, fontWeight: '700' },
  inputError: { borderColor: colors.error, borderWidth: 1, borderRadius: 14 },
  errorText: { fontSize: 12, color: colors.error, marginTop: 2 },
  formSection: { marginTop: 16, gap: 16 },
})

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { email: prefillEmail, staffToken } = useLocalSearchParams<{ email?: string; staffToken?: string }>()
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [termsContent, setTermsContent] = useState('')
  const [loadingTerms, setLoadingTerms] = useState(false)
  const signupMutation = useSignupMutation(staffToken)
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: prefillEmail || '',
      password: '',
      confirmPassword: '',
    },
  })

  const { colors, isDark } = useTheme();
  const s = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  useEffect(() => {
    (async () => {
      setLoadingTerms(true)
      try {
        const terms = await termsService.getLatest('client')
        setTermsContent(terms.content)
      } catch { setTermsContent(t('auth.terms_unavailable')) }
      finally { setLoadingTerms(false) }
    })()
  }, [])

  const onSubmit = (data: SignUpFormData) => {
    signupMutation.mutate(data)
  }

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1F71" />
          </TouchableOpacity>

          <View style={s.headerTextContainer}>
            <Text style={s.title}>{t('auth.create_account')}</Text>
            <Text style={s.subtitle}>{t('auth.signup_subtitle')}</Text>
          </View>

          <View style={s.formContainer}>
            <FormInput<SignUpFormData>
              label={t('auth.first_name')}
              name="firstName"
              control={control}
              icon="person-outline"
              placeholder={t('auth.first_name_placeholder')}
              error={errors.firstName}
            />

            <FormInput<SignUpFormData>
              label={t('auth.last_name')}
              name="lastName"
              control={control}
              icon="person-outline"
              placeholder={t('auth.last_name_placeholder')}
              error={errors.lastName}
            />

            <FormInput<SignUpFormData>
              label={t('auth.email')}
              name="email"
              control={control}
              icon="mail-outline"
              placeholder={t('auth.email_placeholder')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <FormInput<SignUpFormData>
              label={t('auth.password')}
              name="password"
              control={control}
              icon="lock-closed-outline"
              placeholder={t('auth.password_placeholder')}
              isPassword
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <FormInput<SignUpFormData>
              label={t('auth.confirm_password')}
              name="confirmPassword"
              control={control}
              icon="lock-closed-outline"
              placeholder={t('auth.password_placeholder')}
              isPassword
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              error={errors.confirmPassword}
            />

            {/* Terms checkbox */}
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 8 }}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              <View style={{
                width: 22, height: 22, borderRadius: 6, borderWidth: 2,
                borderColor: termsAccepted ? '#0A0E5E' : '#CBD5E0',
                backgroundColor: termsAccepted ? '#0A0E5E' : 'transparent',
                justifyContent: 'center', alignItems: 'center', marginTop: 2,
              }}>
                {termsAccepted && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: '#64748B', lineHeight: 18 }}>
                {t('auth.terms_text')}{' '}
                <Text style={{ color: '#0A0E5E', fontWeight: '700' }} onPress={() => setShowTerms(true)}>
                  {t('settings.terms')}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.signUpButton, (!termsAccepted || loadingTerms) && { opacity: 0.5 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={!termsAccepted || loadingTerms}
            >
              <Text style={s.signUpButtonText}>{t('auth.sign_up')}</Text>
            </TouchableOpacity>
          </View>

          {/* Terms Modal */}
          <Modal visible={showTerms} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
              <View style={{
                backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32,
                padding: 24, paddingBottom: 40, maxHeight: '80%',
              }}>
                <View style={{ width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 }} />
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 16 }}>{t('settings.terms')}</Text>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
                  <Text style={{ fontSize: 14, color: '#1A202C', lineHeight: 22, whiteSpace: 'pre-wrap' }}>{termsContent}</Text>
                </ScrollView>
                <TouchableOpacity
                  style={{ marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center' }}
                  onPress={() => setShowTerms(false)}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>{t('common.close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
