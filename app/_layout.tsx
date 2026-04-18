import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreenNative from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Hooks y Stores
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { useAuthStore } from '@/store/useAuthStore';

import { ROUTES } from '@/constants/routes';
import 'react-native-reanimated';

const queryClient = new QueryClient();

SplashScreenNative.preventAutoHideAsync();

export const unstable_settings = {
  // Ahora apuntamos al grupo limpio de auth
  initialRouteName: '(auth)', 
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);
  
  // Extraemos también el user para decidir la ruta según su rol si fuera necesario
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        await checkAuth();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn('Error durante la carga inicial:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreenNative.hideAsync();

      if (!isAuthenticated) {
        // Al usar paréntesis (auth), la ruta interna suele ser directa
        router.replace(ROUTES.AUTH.LOGIN)
      } else {
        // Redirección directa al grupo de owner (ya no existe /tabs/)
        router.replace(ROUTES.OWNER.DASHBOARD);
      }
    }
  }, [appIsReady, isAuthenticated]);

  if (!appIsReady) {
    return <SplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            
            <Stack screenOptions={{ headerShown: false }}>
              {/* Definimos los grupos raíz. 
                  Esto permite que el router encuentre cualquier ruta dentro de ellos. */}
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(owner)" options={{ animation: 'fade' }} />
              <Stack.Screen name="(client)" options={{ animation: 'fade' }} />
              
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
              <Stack.Screen name="+not-found" />
            </Stack>

            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}