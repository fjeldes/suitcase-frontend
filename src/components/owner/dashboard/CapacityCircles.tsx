import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CapacityCircle = ({ percent, label, color }: { percent: number; label: string; color: string }) => {
  const size = 75;
  const radius = 34.5;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <View style={styles.circleWrapper}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke="#F1F5F9" strokeWidth={6} fill="none" />
        <Circle 
          cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          rotation="-90" origin={`${size/2}, ${size/2}`}
        />
      </Svg>
      <Text style={styles.circlePercent}>{percent}%</Text>
      <Text style={styles.circleLabel}>{label}</Text>
    </View>
  );
};

export const CapacitySection = ({ data }: { data: any[] }) => (
  <View style={styles.mainCard}>
    <Text style={styles.cardTitle}>Store Capacity</Text>
    <View style={styles.circlesRow}>
      {data.map((item, index) => (
        <CapacityCircle 
          key={index} 
          percent={item.percentage} 
          label={item.label.split(' ')[0].toUpperCase()} 
          color={item.color} 
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  mainCard: { backgroundColor: '#FFF', borderRadius: 30, padding: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0A0E5E', marginBottom: 20 },
  circlesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  circleWrapper: { alignItems: 'center', gap: 10, position: 'relative' },
  circlePercent: { position: 'absolute', top: 28, fontSize: 14, fontWeight: '800', color: '#0A0E5E' },
  circleLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
});