import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F9FAFB',
    tint: '#1A237E',
    icon: '#4B5563',
    tabIconDefault: '#4B5563',
    tabIconSelected: '#1A237E',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0F172A',
    tint: '#3F51B5',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#3F51B5',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
