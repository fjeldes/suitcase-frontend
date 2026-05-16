import { useLocationStore } from '@/store/useLocationStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';

export default function MapSelector() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const googleInputRef = useRef<any>(null);
  const setLocation = useLocationStore((state) => state.setLocation);
  const [isSearching, setIsSearching] = useState(false);

  const [region, setRegion] = useState({
    latitude: -36.8261, // Ejemplo Concepción, Chile
    longitude: -73.0498,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const [addressInfo, setAddressInfo] = useState({
    main: "Mueve el mapa",
    full: "Buscando dirección..."
  });

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    try {
      setIsSearching(true);
      const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
      const resp = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
      const data = await resp.json(); // <-- CORRECCIÓN DEL LOG

      if (data.status === 'OK' && data.results.length > 0) {
        const res = data.results[0];
        setAddressInfo({
          main: res.address_components[0].long_name + " " + (res.address_components[1]?.long_name || ""),
          full: res.formatted_address
        });
        googleInputRef.current?.setAddressText(res.formatted_address);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirm = () => {
    // Guardamos en el estado global
    setLocation({
      address: addressInfo.full,
      lat: region.latitude.toString(),
      lng: region.longitude.toString(),
    });

    // Volvemos a la pantalla de crear ubicación
    router.push('/(owner)/create-location');
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion);
          fetchAddressFromCoords(newRegion.latitude, newRegion.longitude);
        }}
      />

      {/* PIN FIJO EN EL CENTRO */}
      <View style={styles.markerFixed} pointerEvents="none">
        <View style={styles.markerHalo}>
          <View style={styles.markerDot} />
        </View>
      </View>

      <SafeAreaView style={styles.header}>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.backBox} onPress={() => router.push('/(owner)/create-location')}>
            <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
          </TouchableOpacity>
          <GooglePlacesAutocomplete
            ref={googleInputRef}
            placeholder="Search address in Chile..."
            fetchDetails={true}
            minLength={3} // Empezar a buscar tras 3 letras
            debounce={400} // Retraso para no saturar la API
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              if (details) {
                mapRef.current?.animateToRegion({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                });
              }
            }}
            query={{ 
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, 
              language: 'es',
              components: 'country:cl', // Restringir solo a Chile
            }}
            styles={autocompleteStyles}
          />
        </View>
      </SafeAreaView>

      <View style={styles.footer}>
        <View style={styles.indicator} />
        <Text style={styles.label}>SELECTED LOCATION</Text>
        <Text style={styles.addressMain}>{addressInfo.main}</Text>
        <Text style={styles.addressFull}>{addressInfo.full}</Text>

        <TouchableOpacity style={styles.btn} onPress={handleConfirm} disabled={isSearching}>
          {isSearching ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Confirm Location</Text>}
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  markerFixed: { position: 'absolute', top: '50%', left: '50%', marginLeft: -24, marginTop: -24 },
  markerHalo: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255, 109, 0, 0.2)', justifyContent: 'center', alignItems: 'center' },
  markerDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FF6D00', borderWidth: 2, borderColor: '#fff' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, padding: 20, zIndex: 10 },
  searchRow: { flexDirection: 'row', gap: 10, marginTop: Platform.OS === 'android' ? 30 : 0 },
  backBox: { backgroundColor: '#fff', width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  indicator: { width: 40, height: 4, backgroundColor: '#EEE', alignSelf: 'center', marginBottom: 20 },
  label: { fontSize: 10, fontWeight: 'bold', color: '#999', marginBottom: 5 },
  addressMain: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
  addressFull: { fontSize: 14, color: '#666', marginBottom: 20 },
  btn: { backgroundColor: '#0A0E5E', height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

const autocompleteStyles = {
  container: { flex: 1 },
  textInput: { height: 48, borderRadius: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 }
};