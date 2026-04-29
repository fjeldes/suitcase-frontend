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
      // Un pequeño tip: si el error es 401 aquí, es por credenciales inválidas
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
    }
  });
};