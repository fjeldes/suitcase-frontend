import { Stack } from 'expo-router';

export default function BookingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Mis Reservas' }} />
      <Stack.Screen name="ticket" options={{ title: 'Detalle del Ticket', headerBackTitle: 'Volver' }} />
    </Stack>
  );
} 