import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  count: number;
  nextTime: string;
  nextItem: string;
}

export const UpcomingPickups = ({ count, nextTime, nextItem }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={22} color="#FF6D00" />
        </View>
        <Text style={styles.headerTitle}>Upcoming Pickups</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.countText}>{count} today</Text>
        <View style={styles.nextInfoRow}>
          <Text style={styles.label}>Next: </Text>
          <Text style={styles.value}>{nextTime} · {nextItem}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Sombra sutil para iOS/Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF5ED', // Naranja muy claro/pastel
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A0E5E',
    flex: 1,
    textAlign: 'right', // Alineado a la derecha como en tu imagen
  },
  body: {
    marginTop: 4,
  },
  countText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A0E5E',
    marginBottom: 4,
  },
  nextInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#757575',
  },
  value: {
    fontSize: 14,
    color: '#0A0E5E',
    fontWeight: '500',
  },
});