import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] DSN not configured — skipping initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.2,
    enableNative: true,
    environment: __DEV__ ? 'development' : 'production',
  });

  console.log('[Sentry] Initialized');
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (__DEV__) {
    console.error('[Error]', error.message, context || '');
    return;
  }
  if (SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (__DEV__) {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }
  if (SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}

export { Sentry };
