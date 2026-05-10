import BookingDetail from "@/screens/client/booking/BookingDetail";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
    const { id } = useLocalSearchParams();

    return <BookingDetail bookingId={id as string} />
}
