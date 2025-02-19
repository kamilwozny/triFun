import { Navbar } from '@/components/navbar';
import '../styles/globals.css';
import Head from 'next/head';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        />
      </Head>
      <body className={`${inter.className} bg-primary w-full h-[100vh] pb-20`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
