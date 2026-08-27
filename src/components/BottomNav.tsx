'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Activity,
  Calendar,
  ClipboardList,
  Menu,
  CreditCard,
  Bell,
  User,
  Headphones,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { BottomSheet } from './ui/BottomSheet';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const hideOnPaths = [
    '/login',
    '/esqueci-senha',
    '/verificacao',
    '/nova-senha',
    '/splash',
    '/onboarding',
  ];

  if (hideOnPaths.includes(pathname)) return null;

  const isActive = (path: string) => pathname === path;

  const handleNavigate = (path: string) => {
    setMoreMenuOpen(false);
    router.push(path);
  };

  const navItems = [
    {
      label: 'Início',
      path: '/',
      icon: Home,
    },
    {
      label: 'Saúde',
      path: '/quadro',
      icon: Activity,
    },
    {
      label: 'Escala',
      path: '/escala',
      icon: Calendar,
    },
    {
      label: 'Pedidos',
      path: '/pedidos',
      icon: ClipboardList,
    },
  ];

  const isMoreActive = [
    '/boletos',
    '/notificacoes',
    '/perfil',
    '/suporte',
    '/documentos',
  ].includes(pathname);

  return (
    <>
      <nav
        aria-label="Navegação Principal"
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pb-safe"
      >
        <div className="flex items-center justify-around px-2 py-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMoreMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-all duration-200 cursor-pointer ${
                  active
                    ? 'text-[var(--color-brand-primary)] font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 1.75}
                    className="transition-transform"
                  />
                  {active && (
                    <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[var(--color-brand-primary)]" />
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* Botão Mais */}
          <button
            onClick={() => setMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 w-16 py-1 transition-all duration-200 cursor-pointer ${
              isMoreActive
                ? 'text-[var(--color-brand-primary)] font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <Menu
                size={22}
                strokeWidth={isMoreActive ? 2.5 : 1.75}
              />
              {isMoreActive && (
                <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[var(--color-brand-primary)]" />
              )}
            </div>
            <span className="text-[10px] tracking-tight">Mais</span>
          </button>
        </div>
      </nav>

      {/* Menu "Mais Opções" BottomSheet */}
      <BottomSheet
        isOpen={moreMenuOpen}
        onClose={() => setMoreMenuOpen(false)}
        title="Mais Opções"
      >
        <div className="grid grid-cols-1 gap-2 pt-1">
          <button
            onClick={() => handleNavigate('/boletos')}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60 group-hover:scale-105 transition-transform">
                <CreditCard size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Financeiro & Boletos</span>
                <span className="text-xs text-slate-500 font-medium">Faturas em aberto e histórico</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('/documentos')}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 group-hover:scale-105 transition-transform">
                <FileText size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Documentos Digitais</span>
                <span className="text-xs text-slate-500 font-medium">Contrato, relatórios e recibos</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('/notificacoes')}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/60 group-hover:scale-105 transition-transform">
                <Bell size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Notificações</span>
                <span className="text-xs text-slate-500 font-medium">Avisos e comunicados importantes</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('/perfil')}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100/60 group-hover:scale-105 transition-transform">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Minha Conta</span>
                <span className="text-xs text-slate-500 font-medium">Dados cadastrais e paciente</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('/suporte')}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-100 hover:border-pink-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 group-hover:scale-105 transition-transform">
                <Headphones size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Central de Ajuda</span>
                <span className="text-xs text-slate-500 font-medium">WhatsApp, ligação e emergência</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
