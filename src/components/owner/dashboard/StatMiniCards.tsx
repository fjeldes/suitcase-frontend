import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  subtitle?: string;
}

const StatCard = ({ title, value, icon, color, bgColor, subtitle }: StatCardProps) => (
  <View style={[styles.card, { backgroundColor: bgColor }]}>
    <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

interface StatMiniCardsProps {
  todayRevenue: number;
  activeBookings: number;
  pickupsToday: number;
  dropoffsToday: number;
  percentageIncrease: number;
  onViewDetails?: () => void;
}

export const StatMiniCards = ({
  todayRevenue,
  activeBookings,
  pickupsToday,
  dropoffsToday,
  percentageIncrease,
  onViewDetails,
}: StatMiniCardsProps) => {
  const { t } = useTranslation();
  const isPositive = percentageIncrease >= 0;
  const revenueSub = `${isPositive ? '+' : ''}${percentageIncrease}% ${t('owner.vs_yesterday')}`;

  return (
    <TouchableOpacity onPress={onViewDetails} activeOpacity={onViewDetails ? 0.8 : 1} disabled={!onViewDetails}>
      <View style={styles.grid}>
        <StatCard title={t('owner.revenue_today')} value={`$${todayRevenue.toFixed(0)}`} icon="cash-outline" color="#0A0E5E" bgColor="#EEF2FF" subtitle={revenueSub} />
        <StatCard title={t('owner.active_bookings')} value={activeBookings} icon="briefcase-outline" color="#6366F1" bgColor="#EEF2FF" />
        <StatCard title={t('owner.pickups_today')} value={pickupsToday} icon="log-out-outline" color="#22C55E" bgColor="#F0FDF4" />
        <StatCard title={t('owner.dropoffs_today')} value={dropoffsToday} icon="log-in-outline" color="#FF6D00" bgColor="#FFF7ED" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0E5E',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: -2,
  },
});
