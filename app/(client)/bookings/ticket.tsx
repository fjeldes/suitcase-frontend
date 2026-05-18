import BookingTicketScreen from '@/screens/client/booking/BookingTicketScreen';
import { useBookingStore } from '@/store/useBookingStore';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Page() {
    const navigation = useNavigation();
    const currentBooking = useBookingStore((state) => state.currentBooking);

    useEffect(() => {
        const parent = navigation.getParent?.();
        if (parent) {
            parent.setOptions({ tabBarStyle: { display: 'none', height: 0 } });
            return () => parent.setOptions({ tabBarStyle: undefined });
        }
    }, [navigation]);
  
    if (!currentBooking) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No booking selected</Text>
        </View>
      );
    }
  
    return <BookingTicketScreen booking={currentBooking} />;
  }