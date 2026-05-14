import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F5F7FA',
    tint: '#1A237E',
    icon: '#4B5563',
    tabIconDefault: '#4B5563',
    tabIconSelected: '#1A237E',
  },
  dark: {
    text: '#DEE1FC',
    background: '#0E1225',
    tint: '#BDC2FF',
    icon: '#C6C5D4',
    tabIconDefault: '#C6C5D4',
    tabIconSelected: '#BDC2FF',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Manrope',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Manrope',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Manrope', system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
