import { cookies, headers } from 'next/headers';

const DEFAULT = 'en';
const SUPPORTED = ['en', 'pl'];

export async function detectLanguage() {
  const cookieStore = await cookies();
  const headersStore = await headers();
  const cookieLanguage = cookieStore.get('NEXT_LOCALE')?.value;

  if (cookieLanguage && SUPPORTED.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  const acceptLanguage = headersStore.get('accept-language');
  if (acceptLanguage) {
    const lang = acceptLanguage
      .split(',')
      .map((l) => l.split(';')[0].split('-')[0])
      .find((l) => SUPPORTED.includes(l));

    if (lang) return lang;
  }
  return DEFAULT;
}
