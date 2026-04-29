import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { router } from 'expo-router';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Solicitud: Inyecta el token actual en cada llamada
api.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuesta: Captura el 401 y refresca el token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos 401 y NO es una reincidencia (evita bucles)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken, user, setTokens, logout } = useAuthStore.getState();

      if (refreshToken && user) {
        try {
          // LLAMADA AL BACKEND: Usamos axios directo (no 'api') para evitar recursión
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { accessToken: newToken, refreshToken: newRefreshToken } = response.data;

          // Guardar nuevos tokens en Store y Storage
          await setTokens(newToken, newRefreshToken, user);

          // Reintentar la petición que falló originalmente
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Si el refresh token también falló, limpiar y cerrar sesión
          await logout();
          router.replace('/(auth)/login');
          return Promise.reject(refreshError);
        }
      } else {
        // No hay tokens para refrescar
        await logout();
        router.replace('/(auth)/login');
      }
    }

    return Promise.reject(error);
  }
);