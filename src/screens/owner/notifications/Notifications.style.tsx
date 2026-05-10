import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // ==========================================
    // 1. ESTILOS DE LA PANTALLA (SCREEN)
    // ==========================================
    container: {
        flex: 1,
        backgroundColor: '#F8F9FE', // Fondo ligeramente azulado
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 70,
        backgroundColor: '#FFFFFF',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0A0E5E',
    },
    avatarMini: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1.5,
        borderColor: '#0A0E5E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    introSection: {
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0A0E5E',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
        marginBottom: 15,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9', // Gris suave del botón de la imagen
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    markAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0A0E5E',
        marginLeft: 8,
    },
    filterContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 10,
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        backgroundColor: '#F1F5F9',
        marginRight: 8,
    },
    filterTabActive: {
        backgroundColor: '#0A0E5E',
    },
    filterTabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    filterTabTextActive: {
        color: '#FFFFFF',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    banner: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 10,
    },
    bannerText: {
        fontSize: 15,
        color: '#FFFFFF',
        lineHeight: 22,
        opacity: 0.9,
    },
    bannerLink: {
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    bannerLinkText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 15,
    },
    loadMore: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 20,
        gap: 8,
    },
    loadMoreText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0A0E5E',
    },

    // ==========================================
    // 2. ESTILOS DEL ITEM (NOTIFICATION ITEM)
    // ==========================================
    itemContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBg: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    criticalIcon: {
        backgroundColor: '#FEE2E2', // Fondo rojo suave para alertas
    },
    logIcon: {
        backgroundColor: '#F1F5F9', // Fondo gris para logs
    },
    textMainContainer: {
        flex: 1,
        marginLeft: 16,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0A0E5E',
        flex: 0.8,
        lineHeight: 20,
    },
    itemTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    itemDescription: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
    },
    unreadIndicator: {
        width: 4,
        height: 12,
        backgroundColor: '#E53E3E', // La barrita roja lateral de la imagen
        borderRadius: 2,
        marginLeft: 8,
        marginTop: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        gap: 12,
        alignItems: 'center',
    },
    primaryBtn: {
        backgroundColor: '#0A0E5E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    secondaryBtn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    secondaryBtnText: {
        color: '#0A0E5E',
        fontSize: 14,
        fontWeight: '700',
    },
});