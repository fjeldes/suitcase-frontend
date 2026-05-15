import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

export interface ActivityLog {
  id: string;
  type: 'NEW_BOOKING' | 'BOOKING_CANCELLED' | 'CHECK_IN' | 'CHECK_OUT' | 'COLLECTION_COMPLETED' | 'REVIEW_RECEIVED';
  payload: Record<string, any>;
  createdAt: string;
  location?: {
    id: string;
    name: string;
  };
}

export const useActivityLogs = (limit = 10, locationId?: string) => {
  return useQuery({
    queryKey: ['owner', 'activityLogs', limit, locationId],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: String(limit) });
      if (locationId) params.append('locationId', locationId);
      const { data } = await api.get<ActivityLog[]>(`/activity-logs/owner?${params}`);
      return data;
    },
    enabled: !!locationId,
  });
};
