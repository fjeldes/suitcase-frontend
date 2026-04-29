import BookingsScreen from '@/components/owner/booking/Bookings'
import { Ionicons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

export default function BookingsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Current Bookings',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#F9FAFB' },
          headerLeft: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <Ionicons name="menu" size={24} color="#0A0E5E" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerBtn}>
              <View>
                <Ionicons name="notifications-outline" size={24} color="#0A0E5E" />
                <View style={styles.dot} />
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
    backgroundColor: '#E74C3C',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
})
