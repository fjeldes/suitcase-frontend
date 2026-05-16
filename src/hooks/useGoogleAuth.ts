import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { Google } from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            handleLogin(id_token);
        } else if (response?.type === 'error' || response?.type === 'cancel') {
            setIsLoading(false);
        }
    }, [response]);

    const handleLogin = async (idToken: string) => {
        setIsLoading(true);
        try {
            // Llamada a tu service que acabamos de actualizar
            const data = await authService.loginWithGoogle(idToken);

            if (data.accessToken) {
                // Guardar en Zustand
                setTokens(data.accessToken, data.refreshToken, data.user);

                // Alerta personalizada estilo KipGo
                Toast.show({
                    type: 'successCustom',
                    text1: 'Registration Successful!',
                    text2: `Welcome to the family, ${data.user.name || 'Partner'}.`,
                    position: 'bottom',
                });

                // Redirección basada en roles (igual que en tu RootLayout)
                const roles = data.user?.roles || [];
                if (roles.includes('owner')) {
                    router.replace(ROUTES.OWNER.DASHBOARD);
                } else {
                    router.replace(ROUTES.CLIENT.EXPLORE);
                }
            }
        } catch (error) {
            console.error('Google Login Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo iniciar sesión con Google.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        signIn: () => {
            setIsLoading(true);
            promptAsync();
        },
        isLoading: isLoading || !request,
    };
};