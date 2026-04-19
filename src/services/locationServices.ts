import { api } from './api';

export const locationService = {
  // Crear locación
  create: async (locationData: any) => {
    const { data } = await api.post('/locations', locationData);
    return data;
  },

  // Obtener mis locaciones (para el Dashboard)
  getMyLocations: async () => {
    const { data } = await api.get('/locations/me');
    return data;
  },

  // Obtener detalle
  getById: async (id: string) => {
    const { data } = await api.get(`/locations/${id}`);
    return data;
  },

  // services/locationService.ts
  getNearby: async (lat: number, lng: number, radius?: number, startDate?: string, endDate?: string) => {
    const { data } = await api.get('/locations/nearby', {
      params: {
        lat,
        lng,
        radius,
        startDate,
        endDate
      }
    });
    return data;
  },

};
