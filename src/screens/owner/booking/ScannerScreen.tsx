import { ROUTES } from '@/constants/routes'
import { useValidateBooking } from '@/hooks/useValidateBooking'
import { useBookingStore } from '@/store/useBookingStore'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function ScannerScreen() {
  const router = useRouter()

  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const setCurrentBooking = useBookingStore((state) => state.setCurrentBooking)
  
  const { mutate: validateBooking, isPending } = useValidateBooking();

  // 1. Manejo de estados de carga
  if (!permission) {
    return <View style={styles.container} /> // Todavía cargando
  }

  // 2. Pantalla de solicitud de permiso (con SafeArea para que no salga arriba)
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>Camera access is required to scan QR codes</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission} accessibilityLabel="Grant camera permission" accessibilityRole="button">
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned || isPending) return

    setScanned(true)

    // Ejecutamos la validación
    validateBooking(data, {
      onSuccess: (bookingData) => {
        // --- AQUÍ GUARDAS EN ZUSTAND ---
        setCurrentBooking(bookingData)
        // Si el backend dice que es OK, vamos a la pantalla de confirmación
        // Pasamos los datos necesarios por params o los guardamos en un store
        router.push({
          pathname: ROUTES.OWNER.CONFIRM_CHECK_IN,
          params: {
            bookingId: data,
            userName: bookingData.user.name,
            bags: JSON.stringify(bookingData.items),
          },
        })
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'QR Code invalid or expired'
        Alert.alert('Invalid QR', message, [
          { text: 'Try Again', onPress: () => setScanned(false) },
        ])
      },
    })
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* DISEÑO DEL ESCÁNER */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />

          <View style={styles.middleRow}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedContainer}>
              {/* Esquinas decorativas (opcional) */}
              <View style={styles.scanLine} />
            </View>
            <View style={styles.unfocusedContainer} />
          </View>

          <View style={styles.unfocusedContainer}>
            <Text style={styles.hintText}>Position the QR code inside the frame</Text>
          </View>
        </View>

        {/* BOTÓN MOCK PARA EMULADOR */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.mockButton}
            onPress={() => handleBarCodeScanned({ data: 'RESERVA-TEST-123' })}
            accessibilityLabel="Simulate QR scan (development only)"
            accessibilityRole="button"
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Simulate QR Scan</Text>
          </TouchableOpacity>
        )}
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Fondo negro preventivo
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
  },
  camera: {
    flex: 1,
  },
  permissionBox: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 20,
    elevation: 5,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#0A0E5E',
  },
  permissionButton: {
    backgroundColor: '#0A0E5E',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  unfocusedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRow: {
    flexDirection: 'row',
    height: 280,
  },
  focusedContainer: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: '#FF6D00',
    borderRadius: 30,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#FF6D00',
    position: 'absolute',
    top: '50%',
    opacity: 0.5,
  },
  hintText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  mockButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#FF6D00',
    padding: 18,
    borderRadius: 15,
    elevation: 5,
  },
})
