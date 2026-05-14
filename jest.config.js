/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native|' +
      'react-native|' +
      'react-native-.*|' +
      '@react-native-community|' +
      '@react-navigation|' +
      'expo|' +
      'expo-.*|' +
      '@expo|' +
      'react-native-reanimated|' +
      'react-native-gesture-handler|' +
      '@stripe/stripe-react-native|' +
      'react-native-toast-message|' +
      '@tanstack' +
    ')/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!**/*.style.{ts,tsx}',
  ],
};

module.exports = config;
