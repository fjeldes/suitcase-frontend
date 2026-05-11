import { FormInput } from '@/components/ui/FormInput'
import { useSignupMutation } from '@/hooks/useSignUp'
import { SignUpFormData, signupSchema } from '@/schemas/auth.schema'
import { termsService } from '@/services/termsService'
import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
export default function RegisterScreen() {
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

  useEffect(() => {
    (async () => {
      setLoadingTerms(true)
      try {
        const terms = await termsService.getLatest('client')
        setTermsContent(terms.content)
      } catch { setTermsContent('Terms and conditions are currently unavailable.') }
      finally { setLoadingTerms(false) }
    })()
  }, [])

  const onSubmit = (data: SignUpFormData) => {
    signupMutation.mutate(data)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1A1F71" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SecureCustodian for a safe storage.</Text>
          </View>

          <View style={styles.formContainer}>
            <FormInput<SignUpFormData>
              label="FIRST NAME"
              name="firstName"
              control={control}
              icon="person-outline"
              placeholder="John"
              error={errors.firstName}
            />

            <FormInput<SignUpFormData>
              label="LAST NAME"
              name="lastName"
              control={control}
              icon="person-outline"
              placeholder="Doe"
              error={errors.lastName}
            />

            <FormInput<SignUpFormData>
              label="EMAIL"
              name="email"
              control={control}
              icon="mail-outline"
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <FormInput<SignUpFormData>
              label="PASSWORD"
              name="password"
              control={control}
              icon="lock-closed-outline"
              placeholder="********"
              isPassword
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <FormInput<SignUpFormData>
              label="CONFIRM PASSWORD"
              name="confirmPassword"
              control={control}
              icon="lock-closed-outline"
              placeholder="********"
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
                I have read and accept the{' '}
                <Text style={{ color: '#0A0E5E', fontWeight: '700' }} onPress={() => setShowTerms(true)}>
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signUpButton, (!termsAccepted || loadingTerms) && { opacity: 0.5 }]}
              onPress={handleSubmit(onSubmit)}
              disabled={!termsAccepted || loadingTerms}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
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
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 16 }}>Terms & Conditions</Text>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator>
                  <Text style={{ fontSize: 14, color: '#1A202C', lineHeight: 22, whiteSpace: 'pre-wrap' }}>{termsContent}</Text>
                </ScrollView>
                <TouchableOpacity
                  style={{ marginTop: 20, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center' }}
                  onPress={() => setShowTerms(false)}
                >
                  <Text style={{ fontSize: 15, fontWeight: '700', color: 'white' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* ... Resto del componente (Divider, Social, etc.) */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { marginTop: 20, marginBottom: 24 },
  headerTextContainer: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#1A1F71', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
  formContainer: { gap: 20 },
  inputWrapper: { gap: 8 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#1A1F71', letterSpacing: 0.5 },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, color: '#1A1F71', fontSize: 15 },
  signUpButton: {
    backgroundColor: '#0A0E5E',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    elevation: 4,
    shadowColor: '#0A0E5E',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  signUpButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  dividerText: { marginHorizontal: 10, fontSize: 12, color: '#AAA', fontWeight: '600' },
  socialContainer: { flexDirection: 'row', gap: 16 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  socialText: { fontSize: 15, fontWeight: '600', color: '#000' },
  footerLink: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 14, color: '#666' },
  footerLinkBold: { color: '#0A0E5E', fontWeight: '800' },
})
