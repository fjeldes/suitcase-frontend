export const ROUTES = {
  AUTH: {
    SPLASH: '/(auth)/splash',
    LOGIN: '/(auth)/login',
    SIGNUP: '/(auth)/signup',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
  },
  OWNER: {
    DASHBOARD: '/(owner)',
    CREATE_LOCATION: '/(owner)/create-location',
    STORES: '/(owner)/stores',
    EDIT_STORE: '/(owner)/edit-store',
    MAP_SELECTOR: '/(owner)/map-selector',
    PROFILE: '/(owner)/profile',
    NOTIFICATIONS: '/(owner)/notifications',
    BOOKINGS: '/(owner)/bookings',
    STAFF: '/(owner)/staff',
    STATS: '/(owner)/stats',
    // Usamos funciones para rutas con parámetros [id]
    BOOKING_DETAIL: (id: string) => `/(owner)/bookings/${id}` as const,
    SCANNER: '/(owner)/bookings/scanner',
    CONFIRM_CHECK_IN: '/(owner)/bookings/confirm-check-in',
    CHECKIN_SUCCESS: '/(owner)/bookings/check-in-success',
  },
  CLIENT: {
    EXPLORE: '/(client)',
    BOOKINGS: '/(client)/bookings',
    SETTINGS: '/(client)/settings',
    HELP: '/(client)/help',
    PROFILE: '/(client)/profile',
    STORE_DETAIL: (id: string) => `/(client)/store/${id}` as const,
    BOOKING_TICKET: '/(client)/bookings/ticket',
    BOOKING_DETAIL: (id: string) => `/(client)/bookings/${id}` as const,
    PAST_BOOKING_DETAIL: (id: string) => `/(client)/bookings/past/${id}` as const,
  }
} as const;