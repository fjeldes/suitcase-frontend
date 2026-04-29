import BookingTicketScreen from '@/screens/client/booking/BookingTicketScreen';
import { useBookingStore } from '@/store/useBookingStore';
import { Text, View } from 'react-native';

export default function Page() {
    // Rescatamos la reserva actual del store
    const currentBooking = useBookingStore((state) => state.currentBooking);
  
    // Si por alguna razón el usuario recarga la app y el store se limpia:
    if (!currentBooking) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No hay una reserva seleccionada</Text>
        </View>
      );
    }
  
    return <BookingTicketScreen booking={currentBooking} />;
  }