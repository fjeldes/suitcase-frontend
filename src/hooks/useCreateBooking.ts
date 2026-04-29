import { ROUTES } from '@/constants/routes';
import { bookingService, CreateBookingPayload } from '@/services/bookingService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.create(payload),
    onSuccess: () => {
      // Invalidamos el caché para que la lista de bookings se refresque
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      
      Alert.alert("Success", "Booking created successfully!", [
        { text: "OK", onPress: () => router.push(ROUTES.CLIENT.BOOKINGS) }
      ]);
    },
    onError: (error: any) => {
      console.error("Error creating booking:", error);
      const message = error.response?.data?.message || "Something went wrong";
      Alert.alert("Error", message);
    }
  });
}