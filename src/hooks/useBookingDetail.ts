// hooks/useBookingDetail.ts
import { api } from '@/services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useBookingDetail = (id: string) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['booking', id],
        queryFn: async () => {
            const { data } = await api.get(`/bookings/${id}`);
            return data;
        },
        enabled: !!id,
        /**
         * 🚀 CARGA INSTANTÁNEA:
         * Antes de hacer la petición al backend, intentamos buscar el booking 
         * en la lista general de 'bookings' que ya descargamos antes.
         */
        initialData: () => {
            return queryClient
                .getQueryData<any[]>(['bookings'])
                ?.find((b) => b.id.toString() === id?.toString());
        },
        // Consideramos el dato como "fresco" por 5 minutos para evitar peticiones extras
        staleTime: 1000 * 60 * 5,
    });
};