import { ROUTES } from '@/constants/routes';
import { BookingData } from '@/types/bookings/BookingData';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- COMPONENTE ---
export const BookingCard = ({ booking }: { booking: BookingData }) => {
    const router = useRouter();
  // 1. Lógica de Negocio y Formateo
  const customer = booking.user.profile;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const inventorySummary = `${booking.items.small}S · ${booking.items.medium}M · ${booking.items.large}L`;
  
  // Formateo de fecha: "19 Abr - 10:48 hrs"
  const pickupTime = `${dayjs(booking.endDate).format('DD MMM')} - ${dayjs(booking.endDate).format('HH:mm')} hrs`;

  // 2. Configuración de Estados (Mapeo de UI)
  const statusConfig = {
    confirmed: { 
      label: 'To Check-in', 
      color: '#E8F8F1', 
      text: '#27AE60', 
      dot: '#2ECC71',
      action: 'Confirm Drop-off'
    },
    in_storage: { 
      label: 'In Storage', 
      color: '#FFF7ED', 
      text: '#C2410C', 
      dot: '#F97316',
      action: 'Confirm Pick-up'
    },
    completed: { 
      label: 'Completed', 
      color: '#F3F4F6', 
      text: '#6B7280', 
      dot: '#9CA3AF',
      action: 'View Details'
    },
    pending: { 
      label: 'Pending', 
      color: '#FEF2F2', 
      text: '#B91C1C', 
      dot: '#EF4444',
      action: 'Review'
    },
    cancelled: { 
      label: 'Cancelled', 
      color: '#F3F4F6', 
      text: '#9CA3AF', 
      dot: '#D1D5DB',
      action: 'Archived'
    }
  };

  const currentStatus = statusConfig[booking.status] || statusConfig.confirmed;

  const handleScanQR = () => {
    router.push({
      pathname: ROUTES.OWNER.SCANNER, // Una nueva ruta para la cámara
      params: { id: booking.id } // Pasamos el ID para validar que el QR escaneado sea el correcto
    });
  };

  return (
    <View style={[styles.card, { borderLeftColor: booking.status === 'confirmed' ? '#FF6B00' : '#D1D5DB' }]}>
      
      {/* HEADER: Avatar, Nombre y Status */}
      <View style={styles.cardHeader}>
        <Image 
          source={{ 
            uri: customer.avatarUrl || `https://ui-avatars.com/api/?name=${fullName}&background=0A0E5E&color=fff` 
          }} 
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.customerName} numberOfLines={1}>{fullName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: currentStatus.color }]}>
            <View style={[styles.dot, { backgroundColor: currentStatus.dot }]} />
            <Text style={[styles.statusText, { color: currentStatus.text }]}>
              {currentStatus.label}
            </Text>
          </View>
        </View>
      </View>

      {/* INFO ROW: ID, Inventory, Pickup */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>BOOKING ID</Text>
          <Text style={styles.infoValue}>#{booking.id.split('-')[0].toUpperCase()}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>INVENTORY</Text>
          <View style={styles.valueWithIcon}>
            <MaterialCommunityIcons name="briefcase-outline" size={14} color="#4B5563" />
            <Text style={styles.infoValue}> {inventorySummary}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>PICKUP</Text>
          <Text style={styles.infoValue}>{pickupTime}</Text>
        </View>
      </View>

      {/* BUTTONS: Acciones */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.viewQrBtn} activeOpacity={0.7} onPress={handleScanQR}>
          <Ionicons name="qr-code-outline" size={18} color="#0A0E5E" />
          <Text style={styles.viewQrText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    // Sombras
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  valueWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  viewQrBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  viewQrText: {
    color: '#0A0E5E',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtn: {
    flex: 1.2, // Un poco más ancho que el de QR
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});