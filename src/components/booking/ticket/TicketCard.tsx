import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export const TicketCard = ({ qrValue, bookingId }: { qrValue: string, bookingId: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.qrContainer}>
          <View style={styles.greenHeader}><Text style={styles.headerText}>Booking work</Text></View>
          <View style={styles.qrPadding}>
            <QRCode value={qrValue} size={150} />
          </View>
          <Text style={styles.footerText}>Safe storage work</Text>
        </View>
        
        <Text style={styles.label}>BOOKING ID</Text>
        <Text style={styles.id}>#{bookingId}</Text>
      </View>

      {/* Semicírculos troquelados laterales */}
      <View style={styles.cutoutLeft} />
      <View style={styles.cutoutRight} />
      <View style={styles.dashedLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', backgroundColor: 'transparent' },
  card: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    paddingBottom: 40,
  },
  qrContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  greenHeader: { backgroundColor: '#8DBE00', padding: 8, alignItems: 'center' },
  headerText: { color: 'white', fontWeight: '600' },
  qrPadding: { padding: 15 },
  footerText: { textAlign: 'center', paddingBottom: 10, color: '#444' },
  label: { color: '#9BA3AF', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  id: { color: '#0A0E5E', fontSize: 32, fontWeight: '800', marginTop: 5 },
  cutoutLeft: { position: 'absolute', bottom: -15, left: -15, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F9FAFB' },
  cutoutRight: { position: 'absolute', bottom: -15, right: -15, width: 30, height: 30, borderRadius: 15, backgroundColor: '#F9FAFB' },
  dashedLine: { position: 'absolute', bottom: 0, left: 30, right: 30, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E5E7EB' },
});