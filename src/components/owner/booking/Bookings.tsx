import { useBookingsQuery } from '@/hooks/useMyBookings'
import { useOwnerStore } from '@/store/useOwnerStore'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { BookingCard } from './BookingCard'

// Filtros más orientados a la operación del negocio
const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' }, // Filtro dinámico frontend o backend
  { label: 'To Check-in', value: 'confirmed' },
  { label: 'In Storage', value: 'in_storage' },
  { label: 'Completed', value: 'completed' },
]

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { activeLocationId } = useOwnerStore()
  // 1. Hook de datos con dependencia fuerte de activeLocationId
  const { data, isLoading } = useBookingsQuery(
    activeFilter === 'all' || activeFilter === 'today' ? undefined : activeFilter,
    undefined,
    activeLocationId ?? undefined, // Aquí forzamos el ID de la tienda de Zustand
  )
  const router = useRouter();
  // 2. Lógica de filtrado local (para búsqueda y filtro "Today")
  const filteredData = useMemo(() => {
    if (!data) return []

    let result = data

    // Filtro "Today" (Lógica local si el backend no lo trae filtrado)
    if (activeFilter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      result = result.filter(b =>
        b.startDate.startsWith(today) || b.endDate.startsWith(today)
      )
    }

    // Búsqueda por nombre de cliente o ID
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(b =>
        b.id.toLowerCase().includes(query) ||
        b.user?.name?.toLowerCase().includes(query) ||
        b.user?.profile?.firstName?.toLowerCase().includes(query)
      )
    }

    return result
  }, [data, activeFilter, searchQuery])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con Buscador */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search client or booking ID..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chips de Filtro */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[styles.chip, activeFilter === f.value && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeFilter === f.value && styles.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0A0E5E" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingCard booking={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No bookings for this filter</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#FFF', paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0A0E5E', marginBottom: 15 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1E293B' },
  filterContainer: { marginVertical: 10 },
  filterScroll: { paddingHorizontal: 20, gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#0A0E5E', borderColor: '#0A0E5E' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  chipTextActive: { color: '#FFF' },
  listContent: { padding: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, color: '#94A3B8', fontSize: 16, fontWeight: '500' }
})