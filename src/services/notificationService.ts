import { api } from './api'; // Asumiendo que aquí tienes tu instancia de axios configurada

export enum NotificationCategory {
  ALL = 'ALL',
  BOOKINGS = 'BOOKINGS',
  SYSTEM = 'SYSTEM',
  MARKETING = 'MARKETING',
}

export interface RegisterTokenPayload {
  token: string;
  provider: 'expo' | 'fcm';
  deviceModel?: string;
}

export interface NotificationResponse {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  category: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export const notificationService = {
  /**
   * Envía el token generado por Expo al backend para guardarlo
   * vinculado al usuario autenticado.
   */
  registerToken: async (payload: RegisterTokenPayload) => {
    const { data } = await api.post('/notifications/register-token', payload);
    return data;
  },

  /**
   * (Opcional) Permite eliminar un token si el usuario cierra sesión
   * para evitar que le sigan llegando notificaciones a este dispositivo.
   */
  unregisterToken: async (token: string) => {
    const { data } = await api.delete(`/notifications/token/${token}`);
    return data;
  },
  getActivities: async (category: string): Promise<NotificationResponse[]> => {
    const { data } = await api.get('/notifications', {
      params: { category: category === 'All Notifications' ? undefined : category }
    });
    return data;
  },

  // Marcar una como leída
  markAsRead: async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  // Marcar todas como leídas
  markAllAsRead: async () => {
    const { data } = await api.post('/notifications/mark-all-read');
    return data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await api.get('/notifications/unread-count');
    return data;
  }
};