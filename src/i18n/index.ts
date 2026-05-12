import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import es from './locales/es.json';

const resources = { en: { translation: en }, es: { translation: es } };

AsyncStorage.getItem('app_language').then((lang) => {
  i18n.use(initReactI18next).init({
    resources,
    lng: lang || 'es',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
});

export default i18n;
