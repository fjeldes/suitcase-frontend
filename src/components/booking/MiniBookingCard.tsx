import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MiniBookingCard = ({ booking }: { booking: any }) => {
  const dateStr = new Date(booking.startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const totalItems = (booking.items?.small || 0) + (booking.items?.medium || 0) + (booking.items?.large || 0);

  return (
    <View style={styles.miniCard}>
      <View style={styles.miniHeader}>
        <View style={[
          styles.badgeUpcoming, 
          booking.status === 'completed' && { backgroundColor: '#EDFDFD' }
        ]}>
          <Text style={[
            styles.badgeTextUpcoming, 
            booking.status === 'completed' && { color: '#319795' }
          ]}>
            {booking.status.toUpperCase()}
          </Text>
        </View>
        <Ionicons name="archive" size={18} color="#0A0E5E" />
      </View>
      <Text style={styles.miniStoreName}>{booking.location?.name}</Text>
      <Text style={styles.miniDate}>{dateStr}</Text>
      
      <View style={styles.miniFooter}>
        <Text style={styles.itemTotal}>{totalItems} Items Total</Text>
        <TouchableOpacity style={styles.modifyButton}>
          <Text style={styles.modifyText}>Details </Text>
          <Ionicons name="chevron-forward" size={14} color="#A0522D" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  miniCard: { backgroundColor: 'white', borderRadius: 20, padding: 20, elevation: 2, marginBottom: 15 },
  miniHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badgeUpcoming: { backgroundColor: '#E0E7FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeTextUpcoming: { color: '#5469D4', fontSize: 10, fontWeight: '800' },
  miniStoreName: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  miniDate: { color: '#8898AA', marginTop: 4, fontSize: 13 },
  miniFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F3F9' },
  itemTotal: { color: '#0A0E5E', fontWeight: '500', fontSize: 13 },
  modifyButton: { flexDirection: 'row', alignItems: 'center' },
  modifyText: { color: '#A0522D', fontWeight: '700', fontSize: 13 },
});