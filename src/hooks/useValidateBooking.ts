// src/hooks/useValidateBooking.ts
import { bookingService } from '@/services/bookingService';
import { useMutation } from '@tanstack/react-query';

export function useValidateBooking() {
  return useMutation({
    // Definimos la función que llama al servicio
    mutationFn: (bookingId: string) => bookingService.validateQR(bookingId),
    
    // Aquí no invalidamos queries necesariamente, 
    // porque solo estamos "consultando/validando" para navegar.
    onError: (error: any) => {
      console.error("Error validating QR:", error);
    }
  });
}