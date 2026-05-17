import { useUserLocation } from '@/hooks/useUserLocation';
import { api } from '@/services/api';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  Keyboard,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { uploadService } from '@/services/uploadService';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';

export default function CreateLocation() {
  const { t } = useTranslation();
  const { location: userLocation } = useUserLocation();
  const [marker, setMarker] = useState<any>(null);
  const [name, setName] = useState(t('createLocation.confirm_location_title'));
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [workingHours, setWorkingHours] = useState([
    { day: 1, label: 'Mon', open: '09:00', close: '18:00', isClosed: false },
    { day: 2, label: 'Tue', open: '09:00', close: '18:00', isClosed: false },
    { day: 3, label: 'Wed', open: '09:00', close: '18:00', isClosed: false },
    { day: 4, label: 'Thu', open: '09:00', close: '18:00', isClosed: false },
    { day: 5, label: 'Fri', open: '09:00', close: '18:00', isClosed: false },
    { day: 6, label: 'Sat', open: '10:00', close: '14:00', isClosed: true },
    { day: 0, label: 'Sun', open: '00:00', close: '00:00', isClosed: true },
  ]);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Toast.show({ type: 'error', text1: t('common.error'), text2: t('profile.permission_denied') });

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const create = async () => {
    if (!marker) return Toast.show({ type: 'error', text1: t('common.error'), text2: t('createLocation.toast_select_point') });
    try {
      setUploading(true);
      
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadService.uploadImage(selectedImage, 'locations');
      }

      await api.post('/locations', {
        name,
        address: 'Dirección seleccionada', // En una app real, usarías el address de Google
        lat: marker.latitude,
        lng: marker.longitude,
        imageUrl,
        workingHours,
        capacity: { small: 5, medium: 5, large: 5 },
        pricePerDay: { small: 5, medium: 7, large: 10 },
      });
      Toast.show({ type: 'success', text1: t('createLocation.success_label'), text2: t('createLocation.toast_created') });
      setSelectedImage(null);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: t('createLocation.toast_create_error') });
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
            placeholder={t('createLocation.search_placeholder_old')}
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

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>{t('createLocation.business_hours')}</Text>
            <TouchableOpacity 
              style={styles.applyAllButton}
              onPress={() => {
                const monday = workingHours[0];
                setWorkingHours(workingHours.map(d => ({ ...d, open: monday.open, close: monday.close, isClosed: false })));
              }}
            >
              <Text style={styles.applyAllText}>{t('createLocation.apply_all')}</Text>
            </TouchableOpacity>

            {workingHours.map((item, index) => (
              <View key={item.day} style={styles.hourRow}>
                <Text style={styles.dayLabel}>{item.label}</Text>
                <TouchableOpacity 
                  style={[styles.statusBadge, item.isClosed && styles.statusBadgeClosed]}
                  onPress={() => {
                    const newHours = [...workingHours];
                    newHours[index].isClosed = !newHours[index].isClosed;
                    setWorkingHours(newHours);
                  }}
                >
                  <Text style={styles.statusText}>{item.isClosed ? t('booking.closed') : t('booking.open_now')}</Text>
                </TouchableOpacity>
                
                {!item.isClosed && (
                  <View style={styles.timeInputs}>
                    <TextInput 
                      value={item.open} 
                      style={styles.timeInput} 
                      onChangeText={(val) => {
                        const newHours = [...workingHours];
                        newHours[index].open = val;
                        setWorkingHours(newHours);
                      }}
                    />
                    <Text>-</Text>
                    <TextInput 
                      value={item.close} 
                      style={styles.timeInput} 
                      onChangeText={(val) => {
                        const newHours = [...workingHours];
                        newHours[index].close = val;
                        setWorkingHours(newHours);
                      }}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={pickImage}
            disabled={uploading}
          >
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color="#8898AA" />
                <Text style={styles.imageText}>{t('createLocation.add_photo_placeholder')}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.mainButton, uploading && { opacity: 0.7 }]} 
              onPress={create}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{t('createLocation.confirm_location_title')}</Text>
              )}
            </TouchableOpacity>
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
  imagePicker: {
    width: '100%',
    height: 180,
    backgroundColor: '#F7FAFC',
    borderRadius: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  previewImage: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center' },
  imageText: { color: '#8898AA', marginTop: 8, fontSize: 14 },
  mainButton: {
    backgroundColor: '#0A0E5E',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Hours Styles
  formSection: { marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0A0E5E', marginBottom: 15 },
  hourRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0'
  },
  dayLabel: { width: 50, fontWeight: '600', color: '#4A5568' },
  statusBadge: { 
    backgroundColor: '#C6F6D5', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 8,
    marginRight: 15
  },
  statusBadgeClosed: { backgroundColor: '#FED7D7' },
  statusText: { fontSize: 12, fontWeight: '700', color: '#2F855A' },
  timeInputs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { 
    backgroundColor: '#EDF2F7', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6,
    width: 60,
    textAlign: 'center',
    fontSize: 14
  },
  applyAllButton: { marginBottom: 15 },
  applyAllText: { color: '#6366F1', fontWeight: '700', fontSize: 13 },
});