// eslint-disable-next-line import/no-named-as-default
import type { InitOptions } from 'i18next';

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

export const languages = ['en', 'pl'] as const;
