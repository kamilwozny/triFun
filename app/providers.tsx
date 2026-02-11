'use client';

import { SessionProvider } from 'next-auth/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../localization/client';
import { useEffect, useState } from 'react';

export default function Providers({
  children,
  lng,
}: {
  children: React.ReactNode;
  lng: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.language !== lng) {
      i18n.changeLanguage(lng).finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [lng]);

  if (!ready) return null;

  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </SessionProvider>
  );
}
