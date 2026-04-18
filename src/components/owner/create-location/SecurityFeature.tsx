import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  label: string;
  // Opcional: pasar una función para avisar al formulario padre del cambio
  onToggle?: (selected: boolean) => void; 
}

export const SecurityFeature = ({ label, onToggle }: Props) => {
  const [selected, setSelected] = useState(false);

  const handlePress = () => {
    const newState = !selected;
    setSelected(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      style={[styles.chip, selected && styles.chipSelected]} 
      onPress={handlePress}
    >
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={14} color="#fff" />}
      </View>
      
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F8', // El gris azulado claro de tus inputs
    padding: 14,
    borderRadius: 14,
    width: '48%', // Para que encajen dos por fila con el gap
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: '#fff',
    borderColor: '#0A0E5E',
    // Sombra sutil cuando está seleccionado
    shadowColor: '#0A0E5E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxSelected: {
    backgroundColor: '#0A0E5E',
    borderColor: '#0A0E5E',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  chipTextSelected: {
    color: '#0A0E5E',
  },
});