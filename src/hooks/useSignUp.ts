import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
export const useSignupMutation = (staffToken?: string) => {
    const router = useRouter();

    return useMutation({
        mutationFn: authService.signup,
        onSuccess: (data) => {
            if (data.user?.email) {
                const params: Record<string, string> = { email: data.user.email };
                if (staffToken) params.staffToken = staffToken;
                router.replace({ pathname: '/(auth)/verify-email', params });
                Toast.show({
                    type: 'successCustom',
                    text1: 'Verification Email Sent',
                    text2: 'Please check your inbox to verify your account.',
                    position: 'bottom',
                    bottomOffset: 50,
                    visibilityTime: 4000,
                });
            }
        },
        onError: (error: any) => {
            const errorMessage = error.response?.data?.message || 'No se pudo crear la cuenta';
            Toast.show({ type: 'error', text1: 'Error de registro', text2: errorMessage, position: 'bottom' });
        }
    });
};