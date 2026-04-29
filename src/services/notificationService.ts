import { api } from './api'; // Asumiendo que aquí tienes tu instancia de axios configurada

export interface RegisterTokenPayload {
  token: string;
  provider: 'expo' | 'fcm';
  deviceModel?: string;
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
  }
};