import { LinearGradient } from 'expo-linear-gradient';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { Brand } from '@/styles/colors';
import { theme } from '@/styles/globalStyles';

interface Props {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  icon?: ReactNode;
}

export const GradientButton = ({ title, onPress, loading, disabled, variant = 'primary', style, icon }: Props) => {
  const colors = variant === 'primary' ? Brand.primaryGradient : theme.gradient.secondary;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.85} style={style}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.button, disabled && styles.disabled]}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            {icon}
            <Text style={styles.text}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.xl,
    gap: 8,
  },
  disabled: { opacity: 0.5 },
  text: { color: 'white', fontWeight: '700', fontSize: 16 },
});
