import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { modeStorage } from '@/utils/modeStorage';
import { useAuthStore } from '@/store/useAuthStore';

export function useSwitchMode() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const switchMode = useCallback(
    (target: string) => {
      modeStorage.setPreferred(target);
      if (target === 'owner' || target === 'staff') {
        router.replace('/(owner)');
      } else {
        router.replace('/(client)');
      }
    },
    [router],
  );

  const getDefaultRoute = useCallback(() => {
    const roles = user?.roles || [];
    if (roles.includes('owner') || roles.includes('staff')) return '/(owner)';
    return '/(client)';
  }, [user]);

  return { switchMode, isPending: false, getDefaultRoute };
}
