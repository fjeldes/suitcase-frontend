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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import MapView, { Marker, Region } from 'react-native-maps'

import { ROUTES } from '@/constants/routes'
import { useNearbyStores } from '@/hooks/useNearbyStores'
import { useUserLocation } from '@/hooks/useUserLocation'
import { useLocationStore } from '@/store/useLocationStore'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'

export default function ExploreScreen() {
  const { t } = useTranslation()
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
  const [mapBounds, setMapBounds] = useState<any>(null)

  const { data: stores, isLoading: storesLoading } = useNearbyStores({
    bounds: mapBounds
  })

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

  const handleSelectSuggestion = (store: any) => {
    setSelectedStore(store)
    mapRef.current?.animateToRegion({
      latitude: parseFloat(store.lat),
      longitude: parseFloat(store.lng),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000)
  }

  const handleSelectPlace = (data: any, details: any) => {
    if (details) {
      const { lat, lng } = details.geometry.location;
      const address = data.description;
      
      // 1. Actualizar el store de ubicación
      setLocation({
        address,
        lat: lat.toString(),
        lng: lng.toString(),
      });

      // 2. Mover el mapa a la nueva ubicación
      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }

  const handleRegionChange = (region: Region) => {
    // 1. Actualizar ubicación central en el store
    setLocation({
      address: 'Map Area',
      lat: region.latitude.toString(),
      lng: region.longitude.toString(),
    })

    // 2. Calcular Bounding Box para el filtro eficiente
    const latDelta = region.latitudeDelta
    const lngDelta = region.longitudeDelta

    setMapBounds({
      minLat: region.latitude - latDelta / 2,
      maxLat: region.latitude + latDelta / 2,
      minLng: region.longitude - lngDelta / 2,
      maxLng: region.longitude + lngDelta / 2,
    })

    // 3. Opcional: Cerrar detalle si el usuario se aleja mucho (opcional UX)
    // setSelectedStore(null)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
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

      {/* Barra de Búsqueda de Google Places */}
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder={t('search_places')}
          fetchDetails={true}
          minLength={3}
          debounce={400}
          onPress={(data, details = null) => handleSelectPlace(data, details)}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
            language: 'es',
            components: 'country:cl', // Restringe a Chile para mayor precisión
          }}
          renderLeftButton={() => (
            <Ionicons name="search" size={20} color="#8898AA" style={styles.searchIconInside} />
          )}
          styles={{
            container: { flex: 0 },
            textInputContainer: {
              backgroundColor: '#FFFFFF',
              borderRadius: 30,
              paddingHorizontal: 10,
              height: 50,
              alignItems: 'center',
              elevation: 4,
              shadowColor: '#000',
              shadowOpacity: 0.1,
            },
            textInput: {
              height: 40,
              color: '#32325D',
              fontSize: 16,
              marginTop: 0,
              marginBottom: 0,
              paddingLeft: 0,
            },
            listView: {
              backgroundColor: 'white',
              borderRadius: 20,
              marginTop: 10,
              elevation: 10,
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 10,
            },
            row: {
              paddingVertical: 13,
            },
            description: {
              color: '#4B5563',
            },
          }}
        />
      </View>

      {/* Card de Detalle - Renderizado Condicional */}
      {selectedStore && (
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              <View style={styles.storeMeta}>
                {selectedStore.averageRating ? (
                  <>
                    <Ionicons name="star" size={14} color="#FBB142" />
                    <Text style={styles.metaText}> {selectedStore.averageRating}</Text>
                    <Text style={styles.metaSeparator}> • </Text>
                  </>
                ) : null}
                <Ionicons name="walk" size={14} color="#8898AA" />
                <Text style={styles.metaText}> {(selectedStore.distance * 1000).toFixed(0)}m</Text>
                <Text style={styles.metaSeparator}> • </Text>
                <Ionicons name="pricetag-outline" size={14} color="#8898AA" />
                <Text style={styles.metaText}>${selectedStore.pricePerDay?.small || 0}-${selectedStore.pricePerDay?.large || 0}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceFrom}>FROM</Text>
              <Text style={styles.priceValue}>${selectedStore.pricePerDay?.small || 0}</Text>
              <Text style={styles.priceDay}>/day</Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {selectedStore.availability?.small > 0 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Small</Text>
              </View>
            )}
            {selectedStore.availability?.medium > 0 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Medium</Text>
              </View>
            )}
            {selectedStore.availability?.large > 0 && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>Large</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => {
              router.push(ROUTES.CLIENT.STORE_DETAIL(selectedStore.id))
            }}
          >
            <Text style={styles.bookButtonText}>{t('explore.book_space')}</Text>
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
  searchIconInside: { marginLeft: 5, marginRight: 5 },
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
  
  // Estilos de Sugerencias
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginTop: 10,
    paddingVertical: 10,
    maxHeight: 250,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0A0E5E',
  },
  suggestionSubtitle: {
    fontSize: 12,
    color: '#8898AA',
    marginTop: 2,
  },
})
