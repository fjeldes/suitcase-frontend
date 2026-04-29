import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Stack, useRouter } from 'expo-router'
import * as SplashScreenNative from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
// Hooks y Stores
import { ROUTES } from '@/constants/routes'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useRegisterPushToken } from '@/hooks/usePushNotifications'
import { SplashScreen } from '@/screens/auth/SplashScreen'
import { useAuthStore } from '@/store/useAuthStore'
import 'react-native-reanimated'

Notifications.setNotificationHandler({
  handleNotification: async () =>
    ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as Notifications.NotificationBehavior), // Casting explícito
})
const queryClient = new QueryClient()

SplashScreenNative.preventAutoHideAsync()

export const unstable_settings = {
  initialRouteName: '(auth)',
}

// --- COMPONENTE DE LÓGICA ---
function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter()
  const [appIsReady, setAppIsReady] = useState(false)
  const { isAuthenticated, user, checkAuth } = useAuthStore()

  // Ahora useMutation está dentro del Provider y no dará error
  const { mutate: registerPushToken } = useRegisterPushToken()

  // 1. Carga inicial de autenticación
  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth()
        // Delay cosmético para el Splash
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
    // Nota: En emuladores de Android con Google Play Services funciona,
    // pero Device.isDevice suele ser false. Puedes comentar esta validación para pruebas.
    if (!Device.isDevice && process.env.NODE_ENV !== 'development') return

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== 'granted') return

    try {
      const projectId =
        Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId // Fallback dependiendo de la versión

      if (!projectId) {
        console.error('Error: No se encontró el Project ID en app.json')
        return
      }
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId })

      registerPushToken({
        token: tokenData.data,
        provider: 'expo',
        deviceModel: Device.modelName || undefined,
      })
    } catch (error) {
      console.error('Error obteniendo push token:', error)
    }
  }

  // 3. Manejo de navegación y registro de notificaciones
  useEffect(() => {
    if (appIsReady) {
      SplashScreenNative.hideAsync()

      if (!isAuthenticated) {
        router.replace(ROUTES.AUTH.LOGIN)
      } else {
        // Registramos notificaciones solo si está autenticado
        configurePushNotifications()

        const roles = user?.roles || []
        if (roles.includes('owner')) {
          router.replace(ROUTES.OWNER.DASHBOARD)
        } else if (roles.includes('client')) {
          router.replace(ROUTES.CLIENT.EXPLORE)
        } else {
          router.replace(ROUTES.AUTH.LOGIN)
        }
      }
    }
  }, [appIsReady, isAuthenticated, user?.roles])

  if (!appIsReady) {
    return <SplashScreen />
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(owner)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(client)" options={{ animation: 'fade' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

// --- COMPONENTE PRINCIPAL (PROVIDERS) ---
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <RootLayoutNav />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}
