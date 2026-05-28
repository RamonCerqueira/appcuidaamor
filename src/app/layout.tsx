import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Cuida e Amor',
  description: 'Aplicativo para clientes Cuida e Amor',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <body>
        <div className="w-full max-w-[480px] min-h-screen bg-[var(--background)] shadow-2xl relative mx-auto flex flex-col pb-20 overflow-x-hidden border-x border-gray-200/50">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

