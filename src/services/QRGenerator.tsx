import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

const { width } = Dimensions.get('window')

interface QRGeneratorProps {
  value: string // El código único de la reserva (ej: booking.qrCode)
  size?: number
}

export const QRGenerator = ({ value, size = width * 0.6 }: QRGeneratorProps) => {
  if (!value) {
    return (
      <View style={styles.errorContainer}>
        <Text>No QR code available</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={size}
          color="#0A0E5E"
          backgroundColor="white"
          logo={require('@/assets/images/logo-icon.png')}
          logoSize={size * 0.2}
          logoBackgroundColor="white"
          logoBorderRadius={10}
          quietZone={10}
        />
      </View>
      <Text style={styles.hint}>Present this code to the store owner</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrWrapper: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 20,
    // Sombra para que el QR "resalte"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  hint: {
    marginTop: 20,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
