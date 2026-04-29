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

// services/bookingService.ts
export const bookingService = {
    getMyBookings: async (status?: string, limit?: number, locationId?: string) => {
        const params = new URLSearchParams();

        if (status && status !== 'all') params.append('status', status);
        if (limit) params.append('limit', limit.toString());
        if (locationId) params.append('locationId', locationId); // <-- Nuevo parámetro

        const { data } = await api.get(`/bookings/me?${params.toString()}`);
        return data;
    },
    create: async (payload: CreateBookingPayload) => {
        const { data } = await api.post('/bookings', payload);
        return data;
    },

    validateQR: async (qrCode: string) => {
        const { data } = await api.get(`/bookings/validate-qr/${qrCode}`);
        return data;
    },
    
    processBookingAction: async (qrCode: string) => {
        const { data } = await api.patch(`/bookings/process-qr/${qrCode}`);
        return data;
    },
};

