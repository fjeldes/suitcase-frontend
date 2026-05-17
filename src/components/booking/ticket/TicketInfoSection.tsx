import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { InfoBadge } from './InfoBadge'

export const TicketInfoSection = ({ customerName, location, period }: any) => {
  const { t } = useTranslation();
  return (
  <View style={styles.container}>
    <View style={styles.customerCard}>
      <View>
        <Text style={styles.label}>{t('booking.customer_name_label')}</Text>
        <Text style={styles.value}>{customerName}</Text>
      </View>
      <View style={styles.iconBox}>
        <Ionicons name="person" size={20} color="#0A0E5E" />
      </View>
    </View>
    <View style={styles.row}>
      <InfoBadge label={t('booking.location_label')} value={location} />
      <InfoBadge label={t('booking.period_label')} value={period} />
    </View>
  </View>
);
}

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
