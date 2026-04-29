// src/hooks/useProcessBooking.ts
import { bookingService } from '@/services/bookingService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useProcessBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    // Llamamos al método PATCH de nuestro servicio
    mutationFn: (qrCode: string) => bookingService.processBookingAction(qrCode),
    
    onSuccess: () => {
      // IMPORTANTE: Invalidamos las queries del dashboard o lista de reservas
      // para que cuando el owner vuelva, vea los datos actualizados.
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['location-stats'] });
    },
  });
}