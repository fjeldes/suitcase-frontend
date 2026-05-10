import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

interface PickupsProps {
  count: number;
  nextTime?: string;
  nextPerson?: string;
  nextItem?: string;
}

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const UpcomingPickupsCard = ({ count, nextTime, nextPerson, nextItem }: PickupsProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.card}>
      {/* Parte visible siempre - Header */}
      <TouchableOpacity onPress={toggleExpand} activeOpacity={0.7} style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={24} color="#92400E" />
          </View>
          <View>
            <Text style={styles.title}>Upcoming Pickups</Text>
            <Text style={styles.subText}>{count} Scheduled today</Text>
          </View>
        </View>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={22} color="#64748B" />
      </TouchableOpacity>

      {/* Contenido colapsable */}
      {expanded && (
        <View style={styles.nextPickupBox}>
          <Text style={styles.nextLabel}>NEXT PICKUP</Text>
          <Text style={styles.nextDetail}>
            {nextTime
              ? `${nextTime} • ${nextPerson || 'Guest'} (${nextItem})`
              : 'No more pickups today'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0A0E5E' },
  subText: { fontSize: 14, color: '#64748B', marginTop: 2 },
  nextPickupBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  nextLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', marginBottom: 4 },
  nextDetail: { fontSize: 15, fontWeight: 'bold', color: '#0A0E5E' },
});