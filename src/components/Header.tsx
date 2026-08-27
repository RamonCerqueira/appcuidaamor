'use client';

import React, { useState } from 'react';
import { Bell, ArrowLeft, Search, PhoneCall } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar } from './ui/Avatar';
import { BuscaGlobal } from './shared/BuscaGlobal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNotificationDot?: boolean;
  showSearch?: boolean;
  userInitials?: string;
  userName?: string;
}

export default function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  showNotificationDot = true,
  showSearch = true,
  userInitials = 'FS',
  userName = 'Responsável',
}: HeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-xl px-5 pt-8 pb-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              aria-label="Voltar"
              className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center justify-center border border-slate-200/60 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
          )}
          <div className="flex flex-col">
            {subtitle && (
              <span className="text-[10px] font-extrabold text-[var(--color-brand-secondary)] uppercase tracking-widest mb-0.5">
                {subtitle}
              </span>
            )}
            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar no aplicativo"
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-pink-50/60 flex items-center justify-center transition-all active:scale-95 border border-slate-100 hover:border-pink-100 text-slate-600 hover:text-[var(--color-brand-primary)] cursor-pointer"
            >
              <Search size={16} />
            </button>
          )}

          <button
            onClick={() => router.push('/notificacoes')}
            aria-label="Notificações"
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-pink-50/60 flex items-center justify-center relative transition-all active:scale-95 border border-slate-100 hover:border-pink-100 cursor-pointer"
          >
            <Bell size={16} className="text-slate-600 hover:text-[var(--color-brand-primary)] transition-colors" />
            {showNotificationDot && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-brand-primary)] ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={() => router.push('/perfil')}
            aria-label="Perfil"
            className="active:scale-95 transition-transform cursor-pointer ml-0.5"
          >
            <Avatar name={userName} size="sm" variant="pink" />
          </button>
        </div>
      </header>

      <BuscaGlobal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
