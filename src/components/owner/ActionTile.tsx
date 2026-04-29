import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ActionTile = ({ title, icon }: any) => (
  <TouchableOpacity style={styles.tile}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={22} color="#0A0E5E" />
    </View>
    <Text style={styles.tileText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tile: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingVertical: 20, 
    borderRadius: 20, 
    alignItems: 'center',
    // Sombras sutiles
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2 
  },
  iconCircle: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  tileText: { fontSize: 10, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
});