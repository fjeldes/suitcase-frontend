import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface Props {
  icon: any;
  label: string;
  subLabel: string;
  priceValue: string;
  capacityValue: string;
  onPriceChange: (val: string) => void;
  onCapacityChange: (val: string) => void;
}

export const StorageCard = ({ 
  icon, 
  label, 
  subLabel, 
  priceValue, 
  capacityValue, 
  onPriceChange, 
  onCapacityChange 
}: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#0A0E5E" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>

      <View style={styles.row}>
        {/* Lado Izquierdo: Precio */}
        <View style={styles.fieldColumn}>
          <Text style={styles.fieldHeader}>PRICE / DAY</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currency}>$</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={priceValue}
              onChangeText={onPriceChange}
              placeholder="0.00"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Separador usando margen en lugar de un View vacío con comentarios */}
        <View style={styles.separator} />

        {/* Lado Derecho: Capacidad */}
        <View style={styles.fieldColumn}>
          <Text style={styles.fieldHeader}>CAPACITY</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={capacityValue}
              onChangeText={onCapacityChange}
              placeholder="0"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 24, 
    alignItems: 'center', 
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: { 
    width: 50, 
    height: 50, 
    borderRadius: 14, 
    backgroundColor: '#F0F2F8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  label: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  subLabel: { fontSize: 13, color: '#64748B', marginBottom: 20 },
  row: { 
    flexDirection: 'row', 
    width: '100%',
    alignItems: 'flex-end'
  },
  fieldColumn: { 
    flex: 1 
  },
  separator: { 
    width: 15 
  },
  fieldHeader: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#94A3B8', 
    textAlign: 'center', 
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    height: 48 
  },
  currency: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#64748B', 
    marginRight: 2 
  },
  input: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '600',
    color: '#0A0E5E', 
    textAlign: 'center',
    padding: 0 // Importante en Android para evitar saltos
  }
});