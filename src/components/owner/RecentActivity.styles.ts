import { StyleSheet } from 'react-native';
import { Colors } from '@/styles/colors';
import { globalStyles } from '@/styles/globalStyles';

export const styles = StyleSheet.create({
  container: { marginTop: 25, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.primary, marginBottom: 20 },
  emptyCard: { 
    backgroundColor: Colors.white, 
    borderRadius: 24, 
    paddingVertical: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    ...globalStyles.cardShadow 
  },
  emptyTextTitle: { fontSize: 16, fontWeight: 'bold', color: '#475569', marginTop: 10, marginBottom: 4 },
  emptyText: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },
  listCard: { backgroundColor: Colors.background, paddingVertical: 10 },
  itemWrapper: { flexDirection: 'row', minHeight: 80 },
  timelineContainer: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 14, height: 14, borderRadius: 7, zIndex: 1 },
  line: { flex: 1, width: 2, backgroundColor: Colors.lightGray, marginVertical: 4 },
  contentContainer: { flex: 1, paddingBottom: 25 },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  activitySubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 10 },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    alignSelf: 'flex-start',
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 10,
    gap: 6
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  starsRow: { flexDirection: 'row', marginTop: 4 }
});
