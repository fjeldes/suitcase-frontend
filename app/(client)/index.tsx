import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'

import { ROUTES } from '@/constants/routes'
import { useNearbyStores } from '@/hooks/useNearbyStores'
import { useUserLocation } from '@/hooks/useUserLocation'
import { useLocationStore } from '@/store/useLocationStore'
import { useRouter } from 'expo-router'

export default function ExploreScreen() {
  const mapRef = useRef<MapView>(null)
  const router = useRouter()
  const [selectedStore, setSelectedStore] = useState<any>(null)

  // --- Lógica de Animación ---
  const bottomAnim = useRef(new Animated.Value(110)).current

  useEffect(() => {
    Animated.spring(bottomAnim, {
      toValue: selectedStore ? 360 : 110,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start()
  }, [selectedStore])

  const { getLocation, loading: locationLoading } = useUserLocation()
  const { lat, lng, setLocation } = useLocationStore()
  const { data: stores, isLoading: storesLoading } = useNearbyStores()

  const handleCenterMap = async () => {
    await getLocation()
    if (lat && lng) {
      mapRef.current?.animateToRegion(
        {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      )
    }
  }

  const handleRegionChange = (region: Region) => {
    setLocation({
      address: 'Map Area',
      lat: region.latitude.toString(),
      lng: region.longitude.toString(),
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={{
          latitude: lat ? parseFloat(lat) : -33.4489,
          longitude: lng ? parseFloat(lng) : -70.6693,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChangeComplete={handleRegionChange}
        // Solo cerramos si tocamos el mapa directamente, no un marcador
        onPress={() => setSelectedStore(null)}
      >
        {stores?.map((store: any) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: parseFloat(store.lat),
              longitude: parseFloat(store.lng),
            }}
            // IMPORTANTE: stopPropagation evita que el mapa reciba el toque y cierre la card
            onPress={(e) => {
              e.stopPropagation()
              setSelectedStore(store)
            }}
          >
            <View
              style={[
                styles.markerContainer,
                selectedStore?.id === store.id ? styles.markerActive : styles.markerInactive,
              ]}
            >
              <Ionicons
                name="lock-closed"
                size={selectedStore?.id === store.id ? 20 : 16}
                color="white"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Botón de Ubicación */}
      <Animated.View style={[styles.locationButton, { bottom: bottomAnim }]}>
        <TouchableOpacity
          onPress={handleCenterMap}
          disabled={locationLoading}
          style={styles.touchableArea}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color="#0A0E5E" />
          ) : (
            <Ionicons name="locate" size={26} color="#0A0E5E" />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Barra de Búsqueda */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8898AA" style={styles.searchIcon} />
          <TextInput
            placeholder="Find storage near you..."
            style={styles.searchInput}
            placeholderTextColor="#8898AA"
          />
          {storesLoading && (
            <ActivityIndicator size="small" color="#0A0E5E" style={{ marginRight: 10 }} />
          )}
        </View>
      </View>

      {/* Card de Detalle - Renderizado Condicional */}
      {selectedStore && (
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              <View style={styles.storeMeta}>
                <Ionicons name="star" size={14} color="#FBB142" />
                <Text style={styles.metaText}> 4.8</Text>
                <Text style={styles.metaSeparator}> • </Text>
                <Ionicons name="walk" size={14} color="#8898AA" />
                <Text style={styles.metaText}> 200m</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceFrom}>FROM</Text>
              <Text style={styles.priceValue}>${selectedStore.pricePerDay?.medium || '5'}</Text>
              <Text style={styles.priceDay}>/day</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>24/7 CCTV</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Insured</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              router.push(ROUTES.CLIENT.STORE_DETAIL(selectedStore.id))
            }}
          >
            <Text style={styles.bookButtonText}>Book Space Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  locationButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 20, // Por encima de la card
    width: 56,
    height: 56,
  },
  touchableArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerActive: { backgroundColor: '#F36B21' },
  markerInactive: { backgroundColor: '#35489C' },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    width: '100%',
    paddingHorizontal: 20,
    zIndex: 30, // Por encima de todo
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#32325D', fontSize: 16 },
  detailCard: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Ajustado para que flote sobre el Tab Bar
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 15, // Por debajo del botón de localización pero sobre el mapa
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  storeName: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  storeMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaText: { color: '#8898AA', fontSize: 14 },
  metaSeparator: { color: '#8898AA', marginHorizontal: 5 },
  priceContainer: {
    alignItems: 'center',
    backgroundColor: '#F6F9FC',
    padding: 8,
    borderRadius: 12,
  },
  priceFrom: { fontSize: 10, color: '#8898AA' },
  priceValue: { fontSize: 20, color: '#0A0E5E', fontWeight: '700' },
  priceDay: { fontSize: 10, color: '#0A0E5E' },
  tagsContainer: { flexDirection: 'row', gap: 8, marginBottom: 15 },
  tag: { backgroundColor: '#F6F9FC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  tagText: { color: '#0A0E5E', fontSize: 12, fontWeight: '500' },
  bookButton: {
    backgroundColor: '#0A0E5E',
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
})
