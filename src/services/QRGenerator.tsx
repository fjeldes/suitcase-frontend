import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface QRGeneratorProps {
  value: string;
  /** 
   * Factor multiplicador del ancho de pantalla. 
   * Ej: 0.5 ocupará la mitad del ancho. Default: 0.6
   */
  sizeScale?: number; 
}

export const QRGenerator = ({ value, sizeScale = 0.6 }: QRGeneratorProps) => {
  // Calculamos el tamaño final basado en el width de la pantalla
  const finalSize = SCREEN_WIDTH * sizeScale;

  if (!value) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No QR code available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={finalSize}
          color="#0A0E5E"
          backgroundColor="white"
          logo={require('@/assets/images/logo.png')}
          logoSize={finalSize * 0.25}
          logoBackgroundColor="white"
          logoBorderRadius={8}
          quietZone={10}
        />
      </View>
      <Text style={styles.hint}>Present this code to the store owner</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  hint: {
    marginTop: 15,
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
  }
});