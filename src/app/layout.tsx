import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import { AmbientBackground } from '@/components/ui/AmbientBackground';

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
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Cuida e Amor — Portal da Família',
  description: 'Aplicativo oficial da empresa Cuida e Amor Home Care',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo01.svg',
    apple: '/logo01.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // P2.5 FIX: userScalable: false removido — viola WCAG 1.4.4
  // Usuários com deficiência visual precisam poder ampliar o conteúdo.
  viewportFit: 'cover',
  themeColor: '#E0428C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen bg-slate-900 md:py-4 flex justify-center items-start">
        <div className="w-full max-w-[480px] min-h-screen md:min-h-[920px] md:max-h-[960px] md:rounded-[2.5rem] bg-[var(--color-brand-background)] shadow-2xl relative mx-auto flex flex-col overflow-x-hidden md:border md:border-slate-800 md:overflow-y-auto scrollbar-hide">
          <AmbientBackground />
          <div className="relative z-10 flex flex-col flex-1">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
