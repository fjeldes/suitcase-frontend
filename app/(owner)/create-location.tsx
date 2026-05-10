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
  Image,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { uploadService } from '@/services/uploadService'
import Toast from 'react-native-toast-message'

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
    imageUrl: null as string | null,
    workingHours: [
      { day: 1, label: 'Mon', open: '09:00', close: '18:00', isClosed: false },
      { day: 2, label: 'Tue', open: '09:00', close: '18:00', isClosed: false },
      { day: 3, label: 'Wed', open: '09:00', close: '18:00', isClosed: false },
      { day: 4, label: 'Thu', open: '09:00', close: '18:00', isClosed: false },
      { day: 5, label: 'Fri', open: '09:00', close: '18:00', isClosed: false },
      { day: 6, label: 'Sat', open: '10:00', close: '14:00', isClosed: true },
      { day: 0, label: 'Sun', open: '00:00', close: '00:00', isClosed: true },
    ]
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
        Toast.show({
          type: 'success',
          text1: 'Success! ✨',
          text2: 'Location created successfully.'
        });
        router.replace(ROUTES.OWNER.STORES);
        
      } catch (error: any) {
        console.error('Error creating location:', error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.response?.data?.message || 'Something went wrong'
        });
      } finally {
        setLoading(false);
      }
    };

    const pickImage = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Need access to gallery.' });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          setLoading(true);
          const uploadedUrl = await uploadService.uploadImage(result.assets[0].uri, 'locations');
          setForm({ ...form, imageUrl: uploadedUrl });
          Toast.show({ type: 'success', text1: 'Image uploaded!' });
        } catch (error) {
          Toast.show({ type: 'error', text1: 'Upload failed' });
        } finally {
          setLoading(false);
        }
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

        {/* Store Photo Section */}
        <View style={styles.sectionHeader}>
          <Ionicons name="camera" size={20} color="#B45309" />
          <Text style={styles.sectionTitle}>Store Photo</Text>
        </View>

        <TouchableOpacity 
          style={[styles.imageUploadCard, form.imageUrl ? styles.imageActive : null]} 
          onPress={pickImage}
          disabled={loading}
        >
          {form.imageUrl ? (
            <View style={styles.imagePreviewContainer}>
              <View style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image 
                  source={{ uri: form.imageUrl }} 
                  style={styles.previewImage} 
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="create" size={24} color="#FFF" />
                  <Text style={styles.overlayText}>Change Photo</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="cloud-upload-outline" size={40} color="#64748B" />
              <Text style={styles.uploadTitle}>Upload Main Photo</Text>
              <Text style={styles.uploadSubtitle}>Showcase your storage space</Text>
            </View>
          )}
        </TouchableOpacity>

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

        <View style={styles.sectionHeader}>
          <Ionicons name="time" size={20} color="#B45309" />
          <Text style={styles.sectionTitle}>Business Hours</Text>
        </View>

        <View style={styles.hoursContainer}>
          {form.workingHours.map((item, index) => (
            <View key={item.day} style={styles.hourRow}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayLabel}>{item.label}</Text>
                <TouchableOpacity 
                  onPress={() => {
                    const newHours = [...form.workingHours];
                    newHours[index].isClosed = !newHours[index].isClosed;
                    setForm({ ...form, workingHours: newHours });
                  }}
                  style={[styles.statusBadge, item.isClosed ? styles.closedBadge : styles.openBadge]}
                >
                  <Text style={styles.statusText}>{item.isClosed ? 'CLOSED' : 'OPEN'}</Text>
                </TouchableOpacity>
              </View>

              {!item.isClosed && (
                <View style={styles.timeInputs}>
                  <TextInput
                    style={styles.timeInput}
                    value={item.open}
                    onChangeText={(val) => {
                      const newHours = [...form.workingHours];
                      newHours[index].open = val;
                      setForm({ ...form, workingHours: newHours });
                    }}
                    placeholder="09:00"
                    maxLength={5}
                  />
                  <Text style={styles.timeDivider}>to</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={item.close}
                    onChangeText={(val) => {
                      const newHours = [...form.workingHours];
                      newHours[index].close = val;
                      setForm({ ...form, workingHours: newHours });
                    }}
                    placeholder="18:00"
                    maxLength={5}
                  />
                </View>
              )}
            </View>
          ))}
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
  imageUploadCard: {
    height: 180,
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: 25,
    overflow: 'hidden',
  },
  imageActive: {
    borderStyle: 'solid',
    borderColor: '#0A0E5E',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A0E5E',
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
  },
  imagePreviewContainer: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 14, 94, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  overlayText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  hoursContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0E5E',
    width: 40,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  openBadge: {
    backgroundColor: '#DCFCE7',
  },
  closedBadge: {
    backgroundColor: '#F1F5F9',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 60,
    textAlign: 'center',
    fontSize: 14,
    color: '#0A0E5E',
  },
  timeDivider: {
    fontSize: 12,
    color: '#94A3B8',
  },
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
