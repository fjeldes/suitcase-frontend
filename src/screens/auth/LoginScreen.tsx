import { GoogleButton } from '@/components/auth/GoogleButton'
import { ROUTES } from '@/constants/routes'
import { useLoginMutation } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
} from 'react-native'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export const LoginScreen = () => {
  const router = useRouter()
  const { colors } = useTheme()
  const [showPassword, setShowPassword] = React.useState(false)
  const loginMutation = useLoginMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data)
  }

  const s = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.flex}
      >
        <View style={s.content}>
          <View style={s.header}>
            <View style={s.logoRow}>
              <MaterialCommunityIcons name="shield-lock" size={28} color={colors.iconColor} />
              <Text style={s.logoText}>
                Secure<Text style={s.bold}>Transit</Text>
              </Text>
            </View>
            <Text style={s.title}>Welcome Back</Text>
            <Text style={s.subtitle}>Please enter your details to access your dashboard.</Text>
          </View>

          <View style={s.form}>
            <Text style={s.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[s.inputContainer, errors.email && s.inputError]}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textMuted}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="name@company.com"
                    placeholderTextColor={colors.iconMuted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loginMutation.isPending}
                    accessibilityLabel="Email address input"
                  />
                </View>
              )}
            />
            {errors.email && <Text style={s.errorText}>{errors.email.message}</Text>}

            <View style={s.labelRow}>
              <Text style={s.label}>Password</Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} accessibilityLabel="Forgot password" accessibilityRole="button">
                <Text style={s.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={[s.inputContainer, errors.password && s.inputError]}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textMuted}
                    style={s.inputIcon}
                  />
                  <TextInput
                    style={s.input}
                    placeholder="••••••••"
                    placeholderTextColor={colors.iconMuted}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                    editable={!loginMutation.isPending}
                    accessibilityLabel="Password input"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} accessibilityLabel={showPassword ? 'Hide password' : 'Show password'} accessibilityRole="button">
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && <Text style={s.errorText}>{errors.password.message}</Text>}

            <TouchableOpacity
              style={[s.loginBtn, loginMutation.isPending && s.disabledBtn]}
              onPress={handleSubmit(onSubmit)}
              disabled={loginMutation.isPending}
              accessibilityLabel="Login"
              accessibilityRole="button"
            >
              {loginMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={s.loginBtnText}>Login</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={s.dividerContainer}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          <GoogleButton />

          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push(ROUTES.AUTH.SIGNUP)} accessibilityLabel="Sign up" accessibilityRole="button">
              <Text style={s.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: -15,
    marginBottom: 15,
    marginLeft: 4,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  container: { flex: 1, backgroundColor: colors.surfaceCardLow },
  flex: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
  logoText: { fontSize: 20, color: colors.iconColor, fontWeight: '300' },
  bold: { fontWeight: '700' },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 12 },
  subtitle: { fontSize: 16, color: colors.textMuted, lineHeight: 24 },
  form: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: colors.textLabel, marginBottom: 8 },
  forgotPassword: { fontSize: 14, fontWeight: '600', color: colors.iconColor, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: colors.textPrimary },
  loginBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { marginHorizontal: 16, color: colors.textMuted, fontWeight: '500' },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceCard,
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 12,
  },
  socialBtnText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: colors.textMuted, fontSize: 14 },
  signUpLink: { color: colors.iconColor, fontSize: 14, fontWeight: 'bold' },
})
