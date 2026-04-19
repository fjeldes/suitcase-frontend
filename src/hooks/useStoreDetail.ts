import { locationService } from '@/services/locationServices';
import { useQuery } from '@tanstack/react-query';

export function useStoreDetail(storeId: string | string[] | undefined) {
  // Aseguramos que el ID sea un string simple
  const id = Array.isArray(storeId) ? storeId[0] : storeId;

  return useQuery({
    // La queryKey incluye el id para que si cambia, se refresque la data
    queryKey: ['store', id],
    
    queryFn: async () => {
      if (!id) throw new Error('Store ID is required');
      return locationService.getById(id);
    },

    // Configuraciones de optimización
    enabled: !!id,           // No se ejecuta si no hay ID
    staleTime: 1000 * 60 * 10, // La info de la tienda no cambia seguido (10 min)
    retry: 1,
  });
}