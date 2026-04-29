import { useBookingsQuery } from '@/hooks/useMyBookings'
import { useOwnerStore } from '@/store/useOwnerStore'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
    FlatList,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import { BookingCard } from './BookingCard'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'To Check-in', value: 'confirmed' },
  { label: 'Active', value: 'in_storage' },
  { label: 'Completed', value: 'completed' },
]

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { activeLocationId } = useOwnerStore()
  
  const { data, isLoading } = useBookingsQuery(
    activeFilter === 'all' ? undefined : activeFilter,
    undefined,
    activeLocationId ?? undefined,
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            placeholder="Search by ID or client..."
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Modern Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[
                styles.chip, 
                activeFilter === f.value && styles.chipActive
              ]}
            >
              <Text style={[
                styles.chipText, 
                activeFilter === f.value && styles.chipTextActive
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' // Un gris más suave de fondo
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingBottom: 20,
    // Sombra para iOS/Android
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 }
    })
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { 
    flex: 1, 
    height: 45, 
    fontSize: 15, 
    color: '#111827' 
  },
  filterContainer: {
    marginVertical: 15,
  },
  filterScroll: { 
    paddingHorizontal: 20, 
    gap: 8 
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#0A0E5E',
    borderColor: '#0A0E5E',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  chipTextActive: {
    color: '#FFF',
  },
  listContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 10,
    color: '#9CA3AF',
    fontSize: 16,
  }
})