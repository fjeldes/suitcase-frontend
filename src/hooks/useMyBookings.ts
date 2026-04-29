// hooks/useBookingsQuery.ts
import { bookingService } from '@/services/bookingService';
import { useQuery } from '@tanstack/react-query';

export function useBookingsQuery(status?: string, limit?: number, locationId?: string) {
  return useQuery({
    // Incluimos locationId en la key para que la caché sea específica por local
    queryKey: ['bookings', { status, limit, locationId }], 
    queryFn: () => bookingService.getMyBookings(status, limit, locationId),
    staleTime: 1000 * 60 * 2,
  });
}