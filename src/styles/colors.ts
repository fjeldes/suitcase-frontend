export const Brand = {
  // Primary gradient
  primaryStart: '#000666',
  primaryEnd: '#1a237e',
  primaryGradient: ['#000666', '#1a237e'] as const,

  // Secondary/CTA  
  secondary: '#fd6c00',
  secondaryDark: '#9f4200',
  secondaryBg: '#ffdbcb',

  // Surfaces
  surface: '#f9f9f9',
  surfaceContainer: '#ffffff',
  surfaceLow: '#f3f3f3',
  surfaceHigh: '#e8e8e8',

  // Text
  onSurface: '#1a1c1c',
  onSurfaceVariant: '#454652',

  // States
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#dc2626',
  info: '#6366f1',

  // Shadows
  shadowColor: 'rgba(26, 35, 126, 0.06)',
};

export const Colors = {
  primary: Brand.primaryStart,
  background: Brand.surface,
  white: Brand.surfaceContainer,
  textPrimary: Brand.onSurface,
  textSecondary: Brand.onSurfaceVariant,
  border: '#e2e8f0',
  lightGray: Brand.surfaceLow,
  success: Brand.success,
  successLight: '#dcfce7',
  error: Brand.error,
  errorLight: '#fee2e2',
  warning: Brand.secondary,
  info: Brand.info,
  orangeDark: Brand.secondaryDark,
  primaryGradient: Brand.primaryGradient,
  surfaceCard: '#ffffff',
  surfaceCardLow: '#F8F9FE',
  surfaceLight: '#F1F5F9',
  surfaceSection: '#ffffff',
  surfaceModal: '#ffffff',
  textInverse: '#ffffff',
  textLabel: '#334155',
  textMuted: '#64748B',
  iconColor: '#0A0E5E',
  iconMuted: '#94A3B8',
  tabBarBg: 'rgba(255,255,255,0.85)',
  tabBarActiveBg: '#EEF2FF',
  headerBg: '#FFFFFF',
  badgeOrange: '#F97316',
  dotRed: '#E53E3E',
  overlay: 'rgba(0,0,0,0.5)',
};

export type ColorsType = typeof Colors;

export const DarkColors: ColorsType = {
  primary: '#818CF8',
  background: '#0F0F23',
  white: '#1A1A2E',
  textPrimary: '#ECEDEE',
  textSecondary: '#9BA1A6',
  border: '#2D2D44',
  lightGray: '#1E1E36',
  success: '#22c55e',
  successLight: '#1a3a2a',
  error: '#ef4444',
  errorLight: '#3a1a1a',
  warning: Brand.secondary,
  info: '#818CF8',
  orangeDark: Brand.secondaryDark,
  primaryGradient: ['#818CF8', '#6366F1'] as const,
  surfaceCard: '#1A1A2E',
  surfaceCardLow: '#12122A',
  surfaceLight: '#1E1E36',
  surfaceSection: '#16162E',
  surfaceModal: '#1A1A2E',
  textInverse: '#0F0F23',
  textLabel: '#C7C7D8',
  textMuted: '#9BA1A6',
  iconColor: '#818CF8',
  iconMuted: '#6B7280',
  tabBarBg: 'rgba(15,15,35,0.92)',
  tabBarActiveBg: 'rgba(129,140,248,0.15)',
  headerBg: '#16162E',
  badgeOrange: '#F97316',
  dotRed: '#EF4444',
  overlay: 'rgba(0,0,0,0.7)',
};
