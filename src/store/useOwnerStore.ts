import { create } from 'zustand';

interface OwnerState {
    activeLocationId: string | null;
    activeLocationName: string | null;
    setActiveLocation: (id: string, name?: string) => void;
    resetOwnerStore: () => void;
}

export const useOwnerStore = create<OwnerState>((set) => ({
    activeLocationId: null,
    activeLocationName: null,
    setActiveLocation: (id, name) => set({
        activeLocationId: id,
        activeLocationName: name || null
    }),
    resetOwnerStore: () => set({ activeLocationId: null, activeLocationName: null }),
}));