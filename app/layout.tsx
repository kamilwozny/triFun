import { Toaster } from 'sonner';
import { Navbar } from '@/components/navbar';
import './globals.css';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { getServerTranslation } from '@/localization/server';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lng } = await getServerTranslation();

  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        />
      </Head>
      <body
        className={`${inter.className} min-h-[100dvh] h-full flex flex-col`}
      >
        <Providers lng={lng}>
          <Navbar />
          <div className="flex-grow">{children}</div>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
