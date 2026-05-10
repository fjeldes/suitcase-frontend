import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
}

/**
 * Componente de Avatar reutilizable.
 * - Si hay `avatarUrl` válida → muestra la imagen
 * - Si no → muestra las iniciales del nombre con fondo degradado
 * - Si tampoco hay nombre → muestra ícono genérico
 */
export function UserAvatar({ name, avatarUrl, size = 90 }: UserAvatarProps) {
  const borderRadius = size / 2;

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isValidUrl = (url?: string | null) => {
    if (!url) return false;
    // Excluir placeholders externos
    if (url.includes('via.placeholder.com') || url.includes('pravatar.cc')) return false;
    return url.startsWith('http') || url.startsWith('https');
  };

  if (isValidUrl(avatarUrl)) {
    return (
      <Image
        source={{ uri: avatarUrl! }}
        style={[styles.image, { width: size, height: size, borderRadius }]}
      />
    );
  }

  const initials = name ? getInitials(name) : null;
  const fontSize = size * 0.35;

  return (
    <View
      style={[
        styles.initialsContainer,
        { width: size, height: size, borderRadius },
      ]}
    >
      {initials ? (
        <Text style={[styles.initialsText, { fontSize }]}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.5} color="#fff" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    backgroundColor: '#1A237E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
