import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PickupsProps {
  count: number;
  nextTime: string;
  nextPerson: string;
}

export const UpcomingPickupsCard = ({ count, nextTime, nextPerson }: PickupsProps) => (
  <View style={styles.card}>
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#92400E" />
    </View>
    
    <Text style={styles.title}>Upcoming Pickups</Text>
    <Text style={styles.subText}>{count} Scheduled for today</Text>

    <View style={styles.nextPickupBox}>
      <Text style={styles.nextLabel}>NEXT PICKUP</Text>
      <Text style={styles.nextDetail}>{nextTime} ({nextPerson})</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF7ED', // Color crema/naranja muy suave
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0A0E5E' },
  subText: { fontSize: 16, color: '#64748B', marginTop: 4 },
  nextPickupBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  nextLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', marginBottom: 4 },
  nextDetail: { fontSize: 15, fontWeight: 'bold', color: '#0A0E5E' },
});