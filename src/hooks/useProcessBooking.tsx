import { bookingService } from '@/services/bookingService';
import { useBookingStore } from '@/store/useBookingStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useProcessBooking() {
  const queryClient = useQueryClient();
  const clearCurrentBooking = useBookingStore((s) => s.clearCurrentBooking);

  return useMutation({
    mutationFn: (qrCode: string) => bookingService.processBookingAction(qrCode),

    onSuccess: () => {
      clearCurrentBooking();
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['location-stats'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
