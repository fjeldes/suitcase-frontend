// hooks/useMyBookings.ts
import { bookingService } from '@/services/bookingService';
import { useQuery } from '@tanstack/react-query';

export function useMyBookings() {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getMyBookings,
    staleTime: 1000 * 60 * 2, // 2 minutos de frescura
  });
}