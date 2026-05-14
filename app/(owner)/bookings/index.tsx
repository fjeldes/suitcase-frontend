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
      <Stack.Screen
        options={{
          headerTitle: 'Current Bookings',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.surfaceCard },
          headerLeft: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="menu" size={24} color={colors.iconColor} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <View>
                <Ionicons name="notifications-outline" size={24} color={colors.iconColor} />
                {hasUnread && <View style={[styles.dot, { backgroundColor: colors.dotRed, borderColor: colors.surfaceCard }]} />}
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <BookingsScreen />
    </>
  )
}

const styles = StyleSheet.create({
  headerBtn: {
    paddingHorizontal: 15,
  },
  dot: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
})
