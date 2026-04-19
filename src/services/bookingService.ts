// services/bookingService.ts
import { api } from './api';

export interface CreateBookingPayload {
    locationId: string;
    startDate: string; // ISO String
    endDate: string;   // ISO String
    items: {
        small: number;
        medium: number;
        large: number;
    };
}

export const bookingService = {
    create: async (payload: CreateBookingPayload) => {
        const { data } = await api.post('/bookings', payload);
        return data;
    },
    getMyBookings: async () => {
        // Esto llamará a tu endpoint: GET /bookings/me
        const { data } = await api.get('/bookings/me');
        return data;
    },
};