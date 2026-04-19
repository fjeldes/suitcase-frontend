import BookingDetail from "@/components/booking/BookingDetail";
import { useLocalSearchParams } from "expo-router";

export default function Page() {
  const { id } = useLocalSearchParams();
  return <BookingDetail storeId={id}/>
}
