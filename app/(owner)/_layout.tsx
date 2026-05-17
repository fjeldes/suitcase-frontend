import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function OwnerLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.iconColor,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#1a237e',
          shadowOpacity: 0.06,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: -5 },
          height: Platform.OS === 'ios' ? 94 : 74,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        },
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.dashboard'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.tabBarActiveBg }]}>
              <Ionicons name="grid" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabs.bookings'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.tabBarActiveBg }]}>
              <Ionicons name="briefcase" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: colors.tabBarActiveBg }]}>
              <Ionicons name="person" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen name="staff" options={{ href: null }} />
      <Tabs.Screen name="create-location" options={{ href: null }} />
      <Tabs.Screen name="create" options={{ href: null }} />
      <Tabs.Screen name="edit-store" options={{ href: null }} />
      <Tabs.Screen name="map-selector" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="stores" options={{ href: null }} />
      <Tabs.Screen name="stats" options={{ href: null }} />
      <Tabs.Screen name="activity-logs" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: { width: 60, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
