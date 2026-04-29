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
    MAP_SELECTOR: '/(owner)/map-selector',
    PROFILE: '/(owner)/profile',
    BOOKINGS: '/(owner)/bookings',
    SCANNER: '/(owner)/bookings/scanner',
    CONFIRM_CHECK_IN: '/(owner)/bookings/confirm-check-in',
    CHECKIN_SUCCESS: '/(owner)/bookings/check-in-success',
  },
  CLIENT: {
    EXPLORE: '/(client)',
    BOOKINGS: '/(client)/bookings',
    STORE_DETAIL: (id: string) => `/(client)/store/${id}` as const,
    BOOKING_TICKET: '/(client)/bookings/ticket'
  }
} as const;