import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  const colorScheme = useColorScheme();

  // Color principal azul oscuro de tu diseño
  const tintColor = colorScheme === 'dark' ? '#5E72E4' : '#0A0E5E'; 

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Ocultamos el header por defecto para el mapa
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: '#8898AA',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      
      {/* 1. La pantalla principal: EXPLORE (Mapa) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 2. Pestaña de Bookings */}
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'BOOKINGS',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* AGREGA ESTO AQUÍ: 
        Al poner href: null, la ruta existe pero el botón desaparece.
        Al poner display: 'none', la barra se oculta cuando entras a la pantalla.
      */}
      <Tabs.Screen
        name="store/[id]" 
        options={{
          href: null, 
          tabBarStyle: { display: 'none' }, 
        }}
      />

      {/* 3. Pestaña de Support */}
      <Tabs.Screen
        name="support"
        options={{
          title: 'SUPPORT',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'help-circle' : 'help-circle-outline'} size={24} color={color} />
          ),
        }}
      />

      {/* 4. Pestaña de Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}