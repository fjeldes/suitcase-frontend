import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface Pickups {
  totalToday: number;
  nextPickup: {
    time: string;
    nextItem: string;
  } | null;
}

export interface DashboardData {
  storeInfo: {
    id: string;
    name: string;
    status: string;
  };
  revenue: {
    today: number;
    yesterday: number;
    percentageIncrease: number;
  };
  bookings: {
    activeCount: number;
    liveStatus: boolean;
  };
  pickups: Pickups;
  
  occupancy: Array<{
    label: string;
    percentage: number;
    color: string;
  }>;
}

export const useDashboardStats = (locationId?: string) => {
  return useQuery<DashboardData>({
    // Incluimos locationId en la key para que si cambias de tienda, se refresque la caché
    queryKey: ['dashboard-stats', locationId],
    queryFn: async () => {
      // Ajustamos la URL a la que definiste en tu Controller
      const url = locationId 
        ? `/locations/owner/stats?locationId=${locationId}` 
        : '/locations/owner/stats';
        
      const { data } = await api.get(url);
      return data;
    },
    refetchInterval: 30000, // 30 segundos
    placeholderData: (previousData) => previousData,
    staleTime: 10000, // Considera los datos "frescos" por 10 segundos
  });
};