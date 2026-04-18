import { create } from 'zustand';

interface LocationState {
  address: string;
  lat: string;
  lng: string;
  setLocation: (data: { address: string; lat: string; lng: string }) => void;
  reset: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  address: '',
  lat: '',
  lng: '',
  setLocation: (data) => set(data),
  reset: () => set({ address: '', lat: '', lng: '' }),
}));