import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export const useLoginMutation = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authService.login(data),
    onSuccess: (data) => {
      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user);
      } else {
        console.error("El backend no envió los tokens esperados:", data);
      }
    },
    onError: (error: any, variables) => {
      const message = error.response?.data?.message || 'Invalid credentials';

      if (message.toLowerCase().includes('verify')) {
        router.replace({ pathname: '/(auth)/verify-email', params: { email: variables.email } });
        return;
      }

      import('react-native-toast-message').then(({ default: Toast }) => {
        Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: message,
            position: 'bottom',
        });
      });
    }
  });
};