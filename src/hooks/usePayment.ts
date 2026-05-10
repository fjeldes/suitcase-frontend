import { useStripe } from '@stripe/stripe-react-native';
import { useState } from 'react';
import { paymentService } from '@/services/paymentServices';
import Toast from 'react-native-toast-message';

export function usePayment() {
  const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);

  const initializePaymentSheet = async (amount: number) => {
    try {
      setLoading(true);
      
      // 1. Obtener parámetros del backend
      const { 
        paymentIntent, 
        customer, 
        ephemeralKey,
        publishableKey 
      } = await paymentService.fetchPaymentSheetParams(amount);

      // 2. Inicializar el Payment Sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Suitcase Chile',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        // Habilita el guardado de tarjetas
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: 'Traveler',
        },
        appearance: {
          colors: {
            primary: '#0A0E5E', // Tu color azul premium
          },
          shapes: {
            borderRadius: 12,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Payment Initialization Failed',
        text2: e.message,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      if (error.code === 'Canceled') {
        // El usuario cerró el panel, no es un error crítico
        return { success: false, canceled: true };
      }
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message,
      });
      return { success: false, error };
    } else {
      return { success: true };
    }
  };

  const confirmWithCard = async (amount: number, paymentMethodId: string) => {
    try {
      setLoading(true);

      const result = await paymentService.confirmWithSavedCard(amount, 'usd', paymentMethodId);

      if (result.requiresAction && result.clientSecret) {
        const { error } = await confirmPayment(result.clientSecret, {
          paymentMethodId,
        });

        if (error) {
          Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: error.message,
          });
          return { success: false, error };
        }

        return { success: true };
      }

      if (result.success) {
        return { success: true };
      }

      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: result.error || 'Something went wrong',
      });
      return { success: false, error: result.error };
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Payment Failed',
        text2: e.message,
      });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };

  const setupPaymentSheet = async () => {
    try {
      setLoading(true);
      const { clientSecret } = await paymentService.fetchSetupIntentParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Suitcase Chile',
        setupIntentClientSecret: clientSecret,
        allowsDelayedPaymentMethods: false,
        appearance: {
          colors: { primary: '#0A0E5E' },
          shapes: { borderRadius: 12 }
        }
      });

      if (error) throw new Error(error.message);

      const result = await presentPaymentSheet();
      if (result.error) {
        if (result.error.code !== 'Canceled') throw new Error(result.error.message);
        return { success: false, canceled: true };
      }

      Toast.show({
        type: 'success',
        text1: 'Card Saved!',
        text2: 'Your payment method was added successfully.',
      });
      return { success: true };
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'Setup Failed',
        text2: e.message,
      });
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  };

  return {
    initializePaymentSheet,
    openPaymentSheet,
    setupPaymentSheet,
    confirmWithCard,
    loading,
  };
}
