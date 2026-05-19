/**
 * Root layout — fonts, global providers, navbar, mini player, toast notifications.
 */
import type { Metadata } from 'next';
import { Inter, Cinzel } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import GlobalMiniPlayer from '@/components/player/GlobalMiniPlayer';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Christ Light Media',
    template: '%s | Christ Light Media',
  },
  description:
    'Stream sermons, podcasts, worship music, daily devotions, and join a global Christian community.',
  keywords: [
    'Christian media',
    'sermons',
    'podcasts',
    'worship',
    'devotions',
    'prayer',
    'Bible school',
  ],
  authors: [{ name: 'Christ Light Media' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'Christ Light Media',
    title: 'Christ Light Media',
    description:
      'A full-stack Christian media platform — sermons, podcasts, worship, devotions, and community.',
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Christ Light Media',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christ Light Media',
    description:
      'Stream sermons, podcasts, worship music, and daily devotions.',
    images: [`${appUrl}/og-image.png`],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-bg font-inter text-white antialiased">
        <AuthProvider>
          <PlayerProvider>
            <Navbar />
            <main className="pb-24">{children}</main>
            <GlobalMiniPlayer />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1A1A1A',
                  color: '#fff',
                  border: '1px solid rgba(200,162,74,0.2)',
                },
                success: { iconTheme: { primary: '#C8A24A', secondary: '#0A0A0A' } },
              }}
            />
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
