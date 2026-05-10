import { notificationService } from '@/services/notificationService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

export function useNotifications(category: string) {
    const queryClient = useQueryClient();

    // Query para obtener las notificaciones/logs
    const notificationsQuery = useQuery({
        queryKey: ['notifications', category],
        queryFn: () => notificationService.getActivities(category),
        // Refrescar automáticamente cada vez que el owner entra a la pantalla
        refetchOnWindowFocus: true,
    });

    // Mutación para marcar todo como leído
    const markAllReadMutation = useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Updated',
                text2: 'All notifications marked as read.',
            });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Could not update notifications',
            });
        },
    });

    return {
        notifications: notificationsQuery.data || [],
        isLoading: notificationsQuery.isLoading,
        isRefetching: notificationsQuery.isRefetching,
        markAllRead: markAllReadMutation.mutate,
        isMarkingAllRead: markAllReadMutation.isPending,
        refetch: notificationsQuery.refetch,
    };
}