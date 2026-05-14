import BookingsScreen from '@/components/owner/booking/Bookings'
import { useUnreadCount } from '@/hooks/useUnreadCount'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export default function BookingsRoute() {
  const { hasUnread } = useUnreadCount();
  const { colors } = useTheme();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <BookingsScreen />
    </>
  )
}
