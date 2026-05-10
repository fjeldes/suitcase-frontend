import { api } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';

/**
 * Hook para convertir un cliente en owner.
 * Llama a POST /auth/become-owner, recibe nuevos tokens con el rol 'owner'
 * y actualiza el store de autenticación automáticamente.
 */
export function useBecomeOwner() {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/become-owner');
      return data;
    },
    onSuccess: (data) => {
      // Actualizamos el store con los nuevos tokens que incluyen el rol 'owner'
      if (data.accessToken && data.refreshToken) {
        setTokens(data.accessToken, data.refreshToken, data.user);
      }
    },
  });
}
