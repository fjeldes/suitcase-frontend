import BookingDetail from "@/screens/client/booking/BookingDetail";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Page() {
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        const parent = navigation.getParent?.();
        if (parent) {
            parent.setOptions({ tabBarStyle: { display: 'none', height: 0 } });
            return () => parent.setOptions({ tabBarStyle: undefined });
        }
    }, [navigation]);

    return <BookingDetail bookingId={id as string} />
}
