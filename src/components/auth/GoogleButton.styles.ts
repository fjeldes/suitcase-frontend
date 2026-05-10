import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';
import { globalStyles } from '@/styles/globalStyles';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...globalStyles.cardShadow,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});
