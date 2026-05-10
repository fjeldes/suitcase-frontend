import { SignUpFormData } from '@/schemas/auth.schema';
import { api } from './api';

export const authService = {

  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  signup: async (signupData: SignUpFormData) => {
    const { confirmPassword, ...cleanData } = signupData;
    const { data } = await api.post('/auth/signup', cleanData);
    return data;
  },

  /**
   * Envía el idToken de Google a nuestro backend de NestJS
   * @param token string (idToken obtenido desde Expo Auth Session)
   */
  loginWithGoogle: async (token: string) => {
    // 1. Llamamos al endpoint que crearemos en NestJS
    const { data } = await api.post('/auth/google', { token });

    // 2. Retorna la misma estructura que el login tradicional: 
    // { accessToken, refreshToken, user }
    return data;
  },
};