import { locationService } from '@/services/locationServices';
import { useQuery } from '@tanstack/react-query';

export function useStoreDetail(storeId: string | string[] | undefined) {
  // Limpiamos el ID: si es array tomamos el primero, si es undefined queda como null
  const id = Array.isArray(storeId) ? storeId[0] : storeId;

  return useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      // Usamos el id directamente aquí
      return locationService.getById(id!);
    },
    // Solo se activa si el id tiene contenido real (no es string vacío ni undefined)
    enabled: !!id && id !== '',
    staleTime: 1000 * 60 * 10,
    // Muestra la data anterior mientras carga la nueva si el ID cambia
    placeholderData: (previousData) => previousData,
  });
}