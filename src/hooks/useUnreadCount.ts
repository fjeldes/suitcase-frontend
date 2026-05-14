import { notificationService } from '@/services/notificationService';
import { useQuery } from '@tanstack/react-query';

export function useUnreadCount() {
  const query = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
  });

  const count = query.data?.count ?? 0;

  return {
    unreadCount: count,
    hasUnread: count > 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
