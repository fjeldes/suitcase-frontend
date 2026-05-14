// hooks/useBookingsQuery.ts
import { bookingService } from '@/services/bookingService';
import { useQuery } from '@tanstack/react-query';

export function useBookingsQuery(status?: string, limit?: number, locationId?: string) {
  return useQuery({
    queryKey: ['bookings', { status, limit, locationId }],
    queryFn: () => bookingService.getMyBookings(status, limit, locationId),
    staleTime: 1000 * 60 * 2,
    enabled: !!locationId,
  });
}