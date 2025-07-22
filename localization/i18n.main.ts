// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { InitOptions } from 'i18next';

import en from './locales/en/global.json';
import pl from './locales/pl/global.json';

const resources = {
  en: {
    global: en,
  },
  pl: {
    global: pl,
  },
};

export const i18nOptions = {
  defaultNS: 'global',
  ns: 'global',
  debug: false,
  saveMissing: false,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
} as const satisfies InitOptions;

i18n.use(initReactI18next).init({
  resources,
  ...i18nOptions,
});

export default i18n;
