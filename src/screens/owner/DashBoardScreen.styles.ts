import { StyleSheet } from 'react-native';
import { globalStyles } from '@/styles/globalStyles';

export const styles = StyleSheet.create({
  safeArea: {
    ...globalStyles.safeArea,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
});
