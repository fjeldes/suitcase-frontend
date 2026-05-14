import { useBookingsQuery } from '@/hooks/useMyBookings'
import { useOwnerStore } from '@/store/useOwnerStore'
import { useTheme } from '@/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
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
  { label: 'Today', value: 'today' },
  { label: 'To Check-in', value: 'confirmed' },
  { label: 'In Storage', value: 'in_storage' },
  { label: 'Completed', value: 'completed' },
]

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { activeLocationId } = useOwnerStore()
  const { colors } = useTheme()
  const { data, isLoading } = useBookingsQuery(
    activeFilter === 'all' || activeFilter === 'today' ? undefined : activeFilter,
    undefined,
    activeLocationId ?? undefined,
  )
  const router = useRouter();

  const filteredData = useMemo(() => {
    if (!data) return []
    let result = data
    if (activeFilter === 'today') {
      const today = new Date().toISOString().split('T')[0]
      result = result.filter(b =>
        b.startDate.startsWith(today) || b.endDate.startsWith(today)
      )
    }
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

  const s = useMemo(() => createStyles(colors), [colors])

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
            <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Bookings</Text>
        </View>
        <View style={s.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Search client or booking ID..."
            style={s.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.iconMuted}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.iconMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={s.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[s.chip, activeFilter === f.value && s.chipActive]}
            >
              <Text style={[s.chipText, activeFilter === f.value && s.chipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={colors.iconColor} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookingCard booking={item} />}
          contentContainerStyle={s.listContent}
          keyboardShouldPersistTaps="handled"
          onScroll={() => Keyboard.dismiss()}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Ionicons name="receipt-outline" size={60} color={colors.iconMuted} />
              <Text style={s.emptyText}>No bookings for this filter</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceCardLow },
  header: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.surfaceCard, paddingBottom: 15 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, marginBottom: 15 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: colors.textPrimary },
  filterContainer: { marginVertical: 10 },
  filterScroll: { paddingHorizontal: 20, gap: 10 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  chipTextActive: { color: '#FFF' },
  listContent: { padding: 20, paddingBottom: 100 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 12, color: colors.iconMuted, fontSize: 16, fontWeight: '500' }
})
