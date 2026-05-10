import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  // 1. Usamos el nombre correcto del Store (plural)
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      /** * 2. Ajustamos a la nueva estructura del backend:
       * data ahora es: { accessToken, refreshToken, user }
       */
      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user);
      } else {
        console.error("El backend no envió los tokens esperados:", data);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Invalid credentials';
      
      // Muestra un Toast mucho más amigable
      import('react-native-toast-message').then(({ default: Toast }) => {
        Toast.show({
            type: 'error',
            text1: message.includes('verify') ? 'Verificación Requerida' : 'Login Failed',
            text2: message,
            position: 'bottom',
        });
      });
      console.error("Error al iniciar sesión:", message);
    }
  });
};