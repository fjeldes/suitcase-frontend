import { useTheme } from '@/hooks/useTheme';
import React, { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

interface SurfaceCardProps extends ViewProps {
  variant?: 'card' | 'elevated' | 'flat';
  padding?: number;
}

export const SurfaceCard = ({ variant = 'card', padding = 20, style, children, ...props }: SurfaceCardProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors, variant, padding), [colors, variant, padding]);

  return <View style={[styles.card, style]} {...props}>{children}</View>;
};

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], variant: string, padding: number) => StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 24,
    padding,
    ...(variant === 'elevated'
      ? { shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.06, shadowRadius: 40, elevation: 8 }
      : variant === 'flat'
        ? { borderWidth: 1, borderColor: colors.border }
        : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }
    ),
  },
});
