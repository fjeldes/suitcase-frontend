import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthRequest } from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);

  const clientIds = useMemo(() => ({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  }), []);

  const [request, response, promptAsync] = useAuthRequest(clientIds);

  const handleLogin = async (idToken: string) => {
    try {
      setIsLoading(true);
      const data = await authService.loginWithGoogle(idToken);

      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user);

        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'You have signed in with Google.',
          position: 'bottom',
        });

        const roles = data.user?.roles || [];
        router.replace(roles.includes('owner') || roles.includes('staff') ? '/(owner)' : '/(client)');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In Failed',
        text2: error.response?.data?.message || 'Could not authenticate with Google.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success' && response.params?.id_token) {
      handleLogin(response.params.id_token);
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      setIsLoading(false);
    }
  }, [response]);

  const signIn = async () => {
    setIsLoading(true);
    await promptAsync();
  };

  const isAvailable = !!(clientIds.iosClientId || clientIds.webClientId || clientIds.androidClientId || clientIds.expoClientId);

  return { signIn, isLoading: isLoading || !request, isAvailable };
};
