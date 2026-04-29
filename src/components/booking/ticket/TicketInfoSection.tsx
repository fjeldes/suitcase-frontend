import { Ionicons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { InfoBadge } from './InfoBadge'

export const TicketInfoSection = ({ customerName, location, period }: any) => (
  <View style={styles.container}>
    {/* Customer Row */}
    <View style={styles.customerCard}>
      <View>
        <Text style={styles.label}>CUSTOMER NAME</Text>
        <Text style={styles.value}>{customerName}</Text>
      </View>
      <View style={styles.iconBox}>
        <Ionicons name="person" size={20} color="#0A0E5E" />
      </View>
    </View>

    {/* Fila de Badges con InfoBadge */}
    <View style={styles.row}>
      <InfoBadge label="Location" value={location} />
      <InfoBadge label="Period" value={period} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  customerCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: { color: '#9BA3AF', fontSize: 10, fontWeight: '700', marginBottom: 4 },
  value: { color: '#0A0E5E', fontSize: 18, fontWeight: '700' },
  subValue: { color: '#0A0E5E', fontSize: 14, fontWeight: '700' },
  iconBox: { backgroundColor: '#EEF2FF', padding: 10, borderRadius: 10 },
  row: { flexDirection: 'row', gap: 15 },
  infoBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 15, padding: 15 },
})
