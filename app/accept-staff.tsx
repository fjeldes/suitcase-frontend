import { staffService } from '@/services/staffService';
import { termsService } from '@/services/termsService';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function AcceptStaffScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'terms' | 'accepted' | 'signup' | 'error'>('loading');
  const [locationName, setLocationName] = useState('');
  const [termsContent, setTermsContent] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    (async () => {
      try {
        const terms = await termsService.getLatest('staff');
        setTermsContent(terms.content);
        setStatus('terms');
      } catch {
        setTermsContent('Staff terms and conditions are currently unavailable.');
        setStatus('terms');
      }
    })();
  }, [token]);

  const handleAccept = async () => {
    setStatus('loading');
    try {
      const result = await staffService.acceptInvitation(token, user?.id);
      if (result.accepted) {
        setLocationName(result.locationName);
        setStatus('accepted');
      } else if (result.requiresSignup) {
        setStatus('signup');
        setTimeout(() => router.replace({ pathname: '/(auth)/signup', params: { email: result.email, staffToken: token } }), 1500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'loading') return (
    <SafeAreaView style={styles.center}>
      <ActivityIndicator size="large" color="#0A0E5E" />
      <Text style={styles.loadingText}>Please wait...</Text>
    </SafeAreaView>
  );

  if (status === 'terms') return (
    <SafeAreaView style={styles.center}>
      <View style={styles.termsContainer}>
        <View style={styles.termsIconBox}><Ionicons name="document-text-outline" size={32} color="#0A0E5E" /></View>
        <Text style={styles.title}>Staff Terms & Conditions</Text>
        <Text style={styles.subtitle}>Please review the terms before accepting the invitation.</Text>
        <ScrollView style={styles.termsScroll} showsVerticalScrollIndicator>
          <Text style={styles.termsText}>{termsContent}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
          <Text style={styles.acceptBtnText}>Accept & Join</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineBtn} onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.declineBtnText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  if (status === 'accepted') return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="checkmark-circle" size={64} color="#22C55E" />
      <Text style={styles.title}>You're now staff at {locationName}!</Text>
      <Text style={styles.subtitle}>You can now manage bookings and check-in luggage.</Text>
      <TouchableOpacity style={styles.acceptBtn} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.acceptBtnText}>Continue to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  if (status === 'signup') return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="mail-outline" size={64} color="#0A0E5E" />
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.subtitle}>You need an account to accept this invitation. Redirecting to signup...</Text>
      <ActivityIndicator color="#0A0E5E" style={{ marginTop: 20 }} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.center}>
      <Ionicons name="close-circle-outline" size={64} color="#E53E3E" />
      <Text style={styles.title}>Invalid or expired invitation</Text>
      <Text style={styles.subtitle}>Please ask your store owner to send a new invitation.</Text>
      <TouchableOpacity style={styles.acceptBtn} onPress={() => router.replace('/(auth)/login')}>
        <Text style={styles.acceptBtnText}>Go to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FE', padding: 24 },
  loadingText: { marginTop: 16, fontSize: 15, color: '#64748B' },
  termsContainer: { flex: 1, width: '100%', paddingTop: 40 },
  termsIconBox: { width: 72, height: 72, backgroundColor: '#EEF2FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0A0E5E', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24, paddingHorizontal: 10 },
  termsScroll: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20 },
  termsText: { fontSize: 14, color: '#1A202C', lineHeight: 22 },
  acceptBtn: { backgroundColor: '#0A0E5E', paddingVertical: 16, borderRadius: 14, alignItems: 'center', width: '100%', marginBottom: 10 },
  acceptBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  declineBtn: { padding: 16, borderRadius: 14, alignItems: 'center', width: '100%' },
  declineBtnText: { color: '#64748B', fontSize: 15, fontWeight: '600' },
});
