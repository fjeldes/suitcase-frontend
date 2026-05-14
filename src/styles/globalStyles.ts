import { StyleSheet } from 'react-native';
import { Brand } from './colors';

export const theme = {
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  gradient: {
    primary: [Brand.primaryStart, Brand.primaryEnd] as const,
    secondary: [Brand.secondary, Brand.secondaryDark] as const,
  },
    shadow: {
    diffusion: {
      shadowColor: Brand.primaryStart,
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.06,
      shadowRadius: 40,
      elevation: 8,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 3,
    },
  },
};

export const globalStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Brand.surface },
  container: { flex: 1, backgroundColor: Brand.surface },
  contentPadding: { paddingHorizontal: 20 },

  // Card — design system surface-container-lowest with diffusion shadow
  card: {
    backgroundColor: Brand.surfaceContainer,
    borderRadius: theme.borderRadius['2xl'],
    ...theme.shadow.diffusion,
  },
  cardSm: {
    backgroundColor: Brand.surfaceContainer,
    borderRadius: theme.borderRadius.xl,
    ...theme.shadow.card,
  },

  // Section title — design system headline style
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Manrope',
    color: Brand.onSurface,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: Brand.onSurfaceVariant,
    textTransform: 'uppercase' as const,
  },

  // Divider — design system no-line rule (background shift instead)
  divider: {
    height: 1,
    backgroundColor: Brand.surfaceLow,
  },
});
