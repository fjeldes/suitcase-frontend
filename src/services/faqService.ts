import { api } from './api';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const faqService = {
  getAll: async (category?: string, lang?: string): Promise<FAQ[]> => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (lang) params.set('lang', lang);
    const qs = params.toString();
    const { data } = await api.get(`/faqs${qs ? `?${qs}` : ''}`);
    return data;
  },

  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get('/faqs/categories');
    return data;
  },
};
