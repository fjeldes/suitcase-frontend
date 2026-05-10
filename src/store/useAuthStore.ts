import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  roles: any[];
  profile?: {
    avatar: string | null;
  };
}

interface AuthState {
  token: string | null;
  refreshToken: string | null; // <-- Nuevo
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (token: string, refreshToken: string, user: User) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setTokens: async (token: string, refreshToken: string, user: User) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    
    set({ token, refreshToken, user, isAuthenticated: true });
  },

  setUser: async (user: User) => {
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    set({ user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('userData');
    set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const [token, refreshToken, userData] = await Promise.all([
      AsyncStorage.getItem('userToken'),
      AsyncStorage.getItem('refreshToken'),
      AsyncStorage.getItem('userData'),
    ]);
    
    const user = userData ? JSON.parse(userData) : null;
    
    set({ 
      token, 
      refreshToken, 
      user, 
      isAuthenticated: !!token 
    });
  },
}));