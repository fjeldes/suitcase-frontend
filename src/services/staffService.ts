import { api } from './api';

export const staffService = {
  invite: async (locationId: string, name: string, email: string) => {
    const { data } = await api.post('/staff/invite', { locationId, name, email });
    return data;
  },

  acceptInvitation: async (token: string, userId?: string) => {
    const params = userId ? `?token=${token}&userId=${userId}` : `?token=${token}`;
    const { data } = await api.get(`/staff/accept${params}`);
    return data;
  },

  getByLocation: async (locationId: string) => {
    const { data } = await api.get(`/staff/location/${locationId}`);
    return data;
  },

  removeStaff: async (assignmentId: string) => {
    await api.delete(`/staff/${assignmentId}`);
  },

  getMyLocations: async () => {
    const { data } = await api.get('/staff/my-locations');
    return data;
  },
};
