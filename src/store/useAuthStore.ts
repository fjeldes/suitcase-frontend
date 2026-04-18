import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// Definimos la estructura del usuario para tener autocompletado
interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null; // <-- Nuevo estado
  isAuthenticated: boolean;
  setToken: (token: string, user: User) => Promise<void>; // <-- Ahora recibe user
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setToken: async (token: string, user: User) => {
    // Guardamos ambos en el almacenamiento local
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    // Si existe userData, lo parseamos de vuelta a objeto
    const user = userData ? JSON.parse(userData) : null;
    
    set({ token, user, isAuthenticated: !!token });
  },
}));