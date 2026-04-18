import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () => {
  // Extraemos setToken del store
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // data viene del backend como { access_token, user: { ... } }
      setToken(data.access_token, data.user);
    },
    onError: (error: any) => {
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
    }
  });
};