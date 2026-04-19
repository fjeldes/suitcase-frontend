import { useCreateBooking } from '@/hooks/useCreateBooking';
import { useStoreDetail } from '@/hooks/useStoreDetail';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  storeId: string | string[];
}

export default function BookingDetail({ storeId }: Props) {
  const router = useRouter();
  
  // Hooks de datos y mutación
  const { data: store, isLoading, error } = useStoreDetail(storeId);
  const { mutate: createBooking, isPending } = useCreateBooking();

  // Estados de maletas
  const [bags, setBags] = useState({
    small: 1,
    medium: 0,
    large: 2,
  });

  // Fechas (En una fase siguiente aquí deberías usar un DateTimePicker real)
  const [startDate] = useState(new Date()); 
  const [endDate] = useState(new Date(new Date().getTime() + 8 * 60 * 60 * 1000)); // +8 horas por defecto

  const totalPrice = useMemo(() => {
    if (!store) return 0;
    return (
      bags.small * (store.pricePerDay?.small || 4) +
      bags.medium * (store.pricePerDay?.medium || 6) +
      bags.large * (store.pricePerDay?.large || 9)
    );
  }, [bags, store]);

  const updateQuantity = (type: keyof typeof bags, delta: number) => {
    const newValue = bags[type] + delta;
    if (newValue < 0) return;
    
    const limit = store?.capacity?.[type] || 99;
    if (newValue > limit) {
      return Alert.alert("Limit Reached", "No more space available for this item size.");
    }
    setBags({ ...bags, [type]: newValue });
  };

  const handleConfirm = () => {
    // Evitar múltiples clics si ya está cargando o no hay items
    if (isPending || totalPrice === 0) return;

    createBooking({
      locationId: Array.isArray(storeId) ? storeId[0] : storeId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      items: bags,
    });
  };

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#0A0E5E" /></View>;
  if (error) return <View style={styles.center}><Text>Error loading store details</Text></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} bounces={false} contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER CON BOTÓN VOLVER */}
        <View style={styles.header}>
          <Image 
            source={{ uri: store?.image || 'https://via.placeholder.com/600x400' }} 
            style={styles.bannerImage} 
          />
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="#0A0E5E" />
          </TouchableOpacity>

          <View style={styles.headerInfoCard}>
            <Text style={styles.storeName}>{store?.name || 'Grand Central Vault'}</Text>
            <Text style={styles.subInfo}>
              <Ionicons name="navigate" size={14} color="#0A0E5E" /> 120m from Main Entrance • 24/7 Access
            </Text>
          </View>
        </View>

        {/* RATING & REVIEWS */}
        <View style={styles.statsContainer}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}> 4.9 (128 Reviews)</Text>
          </View>
        </View>

        {/* SECCIÓN SEGURIDAD */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#0A0E5E" />
            <Text style={styles.sectionTitle}> Security</Text>
          </View>
          <View style={styles.securityGrid}>
            <Text style={styles.securityItem}>• 24/7 CCTV Monitoring</Text>
            <Text style={styles.securityItem}>• Biometric Lockers</Text>
            <Text style={styles.securityItem}>• Insured up to $3,000</Text>
          </View>
        </View>

        {/* CONFIGURACIÓN DE ALMACENAMIENTO */}
        <View style={styles.whiteSection}>
          <Text style={styles.configMainTitle}>Configure Storage</Text>

          {/* DATE PICKERS (UI placeholders) */}
          <View style={styles.dateTimeRow}>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateLabel}>DROP-OFF</Text>
              <Text style={styles.dateValue}>{startDate.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateInput}>
              <Text style={styles.dateLabel}>PICK-UP</Text>
              <Text style={styles.dateValue}>{endDate.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.luggageLabel}>LUGGAGE ITEMS</Text>

          {/* ITEM SELECTORS */}
          {(['small', 'medium', 'large'] as const).map((type) => (
            <View key={type} style={styles.itemRow}>
              <View>
                <Text style={styles.itemName}>
                  {type === 'small' ? 'Small / Backpack' : type === 'medium' ? 'Medium Suitcase' : 'Large / Overweight'}
                </Text>
                <Text style={styles.itemPrice}>${store?.pricePerDay?.[type] || 0}/day</Text>
              </View>
              <View style={styles.counterContainer}>
                <TouchableOpacity onPress={() => updateQuantity(type, -1)} style={styles.counterBtn}>
                  <Ionicons name="remove-outline" size={20} color={bags[type] > 0 ? "#0A0E5E" : "#CBD5E0"} />
                </TouchableOpacity>
                <Text style={styles.countNumber}>{bags[type]}</Text>
                <TouchableOpacity onPress={() => updateQuantity(type, 1)} style={styles.counterBtn}>
                  <Ionicons name="add-outline" size={20} color="#0A0E5E" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* TOTAL & CONFIRM */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.totalHoursLabel}>Total for 8 hours</Text>
              <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.confirmButton, 
                (totalPrice === 0 || isPending) && styles.disabledBtn
              ]}
              disabled={totalPrice === 0 || isPending}
              onPress={handleConfirm}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.confirmButtonText}>Confirm Booking </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FB' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  header: { height: 280, width: '100%', marginBottom: 10 },
  bannerImage: { width: '100%', height: 220, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  headerInfoCard: { 
    position: 'absolute', bottom: 0, left: 20, right: 20, 
    backgroundColor: 'white', padding: 20, borderRadius: 20,
    elevation: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  storeName: { fontSize: 22, fontWeight: 'bold', color: '#0A0E5E' },
  subInfo: { fontSize: 13, color: '#8898AA', marginTop: 5 },
  statsContainer: { paddingHorizontal: 25, marginTop: 15 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { color: '#0A0E5E', fontWeight: '600', fontSize: 14 },
  sectionCard: { margin: 20, padding: 20, backgroundColor: 'white', borderRadius: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  securityGrid: { gap: 8 },
  securityItem: { color: '#4A5568', fontSize: 14 },
  whiteSection: { 
    backgroundColor: 'white', borderTopLeftRadius: 35, borderTopRightRadius: 35, 
    padding: 25, marginTop: 10, elevation: 20, shadowColor: '#000', shadowOpacity: 0.05,
  },
  configMainTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E', marginBottom: 20 },
  dateTimeRow: { gap: 12, marginBottom: 25 },
  dateInput: { backgroundColor: '#F8F9FB', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EDF2F7' },
  dateLabel: { fontSize: 10, color: '#8898AA', fontWeight: 'bold', marginBottom: 4 },
  dateValue: { fontSize: 13, color: '#0A0E5E', fontWeight: '600' },
  luggageLabel: { fontSize: 12, fontWeight: '800', color: '#8898AA', marginBottom: 15, letterSpacing: 1 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FB', padding: 18, borderRadius: 18, marginBottom: 12 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#0A0E5E' },
  itemPrice: { fontSize: 13, color: '#8898AA', marginTop: 2 },
  counterContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 6, borderWidth: 1, borderColor: '#EDF2F7' },
  counterBtn: { padding: 5 },
  countNumber: { marginHorizontal: 15, fontWeight: '800', fontSize: 16, color: '#0A0E5E' },
  footer: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  totalHoursLabel: { fontSize: 12, color: '#8898AA' },
  totalAmount: { fontSize: 32, fontWeight: 'bold', color: '#0A0E5E' },
  confirmButton: { backgroundColor: '#0A0E5E', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 18, borderRadius: 20, elevation: 5, minWidth: 150, justifyContent: 'center' },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  disabledBtn: { backgroundColor: '#CBD5E0' }
});