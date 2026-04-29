import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

export const RevenueCard = ({ amount, percentage, lastAmount }: any) => (
  <LinearGradient colors={['#10147E', '#06094B']} style={styles.card}>
    <View style={styles.headerRow}>
      <Text style={styles.label}>TODAY'S REVENUE</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>↗ +{percentage}</Text>
      </View>
    </View>
    
    <Text style={styles.amount}>${amount}</Text>
    <Text style={styles.comparison}>Compared to yesterday (${lastAmount})</Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: { padding: 24, borderRadius: 32, marginVertical: 10 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  badge: { backgroundColor: '#FF6D00', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  amount: { color: '#fff', fontSize: 48, fontWeight: 'bold', marginTop: 10 },
  comparison: { color: '#94A3B8', fontSize: 14, marginTop: 15 },
});