import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LuggageItemProps {
  size: 'small' | 'medium' | 'large';
  quantity: number;
  pricePerDay: number;
  days?: number;
}

export const LuggageItem = ({ size, quantity, pricePerDay, days }: LuggageItemProps) => {
  if (quantity === 0) return null;

  const labels = {
    small: 'Small Bag',
    medium: 'Medium Bag',
    large: 'Large Suitcase'
  };

  return (
    <View style={styles.itemRow}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons 
          name={size === 'large' ? "bag-checked" : "bag-personal"} 
          size={24} 
          color="#1A1F71" 
        />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemTitle}>{quantity}x {labels[size]}</Text>
        <Text style={styles.itemSub}>Standard Protection Included</Text>
      </View>
      <View>
        <Text style={styles.itemPrice}>${pricePerDay}/day</Text>
        <Text style={styles.itemTotal}>${quantity * pricePerDay * (days || 1)} {days ? `(${days} days)` : '/day'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    // Sombra suave para separar los items
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    backgroundColor: '#F0F2F5',
    padding: 10,
    borderRadius: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1F71',
  },
  itemSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1F71',
    textAlign: 'right',
  },
  itemTotal: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
})
