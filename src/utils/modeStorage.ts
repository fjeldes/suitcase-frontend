import AsyncStorage from '@react-native-async-storage/async-storage';

const MODE_KEY = 'preferred_interface';

export const modeStorage = {
  getPreferred: async (): Promise<string | null> => AsyncStorage.getItem(MODE_KEY),
  setPreferred: async (mode: string) => AsyncStorage.setItem(MODE_KEY, mode),
};
