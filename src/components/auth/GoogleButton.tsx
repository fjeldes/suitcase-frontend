import { useGoogleAuth } from '@/hooks/useGoogleAuth'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { styles } from './GoogleButton.styles'

export const GoogleButton = () => {
  const { signIn, isLoading, isAvailable } = useGoogleAuth()

  if (!isAvailable) return null

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.disabled]}
      onPress={() => signIn()}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#0A0E5E" />
      ) : (
        <View style={styles.content}>
          <Ionicons name="logo-google" size={20} color="#0A0E5E" style={styles.icon} />
          <Text style={styles.text}>Continue with Google</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
