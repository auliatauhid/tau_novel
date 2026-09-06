import type { Metadata } from 'next';
import { Geist, Geist_Mono, Newsreader } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://taunovel.com'),
  title: {
    default: 'Taunovel — Digital Library Novel Online',
    template: '%s | Taunovel',
  },
  description:
    'Taunovel adalah perpustakaan digital untuk membaca novel online dengan tata letak editorial, warna kertas hangat, dan kenyamanan tanpa distraksi.',
  keywords: ['novel online', 'baca novel', 'web novel', 'taunovel', 'digital library', 'novel indonesia'],
  authors: [{ name: 'Taunovel Team' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Taunovel — Digital Library Novel Online',
    description:
      'Perpustakaan digital untuk membaca novel online dengan pengalaman membaca yang tenang, sederhana, dan modern.',
    url: 'https://taunovel.com',
    siteName: 'Taunovel',
    images: [{ url: '/logo.png', width: 1254, height: 1254, alt: 'Taunovel Logo' }],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#f7f5f0] dark:bg-[#111215] text-[#1c1d21] dark:text-[#f0f0f2] selection:bg-amber-500/20 selection:text-amber-900 dark:selection:bg-amber-500/30 dark:selection:text-amber-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
