import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface Pickups {
  totalToday: number;
  nextPickup: {
    time: string;
    nextItem: string;
  } | null;
}

export interface NextEvent {
  time: string;
  customerName: string;
  itemsDetail: string;
}

export interface EventSummary {
  totalToday: number;
  nextEvent: NextEvent | null;
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
  // AQUÍ EL CAMBIO: Agregamos dropoffs y renombramos las interfaces internas para claridad
  dropoffs: {
    totalToday: number;
    nextDropoff: NextEvent | null;
  };
  pickups: {
    totalToday: number;
    nextPickup: NextEvent | null;
  };
  occupancy: Array<{
    label: string;
    percentage: number;
    color: string;
  }>;
}

export const useDashboardStats = (locationId?: string, options?: { enabled?: boolean }) => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard-stats', locationId],
    queryFn: async () => {
      const url = locationId
        ? `/locations/owner/stats?locationId=${locationId}`
        : '/locations/owner/stats';

      const { data } = await api.get(url);
      return data;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: 30000,
    placeholderData: (previousData) => previousData,
    staleTime: 10000,
  });
};

export interface Location {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
  city?: string;
  country?: string;
}

export const useMyLocations = () => {
  return useQuery<Location[]>({
    queryKey: ['my-locations'],
    queryFn: async () => {
      const { data } = await api.get('/locations/me');
      return data;
    },
    staleTime: 30000, // 30 segundos de datos frescos
  });
};