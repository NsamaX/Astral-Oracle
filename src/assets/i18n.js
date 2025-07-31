import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './languages/en';
import th from './languages/th';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      th: {
        translation: th
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
