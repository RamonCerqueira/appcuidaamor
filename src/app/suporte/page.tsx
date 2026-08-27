'use client';

import React from 'react';
import Header from '@/components/Header';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
} from 'lucide-react';

export default function Suporte() {
  const phone = '7135069426';
  const email = 'atendimento@cuidaeamor.com.br';
  const whatsappUrl = 'https://wa.me/557135069426';

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header title="Central de Ajuda" subtitle="Suporte Cuida e Amor" showBack />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Banner de Acolhimento */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 p-2.5 shadow-xs">
            <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              Como podemos te ajudar hoje?
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[280px] mt-1">
              Nossa equipe de coordenação e enfermagem está à sua disposição.
            </p>
          </div>
        </section>

        {/* Canais Diretos de Atendimento */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Canais de Atendimento
          </span>

          <div className="flex flex-col gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between hover:border-emerald-200 transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">
                    WhatsApp da Coordenação
                  </h4>
                  <span className="text-xs text-emerald-600 font-bold mt-0.5">
                    Atendimento Rápido (em até 5 min)
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Ligação Telefônica */}
            <button
              onClick={handleCall}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between hover:border-cyan-200 transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform shrink-0">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">
                    Central Telefônica
                  </h4>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    (71) 3506-9426
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* E-mail */}
            <button
              onClick={handleEmail}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between hover:border-slate-300 transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 group-hover:scale-105 transition-transform shrink-0">
                  <Mail size={24} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">
                    E-mail Oficial
                  </h4>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    atendimento@cuidaeamor.com.br
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Endereço da Matriz */}
        <section className="bg-gradient-to-br from-pink-50/60 to-slate-50 rounded-3xl p-5 border border-pink-100/70 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-brand-primary)]">
              Sede Administrativa
            </span>
            <h4 className="text-xs font-black text-slate-800 mt-0.5">
              Matriz Salvador — Bahia
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
              Av. Tancredo Neves, Edifício Empresarial Salvador Trade Center. Salvador - BA.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
