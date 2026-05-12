import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';

const activeBlue = '#000666';
const inactiveGray = '#8E8E93';
const activeBackground = '#eef2ff';

export default function ClientLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeBlue,
        tabBarInactiveTintColor: inactiveGray,
        tabBarStyle: {
          backgroundColor: isDark ? '#1A1A1A' : 'rgba(255,255,255,0.85)',
          borderTopWidth: 0,
          elevation: 20,
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
    width: 60,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
