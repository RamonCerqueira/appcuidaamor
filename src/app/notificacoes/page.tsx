'use client';

import Header from '@/components/Header';
import { BellRing, CreditCard, CalendarClock, ShieldAlert } from 'lucide-react';

export default function Notificacoes() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Notificações" showNotificationDot={false} />

      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        
        <section className="flex flex-col gap-3">
          <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase ml-1">Hoje</h3>
          
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex gap-4 items-start relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-brand-accent)]" />
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-accent)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard size={20} className="text-[var(--color-brand-accent)]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">Boleto disponível</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 leading-relaxed">
                  O boleto referente aos serviços de Maio/2025 já está disponível para pagamento.
                </p>
                <span className="text-[10px] font-semibold text-gray-400 mt-2">Há 2 horas</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex gap-4 items-start relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-brand-secondary)]" />
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-secondary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <CalendarClock size={20} className="text-[var(--color-brand-secondary)]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">Alteração de Escala</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 leading-relaxed">
                  A cuidadora Ana Souza confirmou o plantão de amanhã (21/05) às 07:00.
                </p>
                <span className="text-[10px] font-semibold text-gray-400 mt-2">Há 5 horas</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 mt-4">
          <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase ml-1">Ontem</h3>
          
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex gap-4 items-start relative overflow-hidden opacity-70">
              <div className="w-10 h-10 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert size={20} className="text-[var(--color-brand-primary)]" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">Aviso da Agência</h4>
                <p className="text-xs text-[var(--color-brand-text-light)] mt-1 leading-relaxed">
                  Lembramos que o recesso de fim de ano já pode ter as escalas pré-agendadas pelo app.
                </p>
                <span className="text-[10px] font-semibold text-gray-400 mt-2">19 Mai 2025</span>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
