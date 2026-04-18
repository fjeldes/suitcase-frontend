import { StorageCard } from '@/components/owner/create-location/StorageCard'
import { ROUTES } from '@/constants/routes'
import { locationService } from '@/services/locationServices'
import { useLocationStore } from '@/store/useLocationStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

export default function CreateLocationScreen() {
  const router = useRouter()
  // Obtenemos los datos del store global
  const { address, lat, lng } = useLocationStore()

  const [loading, setLoading] = useState(false);
  // Si quieres que el store se limpie al salir definitivamente al dashboard
  // 1. Recibimos los parámetros que inyectamos desde el MapSelector
  const [form, setForm] = useState({
    name: '',
    address: '',
    smallPrice: '5.00',
    mediumPrice: '8.00',
    largePrice: '12.00',
    smallCapacity: '1',
    mediumCapacity: '1',
    largeCapacity: '1',
    lat: '',
    lng: '',
  })

  // 2. Efecto para actualizar el formulario cuando volvemos del mapa
  useEffect(() => {
    if (address) {
      setForm((prev) => ({
        ...prev,
        address: address as string,
        lat: lat as string,
        lng: lng as string,
      }))
    }
  }, [address, lat, lng]) // <-- Asegúrate de tener estas 3 dependencias

  const handleBack = () => {
    // router.navigate(ROUTES.OWNER.DASHBOARD);
    router.back()
  }

  
  
    const handleSubmit = async () => {
      if (loading) return; // Evita doble click
      
      try {
        setLoading(true);
        
        // Llamamos al servicio reutilizable
        const response = await locationService.create(form);
        
        console.log('Success:', response);
        alert('Location created successfully!');
        router.replace(ROUTES.OWNER.DASHBOARD);
        
      } catch (error: any) {
        console.error('Error creating location:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        {/* Cambiamos a handleBack para mayor seguridad */}
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SECURE CUSTODIAN</Text>
        <View style={styles.avatarPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Add Storage Location</Text>
        <Text style={styles.description}>
          Expand your network. Provide a secure vault for travelers and earn more...
        </Text>

        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={20} color="#B45309" />
          <Text style={styles.sectionTitle}>Location Details</Text>
        </View>

        <Text style={styles.inputLabel}>Location Name</Text>
        <TextInput
          style={styles.textField}
          placeholder="e.g. Grand Central Secure Storage"
          value={form.name}
          onChangeText={(val) => setForm({ ...form, name: val })}
        />

        <Text style={styles.inputLabel}>Full Address</Text>
        <TextInput
          style={styles.textField}
          placeholder="Select address on map"
          value={form.address}
          editable={false} // Forzamos el uso del mapa para geolocalización
        />

        <TouchableOpacity
          style={[styles.mapPlaceholder, form.lat ? styles.mapPinned : null]}
          onPress={() => router.push(ROUTES.OWNER.MAP_SELECTOR)}
        >
          <View style={styles.mapButton}>
            <Ionicons name={form.lat ? 'checkmark-circle' : 'navigate'} size={18} color="#0A0E5E" />
            <Text style={styles.mapButtonText}>
              {form.lat ? 'Location Pinned' : 'Pin Location on Map'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Ionicons name="cash" size={20} color="#B45309" />
          <Text style={styles.sectionTitle}>Luggage Pricing</Text>
        </View>

        <View style={styles.priceContainer}>
          <StorageCard
            icon="bag-personal"
            label="Small"
            subLabel="Backpacks, Handbags"
            priceValue={form.smallPrice}
            capacityValue={form.smallCapacity}
            onPriceChange={(v) => setForm({ ...form, smallPrice: v })}
            onCapacityChange={(v) => setForm({ ...form, smallCapacity: v })}
          />
          {/* MEDIUM */}
          <StorageCard
            icon="bag-suitcase"
            label="Medium"
            subLabel="Carry-ons, Standard Suitcases"
            priceValue={form.mediumPrice}
            capacityValue={form.mediumCapacity}
            onPriceChange={(v) => setForm({ ...form, mediumPrice: v })}
            onCapacityChange={(v) => setForm({ ...form, mediumCapacity: v })}
          />

          {/* LARGE */}
          <StorageCard
            icon="suitcase"
            label="Large"
            subLabel="Large Check-in Bags, Trunk"
            priceValue={form.largePrice}
            capacityValue={form.largeCapacity}
            onPriceChange={(v) => setForm({ ...form, largePrice: v })}
            onCapacityChange={(v) => setForm({ ...form, largeCapacity: v })}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()} disabled={loading}>
          <Text style={styles.submitBtnText}>Create Storage Location</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FE' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: '#0A0E5E', letterSpacing: 1 },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#E2E8F0' },
  scroll: { padding: 20 },
  mainTitle: { fontSize: 32, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 10 },
  description: { fontSize: 15, color: '#64748B', lineHeight: 22, marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  textField: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 15,
    color: '#0A0E5E',
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: '#94A3B8',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mapPinned: { backgroundColor: '#CBD5E1', borderWidth: 2, borderColor: '#0A0E5E' },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 3,
  },
  mapButtonText: { fontWeight: 'bold', color: '#0A0E5E' },
  priceContainer: { gap: 12 },
  submitBtn: {
    backgroundColor: '#0A0E5E',
    borderRadius: 18,
    height: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})
