import { Toaster } from 'sonner';
import { Navbar } from '@/components/navbar';
import './globals.css';
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
    <html lang={lng}>
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
