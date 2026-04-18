export const ROUTES = {
  AUTH: {
    // Si tus archivos están dentro de (auth), las rutas en Expo Router 
    // ignoran el paréntesis en la URL, pero es más seguro usar el path completo
    SPLASH: '/(auth)/splash',
    LOGIN: '/(auth)/login',
    SIGNUP: '/(auth)/signup',
    FORGOT_PASSWORD: '/(auth)/forgot-password',
  },
  OWNER: {
    // Ahora las rutas son directas y limpias
    DASHBOARD: '/(owner)', 
    CREATE_LOCATION: '/(owner)/create-location',
    MAP_SELECTOR: '/(owner)/map-selector',
    PROFILE: '/(owner)/profile',
  },
  CLIENT: {
    // Por si decides avanzar con la parte del cliente luego
    EXPLORE: '/(client)',
    BOOKINGS: '/(client)/bookings',
  }
} as const;