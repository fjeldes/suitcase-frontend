import { ItemsCount } from '@/types/bookings/BookingData';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ItemSummaryProps {
  items: ItemsCount;
}

export const ItemSummary = ({ items }: ItemSummaryProps) => {
  // Mapeo para facilitar el renderizado
  const itemTypes = [
    { key: 'large', label: 'Large Suitcases', icon: 'briefcase' },
    { key: 'medium', label: 'Medium Suitcases', icon: 'briefcase' },
    { key: 'small', label: 'Backpacks / Small items', icon: 'bag-handle' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ITEMS SUMMARY</Text>
      
      {itemTypes.map((type) => {
        const quantity = items[type.key as keyof ItemsCount];
        
        // Solo mostramos si hay al menos 1 item de este tipo
        if (quantity <= 0) return null;

        return (
          <View key={type.key} style={styles.itemRow}>
            <View style={styles.iconContainer}>
              <Ionicons name={type.icon as any} size={18} color="#A34F00" />
            </View>
            <Text style={styles.itemText}>
              <Text style={styles.quantity}>{quantity} </Text>
              {type.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    width: '100%',
  },
  title: {
    color: '#9BA3AF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    paddingLeft: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Gris suave de fondo
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    gap: 12,
  },
  iconContainer: {
    backgroundColor: '#FFF2E5', // Fondo naranja muy claro para el icono
    padding: 8,
    borderRadius: 10,
  },
  itemText: {
    color: '#0A0E5E',
    fontSize: 15,
    fontWeight: '500',
  },
  quantity: {
    fontWeight: '800',
  },
});