// src/hooks/useRegisterPushToken.ts
import { notificationService, RegisterTokenPayload } from '@/services/notificationService';
import { useMutation } from '@tanstack/react-query';

export function useRegisterPushToken() {
  return useMutation({
    mutationFn: (payload: RegisterTokenPayload) => 
      notificationService.registerToken(payload),
    
    onSuccess: () => {
      console.log("✅ Push token registrado correctamente");
    },
    onError: (error: any) => {
      console.error("❌ Error registrando push token:", error?.response?.data || error.message);
    }
  });
}