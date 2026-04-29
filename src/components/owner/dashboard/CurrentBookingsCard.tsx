import { ROUTES } from '@/constants/routes'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const CurrentBookingsCard = ({ count }: { count: number }) => {
  const router = useRouter()
  return (
    <TouchableOpacity onPress={() => router.push(ROUTES.OWNER.BOOKINGS)}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="archive-outline" size={24} color="#0A0E5E" />
        </View>

        <Text style={styles.title}>Current Bookings</Text>
        <Text style={styles.subText}>{count} active bookings</Text>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>LIVE STATUS</Text>
          <View style={styles.dot} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
  subText: { fontSize: 16, color: '#64748B', marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 8 },
  statusText: { fontSize: 12, fontWeight: '800', color: '#0A0E5E', letterSpacing: 0.5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
})
