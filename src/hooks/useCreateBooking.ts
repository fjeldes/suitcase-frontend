import { ROUTES } from '@/constants/routes';
import { bookingService, CreateBookingPayload } from '@/services/bookingService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.create(payload),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      const bookingId = data?.id;
      if (bookingId) {
        router.replace(ROUTES.CLIENT.BOOKING_DETAIL(bookingId));
      } else {
        router.replace(ROUTES.CLIENT.BOOKINGS);
      }
    },
    onError: (error: any) => {
      console.error("Error creating booking:", error);
      const message = error.response?.data?.message || "Something went wrong";
      Toast.show({ type: 'error', text1: 'Error', text2: message });
    }
  });
}