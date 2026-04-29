import { StyleSheet, Text, View } from 'react-native';

export const StatusBadge = ({ label }: { label: string }) => (
  <View style={styles.badge}>
    <Text style={styles.text}>{label.toUpperCase()}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'center',
    zIndex: 10,
    marginBottom: -15, // Para que flote sobre la card
  },
  text: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});