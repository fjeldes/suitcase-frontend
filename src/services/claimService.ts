import { api } from './api';

export type ClaimType = 'damage' | 'loss' | 'theft' | 'other';

export interface CreateClaimDto {
  bookingId: string;
  subject: string;
  description: string;
  type: ClaimType;
  photos?: string[];
}

export const claimService = {
  create: async (dto: CreateClaimDto) => {
    const { data } = await api.post('/claims', dto);
    return data;
  },

  getMyClaims: async () => {
    const { data } = await api.get('/claims/my');
    return data;
  },
};
