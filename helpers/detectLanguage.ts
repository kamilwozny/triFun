import { cookies, headers } from 'next/headers';

const DEFAULT = 'en';
const SUPPORTED = ['en', 'pl'];

export function detectLanguage() {
  const cookieLanguage = cookies().get('NEXT_LOCALE')?.value;

  if (cookieLanguage && SUPPORTED.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  const acceptLanguage = headers().get('accept-language');
  if (acceptLanguage) {
    const lang = acceptLanguage
      .split(',')
      .map((l) => l.split(';')[0].split('-')[0])
      .find((l) => SUPPORTED.includes(l));

    if (lang) return lang;
  }
  return DEFAULT;
}
