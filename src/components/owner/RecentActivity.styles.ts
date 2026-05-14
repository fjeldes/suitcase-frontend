import { StyleSheet } from 'react-native';
import type { ColorsType } from '@/styles/colors';

export const createStyles = (colors: ColorsType) => StyleSheet.create({
  container: { marginTop: 25, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 20 },
  emptyCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: 24,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 8,
  },
  emptyTextTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textMuted, marginTop: 10, marginBottom: 4 },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 20 },
  listCard: { backgroundColor: colors.surfaceCard, paddingVertical: 10, borderRadius: 24 },
  itemWrapper: { flexDirection: 'row', minHeight: 80 },
  timelineContainer: { alignItems: 'center', width: 20, marginRight: 15 },
  dot: { width: 14, height: 14, borderRadius: 7, zIndex: 1 },
  line: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 4 },
  contentContainer: { flex: 1, paddingBottom: 25 },
  activityTitle: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, marginBottom: 4 },
  activitySubtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 10 },
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
