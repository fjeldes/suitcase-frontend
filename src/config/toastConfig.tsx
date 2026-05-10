import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  successCustom: ({ text1, text2 }) => (
    <View style={styles.toastContainer}>
      <View style={styles.whiteCircle}>
        <Ionicons name="checkmark-circle" size={28} color="#FF6B00" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        <Text style={styles.text2}>{text2}</Text>
      </View>
      <Ionicons name="close" size={20} color="rgba(255,255,255,0.5)" />
    </View>
  ),
  // Puedes agregar 'errorCustom' aquí también si quieres el mismo estilo en rojo
};

const styles = StyleSheet.create({
  toastContainer: {
    height: 85,
    width: '92%',
    backgroundColor: '#2D3085',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 4,
    borderBottomColor: '#FF6B00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  whiteCircle: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 2,
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  text1: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text2: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
});