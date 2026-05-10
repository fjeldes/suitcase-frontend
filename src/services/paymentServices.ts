import { api } from './api';

export interface PaymentSheetParams {
  paymentIntent: string;
  customer: string;
  ephemeralKey: string;
  publishableKey: string;
}

export const paymentService = {
  /**
   * Solicita al backend los secretos necesarios para abrir el panel de pago.
   */
  fetchPaymentSheetParams: async (amount: number, currency: string = 'usd'): Promise<PaymentSheetParams> => {
    const response = await api.post('/payments/create-payment-sheet', {
      amount,
      currency,
    });
    return response.data;
  },

  /**
   * Solicita un SetupIntent para guardar una tarjeta sin cobrar.
   */
  fetchSetupIntentParams: async (): Promise<{ clientSecret: string }> => {
    const response = await api.post('/payments/create-setup-intent');
    return response.data;
  },

  /**
   * Confirma un pago con una tarjeta guardada (server-side).
   */
  confirmWithSavedCard: async (amount: number, currency: string, paymentMethodId: string): Promise<any> => {
    const response = await api.post('/payments/confirm-payment', {
      amount,
      currency,
      paymentMethodId,
    });
    return response.data;
  },

  /**
   * Obtiene la lista de tarjetas guardadas del usuario.
   */
  getSavedCards: async (): Promise<any[]> => {
    const response = await api.get('/payments/methods');
    return response.data;
  },
};
