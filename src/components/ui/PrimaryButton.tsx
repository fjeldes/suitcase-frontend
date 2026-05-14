import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const PrimaryButton = ({ loading, variant = 'primary', style, children, disabled, ...props }: PrimaryButtonProps) => {
  const { colors } = useTheme();

  const bg = variant === 'primary' ? colors.primary
    : variant === 'secondary' ? colors.surfaceLight
    : 'transparent';

  const txtColor = variant === 'primary' ? '#FFF'
    : variant === 'secondary' ? colors.textMuted
    : colors.iconColor;

  return (
    <TouchableOpacity
      style={[styles.base, { backgroundColor: bg }, (disabled || loading) && styles.disabled, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? <ActivityIndicator color={txtColor} size="small" /> : children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  disabled: { opacity: 0.6 },
});
