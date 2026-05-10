import api from './api';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  };
}

export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  getByLocation: async (locationId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/location/${locationId}`);
    return response.data;
  },

  getAverageRating: async (locationId: string): Promise<number> => {
    const response = await api.get(`/reviews/location/${locationId}/average`);
    return response.data;
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    const response = await api.post('/reviews', dto);
    return response.data;
  },
};
