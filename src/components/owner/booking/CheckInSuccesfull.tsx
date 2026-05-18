import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CheckInSuccessProps {
  booking: any;
  onBackToBookings: () => void;
}

export const CheckInSuccess = ({ booking, onBackToBookings }: CheckInSuccessProps) => {
  // Datos para la visualización
  const customerName = booking?.customerName || "Marcus Thompson";
  const bookingId = booking?.id || "SC-8821";

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Navbar (Opcional si usas el de Expo Router) */}
      <View style={styles.navbar}>
        <Ionicons name="menu-outline" size={28} color="#0A0E5E" />
        <Text style={styles.brandText}>LuggageVault</Text>
        <View style={styles.avatarMini} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Success Header Section */}
        <View style={styles.successHeader}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={48} color="#22C55E" />
            </View>
          </View>
          <Text style={styles.mainTitle}>Check-in Successful!</Text>
          <Text style={styles.subTitle}>
            The customer is verified and ready for storage.
          </Text>
        </View>

        {/* Customer Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.labelHighlight}>CUSTOMER</Text>
          <Text style={styles.customerName}>{customerName}</Text>
          <Text style={styles.bookingId}>Booking ID: #{bookingId}</Text>
          
          <View style={styles.identityBadge}>
            <MaterialCommunityIcons name="shield-check" size={16} color="#0A0E5E" />
            <Text style={styles.identityText}> Identity Confirmed</Text>
          </View>
        </View>

        {/* Items Card */}
        <View style={styles.infoCard}>
          <Text style={styles.labelHighlight}>ITEMS TO STORE</Text>
          
          <View style={styles.itemRow}>
            <View style={styles.itemIconBox}>
              <MaterialCommunityIcons name="briefcase" size={24} color="#0A0E5E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>Items Verified</Text>
                <Text style={styles.itemSub}>Your luggage has been securely verified.</Text>
              </View>
            </View>
            <View style={styles.itemRow}>
              <MaterialCommunityIcons name="bag-personal" size={24} color="#0A0E5E" />
            </View>
            <View>
              <Text style={styles.itemName}>1 Backpack</Text>
              <Text style={styles.itemType}>Cabin Size</Text>
            </View>
          </View>
        </View>

        {/* Storage Instruction Box (Blue) */}
        <View style={styles.instructionBox}>
          <View style={styles.infoIconCircle}>
            <Ionicons name="information-outline" size={24} color="white" />
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionTitle}>Storage Instruction</Text>
            <Text style={styles.instructionBody}>
              Please ensure labels are attached to the items before storing them in the 
              <Text style={styles.vaultHighlight}> 'Main Vault'</Text> area.
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBackToBookings}>
          <MaterialCommunityIcons name="archive-arrow-down-outline" size={22} color="white" />
          <Text style={styles.backButtonText}> Back to Bookings</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0A0E5E',
  },
  avatarMini: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#333',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  outerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E8FBF2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0A0E5E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 15,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 25,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  labelHighlight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF7A00', // Naranja del diseño
    letterSpacing: 1,
    marginBottom: 12,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A0E5E',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 15,
  },
  identityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0E5E',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemIconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#F1F3F9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  itemType: {
    fontSize: 13,
    color: '#6B7280',
  },
  instructionBox: {
    backgroundColor: '#232D8F', // Azul oscuro vibrante
    borderRadius: 30,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  infoIconCircle: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  instructionBody: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  vaultHighlight: {
    color: '#FF7A00',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  backButton: {
    backgroundColor: '#0A0E5E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});