import { useUserLocation } from '@/hooks/useUserLocation';
import { api } from '@/services/api';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';

export default function CreateLocation() {
  const { location: userLocation } = useUserLocation();
  const [marker, setMarker] = useState<any>(null);
  const [name, setName] = useState('Nueva Ubicación');

  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // Solo dos estados: 0 (25%) y 1 (90%)
  const snapPoints = useMemo(() => ['25%', '90%'], []);

  const region = useMemo(() => {
    if (!userLocation) return undefined;
    return {
      latitude: userLocation.lat,
      longitude: userLocation.lng,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    };
  }, [userLocation]);

  const create = async () => {
    if (!marker) return Alert.alert('Error', 'Selecciona un punto en el mapa');
    try {
      await api.post('/locations', {
        name,
        lat: marker.latitude,
        lng: marker.longitude,
        capacity: { small: 5, medium: 5, large: 5 },
        pricePerDay: { small: 5, medium: 7, large: 10 },
      });
      Alert.alert('Éxito', 'Location creada correctamente');
    } catch (err: any) {
      Alert.alert('Error', 'No se pudo crear la ubicación.');
    }
  };

  if (!region) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        onPress={(e) => {
          setMarker(e.nativeEvent.coordinate);
          Keyboard.dismiss(); 
          bottomSheetRef.current?.snapToIndex(1); // Baja al 25%
        }}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        // 'interactive' permite que el teclado y la hoja se muevan juntos
        keyboardBehavior="interactive" 
        handleIndicatorStyle={{ backgroundColor: '#ccc' }}
        onChange={(index) => {
          // Si el usuario baja la hoja manualmente al 25% (index 0), cerramos teclado
          if (index < 2) {
            Keyboard.dismiss();
          }
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <GooglePlacesAutocomplete
            placeholder="¿Dónde está el lugar?"
            fetchDetails={true}
            onPress={(data, details = null) => {
              if (details) {
                const lat = details.geometry.location.lat;
                const lng = details.geometry.location.lng;
                setMarker({ latitude: lat, longitude: lng });
                
                // Primero cerramos teclado y luego bajamos la hoja
                Keyboard.dismiss();
                bottomSheetRef.current?.snapToIndex(1);
              }
            }}
            query={{
              key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
              language: 'es',
            }}
            textInputProps={{
              // Al tocar el input, forzamos subir al punto 1 (90%)
              onFocus: () => bottomSheetRef.current?.snapToIndex(2),
              clearButtonMode: 'always',
            }}
            styles={{
              container: { flex: 0, width: '100%', zIndex: 1000 },
              textInput: {
                backgroundColor: '#f0f0f0',
                height: 48,
                borderRadius: 10,
                fontSize: 16,
                paddingHorizontal: 15,
                color: '#000',
              },
              listView: {
                backgroundColor: 'white',
                borderRadius: 10,
                zIndex: 2000,
                maxHeight: 300,
              },
            }}
          />

          <View style={styles.buttonContainer}>
            <Button title="Confirmar Ubicación" onPress={create} color="#000" />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  contentContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  buttonContainer: { marginTop: 20, marginBottom: 30 },
});