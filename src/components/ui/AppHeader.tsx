import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles, theme } from '@/styles/globalStyles';

interface Props {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

export const AppHeader = ({ title, subtitle, onBack, rightIcon, onRightPress }: Props) => (
  <View style={styles.header}>
    <View style={styles.left}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#1a1c1c" />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.right}>
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={22} color="#1a1c1c" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(249,249,249,0.85)',
    borderBottomWidth: 0,
  },
  left: { width: 44, alignItems: 'flex-start' },
  center: { flex: 1, alignItems: 'center' },
  right: { width: 44, alignItems: 'flex-end' },
  title: { fontSize: 17, fontWeight: '700', color: '#1a1c1c' },
  subtitle: { fontSize: 11, color: '#454652', marginTop: 1 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
