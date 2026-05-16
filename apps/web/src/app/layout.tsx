import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Providers } from '@/components/layout/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Agriflow | AI Food Supply Chain Intelligence',
    template: '%s | Agriflow',
  },
  description: 'Platform intelijen rantai pasok pangan berbasis AI. Pantau harga, deteksi anomali, dan kelola rute distribusi pangan nasional secara real-time.',
  keywords: ['agriflow', 'ketahanan pangan', 'supply chain', 'prediksi harga pangan', 'AI pertanian', 'dashboard pangan'],
  authors: [{ name: 'Agriflow Team' }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Agriflow - AI Food Supply Chain Intelligence',
    description: 'Platform cerdas untuk memantau lonjakan harga, memprediksi pasokan, dan mengoptimalkan distribusi komoditas pangan di seluruh Indonesia.',
    siteName: 'Agriflow',
    images: [
      {
        url: '/agriculture-field.jpg',
        width: 1200,
        height: 630,
        alt: 'Agriflow Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agriflow | AI Food Supply Chain',
    description: 'Pantau harga dan kelola distribusi pangan nasional secara real-time dengan kecerdasan buatan.',
    images: ['/agriculture-field.jpg'],
  },
  icons: {
    icon: '/agriflow-logo.png',
    apple: '/agriflow-logo.png',
  },
  other: {
    'JuaraVibeCoding:email': 'ahmadhrr22@gmail.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}