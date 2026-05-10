import { api } from './api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const faqService = {
  getAll: async (category?: string): Promise<FAQ[]> => {
    const params = category ? `?category=${category}` : '';
    const { data } = await api.get(`/faqs${params}`);
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get('/faqs/categories');
    return data;
  },
};
