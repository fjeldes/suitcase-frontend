import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // Ajuste para 2 columnas con gap

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <View style={[styles.card, { borderLeftColor: color }]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, { color: '#0A0E5E' }]}>{value}</Text>
  </View>
);

export const DashboardStatsGrid = ({ data }: { data: any }) => {
  const calculateTotalOccupancy = () => {
    if (!data.occupancy || data.occupancy.length === 0) return 0;
    const sum = data.occupancy.reduce((acc: number, curr: any) => acc + curr.percentage, 0);
    return Math.round(sum / data.occupancy.length);
  };

  const totalOccupancy = calculateTotalOccupancy();
  return (
    <View style={styles.grid}>
      <StatCard 
        label="INCOMING" 
        value={data.pickups.totalToday} 
        color="#0A0E5E" 
      />
      <StatCard 
        label="ACTIVE" 
        value={data.bookings.activeCount} 
        color="#8B4513" // Café/Naranja oscuro
      />
      <StatCard 
        label="Occupancy" 
        value={`${totalOccupancy}%`}
        color="#7C9AFF" 
      />
      <StatCard 
        label="REVENUE" 
        value={`$${data.revenue.today}k`} 
        color="#C1C1C1" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
  },
});