import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';

export default function BookingsLayout() {
  const { t } = useTranslation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: t('my_bookings') }} />
      <Stack.Screen name="ticket" options={{ title: t('booking.booking_detail'), headerBackTitle: t('booking.go_back') }} />
    </Stack>
  );
} 