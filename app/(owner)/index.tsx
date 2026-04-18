import { DashboardStats } from '@/components/owner/DashboardStats'
import { LocationList } from '@/components/owner/LocationList'
import { RecentActivity } from '@/components/owner/RecentActivity'
import { UpcomingPickups } from '@/components/owner/UpcomingPickups'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function OwnerDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)

  const handleNewLocation = () => {
    router.push(ROUTES.OWNER.CREATE_LOCATION)
  }

  const handleGoToProfile = () => {
    // Expo Router suele aplanar las rutas, pero usamos la ruta completa por seguridad
    router.push(ROUTES.OWNER.PROFILE)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header interactivo que lleva al perfil */}
        <TouchableOpacity 
          style={styles.header} 
          onPress={handleGoToProfile}
          activeOpacity={0.7}
        >
          <View>
            <Text style={styles.welcomeText}>Hola, {user?.name || ''}</Text>
            <Text style={styles.viewProfileText}>Ver mi perfil</Text>
          </View>
          
          <View style={styles.avatar}>
            {/* Mostramos la inicial del usuario para que no se vea vacío */}
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </TouchableOpacity>

        <DashboardStats revenue={2450} slots="14/20" />

        <UpcomingPickups count={3} nextTime="14:30" nextItem="Suitcase (M)" />

        <TouchableOpacity
          style={styles.newLocationBtn}
          onPress={handleNewLocation}
          activeOpacity={0.7}
        >
          <View style={styles.plusIcon}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: '300' }}>+</Text>
          </View>
          <Text style={styles.newLocationTitle}>New Location</Text>
          <Text style={styles.newLocationSub}>Expand your storage network</Text>
        </TouchableOpacity>

        <LocationList />

        <RecentActivity />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  scrollContent: { padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: '#0A0E5E' },
  viewProfileText: { fontSize: 14, color: '#64748B', marginTop: -2 },
  avatar: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    backgroundColor: '#0A0E5E', // Color corporativo
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  avatarText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  newLocationBtn: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 35,
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#fff',
  },
  plusIcon: {
    backgroundColor: '#FF6D00',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#FF6D00',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  newLocationTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
  newLocationSub: { color: '#64748B', fontSize: 14, marginTop: 4 },
})