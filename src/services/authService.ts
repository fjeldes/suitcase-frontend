import { api } from './api';

export const authService = {
  login: async (credentials: any) => {
    const { data } = await api.post('/auth/login', credentials);
    return data; // { access_token: '...' }
  },
  // puedes agregar register, profile, etc.
};