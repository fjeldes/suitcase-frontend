import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoBadgeProps {
  label: string;
  value: string;
}

export const InfoBadge = ({ label, value }: InfoBadgeProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={styles.value} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Esto permite que si hay dos en una fila, ocupen el mismo espacio
    backgroundColor: '#F9FAFB', // Gris muy claro igual al de la imagen
    borderRadius: 16,
    padding: 15,
    minHeight: 80,
    justifyContent: 'center',
  },
  label: {
    color: '#9BA3AF', // Gris de los labels
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    color: '#0A0E5E', // Azul marino de tu marca
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
});