import { ROUTES } from '@/constants/routes'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos Entypo para el chevron
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export const CurrentBookingsCard = ({ count }: { count: number }) => {
  const router = useRouter()
  return (
    <TouchableOpacity
      onPress={() => router.navigate(ROUTES.OWNER.BOOKINGS)}
      activeOpacity={0.8} // Mejora el feedback al tocar
    >
      <View style={styles.card}>
        {/* Fila Superior con Icono y Flecha */}
        <View style={styles.headerRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="archive-outline" size={24} color="#0A0E5E" />
          </View>
          <Entypo name="chevron-right" size={20} color="#CBD5E1" />
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
    borderRadius: 32, // Un poco más redondeado según la imagen
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48, // Un poco más grande para que respire el icono
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F8FF', // Azul muy tenue
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' }, // Un tono casi negro como la imagen
  subText: { fontSize: 16, color: '#4B5563', marginTop: 4 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 8
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A0E5E',
    letterSpacing: 0.8
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#86EFAC' // El verde suave de la imagen
  },
})