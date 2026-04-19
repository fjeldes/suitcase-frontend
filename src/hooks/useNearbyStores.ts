import { locationService } from '@/services/locationServices';
import { useLocationStore } from '@/store/useLocationStore';
import { useQuery } from '@tanstack/react-query';

interface NearbyOptions {
  radius?: number;
  startDate?: Date;
  endDate?: Date;
}

export function useNearbyStores(options: NearbyOptions = {}) {
  const { radius = 5, startDate, endDate } = options;
  
  // Extraemos lat y lng de tu store de Zustand
  const { lat, lng } = useLocationStore();

  return useQuery({
    // Incluimos radius y fechas en la queryKey para que React Query 
    // refresque la data si el usuario cambia el filtro.
    queryKey: ['stores', 'nearby', lat, lng, radius, startDate?.toISOString(), endDate?.toISOString()],
    
    queryFn: async () => {
      if (!lat || !lng) return [];
      
      // Convertimos las fechas a string ISO solo si existen
      const startStr = startDate ? startDate.toISOString() : undefined;
      const endStr = endDate ? endDate.toISOString() : undefined;

      // Llamamos al service pasando todos los parámetros
      return locationService.getNearby(
        parseFloat(lat), 
        parseFloat(lng), 
        radius, 
        startStr, 
        endStr
      );
    },
    
    enabled: !!lat && !!lng, 
    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false,
  });
}