import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreenNative from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { NetworkBanner } from '@/components/ui/NetworkBanner'
import { initSentry } from '@/services/sentry'
import * as Linking from 'expo-linking'
import '@/i18n'
import { i18nReady } from '@/i18n'
// Hooks y Stores
import { toastConfig } from '@/config/toastConfig'
import { ROUTES } from '@/constants/routes'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRegisterPushToken } from '@/hooks/usePushNotifications'
import { SplashScreen } from '@/screens/auth/SplashScreen'
import { useAuthStore } from '@/store/useAuthStore'
import 'react-native-reanimated'
import Toast from 'react-native-toast-message'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
      staleTime: 1000 * 60 * 2,     // 2 min stale
    },
  },
})

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'TANSTACK_QUERY_CACHE',
})

SplashScreenNative.preventAutoHideAsync()

export const unstable_settings = {
  initialRouteName: '(auth)',
}

// --- COMPONENTE DE LÓGICA ---
function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)
  const splashHidden = React.useRef(false);
  const { isAuthenticated, user, checkAuth } = useAuthStore()

  useEffect(() => { initSentry() }, [])

  // Ahora useMutation está dentro del Provider y no dará error
  const { mutate: registerPushToken } = useRegisterPushToken()

  // 1. Carga inicial de autenticación
  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([checkAuth(), i18nReady])
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn('Error durante la carga inicial:', e)
      } finally {
        setAppIsReady(true)
      }
    }
    prepare()
  }, [])

  // 2. Función para obtener y registrar el Token
  async function configurePushNotifications() {
    if (!Device.isDevice && process.env.NODE_ENV !== 'development') return

    try {
      const Notifications = await import('expo-notifications')

      Notifications.default.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      })

      const { status: existingStatus } = await Notifications.default.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.default.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') return

      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId

      if (!projectId) {
        console.error('Error: No se encontró el Project ID en app.json')
        return
      }

      const tokenData = await Notifications.default.getExpoPushTokenAsync({ projectId })

      registerPushToken({
        token: tokenData.data,
        provider: 'expo',
        deviceModel: Device.modelName || undefined,
      })
    } catch (error) {
      console.error('Error obteniendo push token:', error)
    }
  }

  const segments = useSegments();

  // 3. Manejo de navegación inicial y registro de notificaciones
  useEffect(() => {
    if (!appIsReady) return;

    if (!splashHidden.current) {
      SplashScreenNative.hideAsync().catch(() => {});
      splashHidden.current = true;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        AsyncStorage.getItem('onboarding_complete').then((done) => {
          if (done === 'true') {
            router.replace(ROUTES.AUTH.LOGIN);
          } else {
            router.replace('/(auth)/onboarding');
          }
        });
      }
    } else {
      if (inAuthGroup || segments.length === 0) {
        configurePushNotifications();

        const roles = user?.roles || [];
        if (roles.includes('owner') || roles.includes('staff')) {
          router.replace(ROUTES.OWNER.DASHBOARD);
        } else if (roles.includes('client')) {
          router.replace(ROUTES.CLIENT.EXPLORE);
        } else {
          router.replace(ROUTES.AUTH.LOGIN);
        }
      }
    }
  }, [appIsReady, isAuthenticated, user, segments])

  // Deep link handler
  useEffect(() => {
    const parseParams = (query: string): Record<string, string> => {
      const params: Record<string, string> = {};
      if (!query) return params;
      query.split('&').forEach((p) => {
        const [k, v] = p.split('=');
        if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
      return params;
    };

    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      const path = url.replace(/.*?:\/\//g, '').split('?')[0].replace(/\/$/g, '');
      const query = url.split('?')[1] || '';
      const params = parseParams(query);

      if (path === 'accept-staff' && params.token) {
        router.push(`/accept-staff?token=${params.token}`);
      } else if (path === 'reset-password' && params.token) {
        router.push(`/(auth)/reset-password?token=${params.token}`);
      }
    };

    Linking.getInitialURL().then((url) => { if (url) handleDeepLink({ url }); });
    const sub = Linking.addEventListener('url', handleDeepLink);
    return () => sub.remove();
  }, []);

  if (!appIsReady) {
    return <SplashScreen />
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={Platform.OS === 'android' ? { flex: 1, paddingTop: insets.top } : { flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(owner)" options={{ animation: 'fade' }} />
          <Stack.Screen name="(client)" options={{ animation: 'fade' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="accept-staff" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

import { StripeProvider } from '@stripe/stripe-react-native'

// --- COMPONENTE PRINCIPAL (PROVIDERS) ---
export default function RootLayout() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"}
        merchantIdentifier="merchant.com.suitcase"
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <ErrorBoundary>
              <View style={{ flex: 1 }}>
                <NetworkBanner />
                <RootLayoutNav />
              </View>
            </ErrorBoundary>
            <Toast config={toastConfig} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </StripeProvider>
    </PersistQueryClientProvider>
  )
}
