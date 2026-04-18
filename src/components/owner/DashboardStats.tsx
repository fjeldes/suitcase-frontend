import { useDashboardStats } from '@/hooks/useDashboard'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export const DashboardStats = () => {
  // 1. Obtenemos los datos reales del hook
  const { data, isLoading, error } = useDashboardStats();

  // 2. Manejo de estado de carga
  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0A0E5E" />
      </View>
    );
  }

  // Valores por defecto en caso de que no haya data o error
  const stats = data || { activeItems: 0, totalSlots: 0, percentage: 0, revenue: 0 };
  
  // Hardcoded por ahora ya que no lo tenemos en el endpoint, 
  // pero lo dejamos listo para cuando lo agregues a NestJS
  const revenueChange = "+12.5%"; 

  return (
    <View style={styles.container}>
      {/* 1. Tarjeta de Ingresos (Azul Oscuro) */}
      <LinearGradient colors={['#0A0E5E', '#06093A']} style={styles.revenueCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBadge}>
            <Ionicons name="wallet-outline" size={20} color="#fff" />
          </View>
          <View style={styles.revenueTag}>
            <Text style={styles.revenueTagText}>MONTHLY REVENUE</Text>
          </View>
        </View>

        <Text style={styles.revenueAmount}>
          ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </Text>

        <View style={styles.changeRow}>
          <Ionicons name="trending-up" size={16} color="#4ADE80" />
          <Text style={styles.changeText}>{revenueChange} from last month</Text>
        </View>
      </LinearGradient>

      {/* 2. Tarjeta de Ocupación (Blanca) */}
      <View style={styles.whiteCard}>
        <View style={styles.whiteCardHeader}>
          <View style={styles.headerInfo}>
            <View style={[styles.iconBadgeSmall, { backgroundColor: '#F1F5F9' }]}>
              <MaterialCommunityIcons name="archive-outline" size={22} color="#0A0E5E" />
            </View>
            <Text style={styles.activeItemsText}>Active Items</Text>
          </View>
        </View>

        <View style={styles.slotsRow}>
          <Text style={styles.slotsMainText}>{stats.activeItems}</Text>
          <Text style={styles.slotsSubText}> / {stats.totalSlots} slots full</Text>
        </View>

        {/* Barra de Progreso Dinámica */}
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.min(stats.percentage, 100)}%` } 
            ]} 
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 20,
  },
  center: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilos Tarjeta Azul
  revenueCard: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#0A0E5E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadgeSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  revenueTag: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  revenueTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  revenueAmount: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '500',
  },
  // Estilos Tarjeta Blanca
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  whiteCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeItemsText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  slotsMainText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0A0E5E',
  },
  slotsSubText: {
    fontSize: 16,
    color: '#64748B',
  },
  progressBarBg: {
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0A0E5E',
    borderRadius: 5,
  },
})