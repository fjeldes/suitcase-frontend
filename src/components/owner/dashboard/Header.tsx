import { ROUTES } from '@/constants/routes'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const HeaderDashboard = ({ storeName }: { storeName: string }) => {
  const router = useRouter()

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.storeIconBg}>
          <MaterialCommunityIcons name="storefront" size={20} color="#0A0E5E" />
        </View>
        <View>
          <Text style={styles.headerSubtitle}>ACTIVE HUB</Text>
          <Text style={styles.headerTitle}>{storeName}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconCircle}>
          <Ionicons name="notifications" size={24} color="#0A0E5E" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => router.push(ROUTES.OWNER.PROFILE)}
        >
          <Ionicons name="person-circle-outline" size={32} color="#0A0E5E" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  storeIconBg: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0A0E5E' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconCircle: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6D00',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#E2E8F0' },
})
