import { useAuthStore } from '@/store/useAuthStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// Definición de las opciones del menú para facilitar el renderizado
const PROFILE_OPTIONS = [
  {
    id: 'personal',
    title: 'Personal Info',
    description: 'Update your name, contact details, and secure credentials.',
    icon: 'person',
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description: 'Manage saved cards and billing.',
    icon: 'card',
    badge: '2 Saved',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Control email and push alerts.',
    icon: 'notifications',
  },
  {
    id: 'help',
    title: 'Help Center',
    description: 'FAQs, support tickets, and contact info.',
    icon: 'help-circle',
  },
]

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SECCIÓN DE ENCABEZADO / AVATAR */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300?u=sarah' }} // Avatar placeholder
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user?.name || 'Cargando...'}</Text>

          <TouchableOpacity style={styles.switchButton}>
            <Ionicons name="business-outline" size={20} color="white" />
            <Text style={styles.switchButtonText}> Switch to Owner Mode</Text>
          </TouchableOpacity>
        </View>

        {/* LISTA DE OPCIONES */}
        <View style={styles.optionsContainer}>
          {PROFILE_OPTIONS.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionCard}>
              <View style={styles.optionHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name={option.icon as any} size={22} color="#0A0E5E" />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                {option.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{option.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOTÓN CERRAR SESIÓN */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
          <Text style={styles.logoutText}> Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },

  // Card de Perfil (Avatar y Nombre)
  profileCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginBottom: 25,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#F1F3F9',
    padding: 5,
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  userName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0A0E5E',
    marginBottom: 20,
  },
  switchButton: {
    backgroundColor: '#0A0E5E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
  },
  switchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Contenedor de Opciones
  optionsContainer: {
    width: '100%',
    gap: 15,
  },
  optionCard: {
    backgroundColor: '#F1F3F9', // Gris muy suave según la imagen
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(10, 14, 94, 0.05)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0E5E',
    flex: 1,
  },
  badge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8898AA',
  },
  optionDescription: {
    fontSize: 13,
    color: '#4A5568',
    lineHeight: 18,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    padding: 10,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
})
