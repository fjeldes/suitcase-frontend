import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const globalStyles = StyleSheet.create({
  // Layouts
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },

  // Tipografía Común
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },

  // Componentes Globales
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
  },
});
