import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { globalStyles, theme } from '@/styles/globalStyles';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export const GlassCard = ({ children, style, padding = 20 }: Props) => (
  <View style={[styles.card, { padding }, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: theme.borderRadius['2xl'],
    ...theme.shadow.diffusion,
  },
});
