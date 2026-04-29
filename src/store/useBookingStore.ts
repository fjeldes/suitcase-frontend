import { BookingOwnerResponse } from '@/types/booking.types';
import { create } from 'zustand';

interface BookingStore {
    currentBooking: BookingOwnerResponse | null;
    setCurrentBooking: (booking: BookingOwnerResponse) => void;
    clearCurrentBooking: () => void;
}
export const useBookingStore = create<BookingStore>((set) => ({
    currentBooking: null,

    setCurrentBooking: (booking) => set({ currentBooking: booking }),

    clearCurrentBooking: () => set({ currentBooking: null }),
}));