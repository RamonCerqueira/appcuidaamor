'use client';

import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotificationDot?: boolean;
  userInitials?: string;
}

export default function Header({ title, subtitle = "Família Silva", showNotificationDot = true, userInitials = "U" }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="w-full bg-gradient-to-r from-pink-100/95 via-white/95 to-pink-300/95 backdrop-blur-xl px-6 pt-12 pb-5 flex items-center justify-between shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] sticky top-0 z-50 border-b border-pink-100/60 relative rounded-b-4xl">
      <div className="flex flex-col relative z-10">
        <span className="text-[10px] font-bold text-[var(--color-brand-secondary)] uppercase tracking-wider mb-0.5">{subtitle}</span>
        <h1 className="text-2xl font-extrabold text-[var(--color-brand-text)] leading-none tracking-tight">{title}</h1>
      </div>
     
      <div className="flex items-center gap-3 relative z-10">
        <button 
          onClick={() => router.push('/notificacoes')}
          className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center relative transition-transform active:scale-95 border border-pink-100 hover:bg-white"
        >
          <Bell size={20} className="text-[var(--color-brand-primary)]" />
          {showNotificationDot && (
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--color-brand-secondary)] border border-white" />
          )}
        </button>
        
        <button 
          onClick={() => router.push('/perfil')}
          className="w-10 h-10 rounded-full bg-[var(--color-brand-tertiary)] flex items-center justify-center border-2 border-white shadow-md active:scale-95 transition-transform"
        >
          <span className="font-bold text-sm text-white">{userInitials}</span>
        </button>
      </div>
    </header>
  );
}
