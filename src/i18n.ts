import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english from './locales/en.json';

const resources = {
  en: {
    translation: english,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: resources,
    lng: 'en',
  });

export default i18n;
