import i18next, { type i18n } from 'i18next';
import { i18nOptions } from './i18n.main';

import en from './locales/en/global.json';
import pl from './locales/pl/global.json';
import { detectLanguage } from '@/helpers/detectLanguage';

const resources = {
  en: { global: en },
  pl: { global: pl },
};

export async function getServerTranslation(ns = 'global') {
  const instance: i18n = i18next.createInstance();
  const lng = detectLanguage();

  await instance.init({ ...i18nOptions, lng, ns, resources });

  return { t: instance.getFixedT(lng, ns), lng: lng };
}
