import { staffService } from '@/services/staffService';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AcceptStaffScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'accepted' | 'signup' | 'error'>('loading');
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    (async () => {
      try {
        const result = await staffService.acceptInvitation(token, user?.id);

        if (result.accepted) {
          setLocationName(result.locationName);
          setStatus('accepted');
        } else if (result.requiresSignup) {
          setStatus('signup');
          // Store token for signup flow
          setTimeout(() => {
            router.replace({
              pathname: '/(auth)/signup',
              params: { email: result.email, staffToken: token },
            });
          }, 1500);
        }
      } catch {
        setStatus('error');
      }
    })();
  }, [token]);

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0A0E5E" />
        <Text style={styles.loadingText}>Validating invitation...</Text>
      </SafeAreaView>
    );
  }

  if (status === 'accepted') {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
        </View>
        <Text style={styles.title}>You're now staff at {locationName}!</Text>
        <Text style={styles.subtitle}>You can now manage bookings and check-in luggage.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.buttonText}>Continue to Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (status === 'signup') {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons name="mail-outline" size={64} color="#0A0E5E" />
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>You need to create an account to accept this invitation. Redirecting to signup...</Text>
        <ActivityIndicator color="#0A0E5E" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="close-circle-outline" size={64} color="#E53E3E" />
      <Text style={styles.title}>Invalid or expired invitation</Text>
      <Text style={styles.subtitle}>Please ask your store owner to send a new invitation.</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE', padding: 24 },
  loadingText: { marginTop: 16, fontSize: 15, color: '#64748B' },
  iconCircle: { marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0A0E5E', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  button: { backgroundColor: '#0A0E5E', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
