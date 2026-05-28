'use client';

import { Home, Calendar, HeartPulse, FileText, Menu, X, User, Phone, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Esconder navegação nas telas de login/recuperação/splash/onboarding
  const hideOnPaths = ['/login', '/esqueci-senha', '/verificacao', '/nova-senha', '/splash', '/onboarding'];
  if (hideOnPaths.includes(pathname)) return null;

  const getIconClass = (path: string) => {
    return pathname === path 
      ? "flex flex-col items-center gap-1 text-[var(--color-brand-primary)] scale-110 transition-transform duration-300 relative" 
      : "flex flex-col items-center gap-1 text-gray-400 hover:text-gray-500 transition-colors duration-300";
  };

  const activeIndicator = (path: string) => {
    if (pathname !== path) return null;
    return (
      <div className="absolute -top-3 w-1.5 h-1.5 bg-[var(--color-brand-primary)] rounded-full" />
    );
  };

  return (
    <>
      <div className="fixed bottom-0 w-full max-w-[480px] left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 pb-safe z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-end px-6 py-3 pb-5">
          
          <Link href="/" className={getIconClass('/')} onClick={() => setMenuOpen(false)}>
            {activeIndicator('/')}
            <Home size={24} strokeWidth={pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Início</span>
          </Link>

          <Link href="/escala" className={getIconClass('/escala')} onClick={() => setMenuOpen(false)}>
            {activeIndicator('/escala')}
            <Calendar size={24} strokeWidth={pathname === '/escala' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Escala</span>
          </Link>

          {/* Floating Action Button (Quadro) */}
          <Link href="/quadro" className="relative -top-5 flex flex-col items-center" onClick={() => setMenuOpen(false)}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-[var(--color-brand-primary)]/20 border-[4px] border-white transition-transform active:scale-95 ${pathname === '/quadro' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-white text-[var(--color-brand-primary)]'}`}>
              <HeartPulse size={28} strokeWidth={2.5} />
            </div>
          </Link>

          <Link href="/pedidos" className={getIconClass('/pedidos')} onClick={() => setMenuOpen(false)}>
            {activeIndicator('/pedidos')}
            <FileText size={24} strokeWidth={pathname === '/pedidos' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1 tracking-wide">Pedidos</span>
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className={`flex flex-col items-center gap-1 transition-colors duration-300 relative ${menuOpen ? 'text-[var(--color-brand-text)]' : 'text-gray-400'}`}>
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2} />}
            <span className="text-[10px] font-bold mt-1 tracking-wide">Menu</span>
          </button>
        </div>
      </div>

      {/* Slide Up Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-brand-text)]/10 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div className="absolute bottom-24 right-4 bg-white rounded-3xl p-3 shadow-2xl border border-gray-100 flex flex-col gap-1 min-w-[200px] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => { setMenuOpen(false); router.push('/perfil'); }}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-sm text-[var(--color-brand-text)]"
            >
              <User size={18} className="text-[var(--color-brand-tertiary)]" /> Meu Perfil
            </button>
            <button 
              onClick={() => { setMenuOpen(false); router.push('/boletos'); }}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-sm text-[var(--color-brand-text)]"
            >
              <CreditCard size={18} className="text-[var(--color-brand-accent)]" /> Boletos
            </button>
            <button 
              onClick={() => { setMenuOpen(false); router.push('/suporte'); }}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors font-bold text-sm text-[var(--color-brand-text)]"
            >
              <Phone size={18} className="text-green-500" /> Suporte 24h
            </button>
          </div>
        </div>
      )}
    </>
  );
}
