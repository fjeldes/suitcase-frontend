import { api } from './api';

export interface Terms {
  id: string;
  type: 'client' | 'owner';
  version: string;
  content: string;
  createdAt: string;
}

export const termsService = {
  getLatest: async (type: 'client' | 'owner'): Promise<Terms> => {
    const { data } = await api.get(`/terms/latest/${type}`);
    return data;
  },

  accept: async (termsId: string): Promise<void> => {
    await api.post(`/terms/accept/${termsId}`);
  },
};
