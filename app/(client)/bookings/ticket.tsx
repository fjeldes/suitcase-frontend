import BookingTicketScreen from '@/screens/client/booking/BookingTicketScreen';
import { useBookingStore } from '@/store/useBookingStore';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function Page() {
    const { t } = useTranslation();
    const currentBooking = useBookingStore((state) => state.currentBooking);
  
    if (!currentBooking) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{t('booking.no_booking_selected')}</Text>
        </View>
      );
    }
  
    return <BookingTicketScreen booking={currentBooking} />;
  }