import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export const GlobalSummaryButton = () => (
    <TouchableOpacity style={styles.globalBtn}>
      <Text style={styles.globalBtnText}>View Global Summary</Text>
      <Ionicons name="arrow-forward" size={20} color="#0A0E5E" />
    </TouchableOpacity>
  );
  
  const styles = StyleSheet.create({
    globalBtn: {
      backgroundColor: '#E2E8F0', // Color gris suave del diseño
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      borderRadius: 25,
      marginTop: 30,
      gap: 10
    },
    globalBtnText: { color: '#0A0E5E', fontSize: 18, fontWeight: '600' }
  });