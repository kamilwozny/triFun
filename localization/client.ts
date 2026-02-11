'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nOptions } from './i18n.main';

import en from './locales/en/global.json';
import pl from './locales/pl/global.json';

i18n.use(initReactI18next).init({
  ...i18nOptions,
  resources: {
    en: { global: en },
    pl: { global: pl },
  },
});

export default i18n;
