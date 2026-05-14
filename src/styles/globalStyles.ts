import { StyleSheet } from 'react-native';
import { Brand } from './colors';

export const theme = {
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 12,
    md: 24,
    lg: 48,
    xl: 80,
    gutter: 16,
    marginMobile: 20,
  },
  gradient: {
    primary: [Brand.primaryStart, Brand.primaryEnd] as const,
    secondary: [Brand.secondary, Brand.secondaryDark] as const,
  },
  shadow: {
    button: {
      shadowColor: Brand.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
  },
};

export const globalStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.surface },
  container: { flex: 1, backgroundColor: Brand.surface },
  contentPadding: { paddingHorizontal: theme.spacing.marginMobile },

  card: {
    backgroundColor: Brand.surfaceContainer,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardSm: {
    backgroundColor: Brand.surfaceContainer,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Manrope',
    color: Brand.onSurface,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Brand.onSurfaceVariant,
    textTransform: 'uppercase' as const,
  },

  divider: {
    height: 1,
    backgroundColor: Brand.surfaceLow,
  },
});
