import { useColorScheme } from 'react-native';
import { Colors, DarkColors } from '@/styles/colors';

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    isDark,
    colors: isDark ? DarkColors : Colors,
  };
}
