import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

// Definimos la interfaz para tener autocompletado y evitar errores
interface DashboardStats {
  activeItems: number;
  totalSlots: number;
  percentage: number;
  revenue: number;
}

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Llamada al endpoint que creamos en el LocationsController
      const { data } = await api.get('/locations/owner/stats');
      return data;
    },
    // Opcional: Refrescar los datos cada 30 segundos automáticamente
    refetchInterval: 30000, 
    // Evita que la UI parpadee si la conexión es lenta
    placeholderData: (previousData) => previousData,
  });
};