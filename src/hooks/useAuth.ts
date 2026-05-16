import { ROUTES } from '@/constants/routes';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export const useLoginMutation = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user);
      } else {
        console.error("El backend no envió los tokens esperados:", data);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid credentials';

      if (message.toLowerCase().includes('verify')) {
        const email = error.response?.data?.email || '';
        router.replace({ pathname: '/(auth)/verify-email', params: { email } });
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