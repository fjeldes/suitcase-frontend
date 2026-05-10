import PastBookings from '@/screens/client/booking/PastBookings';
import { useLocalSearchParams } from 'expo-router';

export default function Page() {
    const { id } = useLocalSearchParams();
    return <PastBookings bookingId={id as string} />
}
