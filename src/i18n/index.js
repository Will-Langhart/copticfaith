import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'cf-lang',
    },
    interpolation: { escapeValue: false },
  });

// Sync <html dir> and <html lang> with current language
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
});

// Set on init
const initLang = i18n.language?.startsWith('ar') ? 'ar' : 'en';
document.documentElement.lang = initLang;
document.documentElement.dir = initLang === 'ar' ? 'rtl' : 'ltr';

export default i18n;
