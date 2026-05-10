import { locationService } from '@/services/locationServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateLocation() {
    const queryClient = useQueryClient();

    return useMutation({
        // La función que realiza la llamada a la API
        mutationFn: async (data: { id: string } & any) => {
            const { id, ...updateData } = data;
            return locationService.update(id, updateData);
        },

        // Una vez que la actualización es exitosa:
        onSuccess: (data, variables) => {
            // 1. Invalidamos la caché de la tienda específica para que se refresque el detalle
            queryClient.invalidateQueries({ queryKey: ['store', variables.id] });

            // 2. Invalidamos la lista de tiendas del owner para que el cambio se vea en el listado principal
            queryClient.invalidateQueries({ queryKey: ['my-locations'] });
        },

        onError: (error) => {
            console.error('Error updating location:', error);
        },
    });
}