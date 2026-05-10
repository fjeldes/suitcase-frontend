import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de que esta importación sea correcta
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function ClientLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeBlue = '#2E3192';
  const inactiveGray = '#8E8E93';
  const activeBackground = isDark ? '#2A2D5E' : '#F0F2FF';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeBlue,
        tabBarInactiveTintColor: inactiveGray,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
          height: Platform.OS === 'ios' ? 94 : 74,
          paddingBottom: Platform.OS === 'ios' ? 30 : 12,
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: activeBackground }]}>
              <Ionicons name="compass" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="bookings"
        options={{
          title: 'BOOKINGS',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: activeBackground }]}>
              <Ionicons name="briefcase" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && { backgroundColor: activeBackground }]}>
              <Ionicons name="person" size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* Rutas ocultas */}
      <Tabs.Screen name="store/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="booking-ticket" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="become-owner" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="payment-methods" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="settings" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="help" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 60,  // Ancho fijo para la "cápsula"
    height: 32, // Alto fijo
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});