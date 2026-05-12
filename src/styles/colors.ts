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
};
