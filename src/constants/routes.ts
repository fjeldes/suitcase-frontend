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
  },
  CLIENT: {
    EXPLORE: '/(client)',
    BOOKINGS: '/(client)/bookings',
    STORE_DETAIL: (id: string) => `/(client)/store/${id}` as const,
  }
} as const;