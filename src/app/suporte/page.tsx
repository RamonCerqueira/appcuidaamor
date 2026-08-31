'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Clock,
  Ambulance,
  Flame,
  Shield,
  HeartHandshake,
  AlertTriangle,
  FileHeart,
} from 'lucide-react';

export default function Suporte() {
  const phone = '7135069426';
  const email = 'atendimento@cuidaeamor.com.br';
  const whatsappUrl = 'https://wa.me/557135069426';

  const [faqAberta, setFaqAberta] = useState<number | null>(null);

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = (numero: string) => {
    window.open(`tel:${numero}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${email}`, '_self');
  };

  const faqs = [
    {
      q: 'Como solicitar uma substituição ou folga de cuidador(a)?',
      a: 'Você pode solicitar diretamente na aba "Pedidos" no menu inferior. Nossa equipe de coordenação recebe sua solicitação e confirma a escala em até 24 horas.',
    },
    {
      q: 'Onde vejo os remédios e horários administrados?',
      a: 'No menu "Saúde", acesse o Prontuário Médico. Lá você encontra a lista de medicamentos ativos, dosagens e horários prescritos.',
    },
    {
      q: 'O que fazer em caso de intercorrência clínica ou mal-estar?',
      a: 'Nossa cuidadora é orientada a acionar imediatamente o SAMU (192) e o Plantão 24h da Cuida e Amor. Você também pode acionar os números de emergência rápida abaixo.',
    },
    {
      q: 'Como funciona a cobrança e emissão de boletos?',
      a: 'As faturas mensais ficam disponíveis na aba "Financeiro" em "Mais Opções", com opção de copiar linha digitável e histórico de pagamentos.',
    },
  ];

  const contatosEmergencia = [
    {
      nome: 'SAMU — Emergência Médica',
      numero: '192',
      descricao: 'Urgências clínicas, falta de ar, AVC, infarto e quedas graves',
      icon: Ambulance,
      cor: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeCor: 'bg-rose-100 text-rose-800',
    },
    {
      nome: 'Plantão Cuida e Amor 24h',
      numero: '7135069426',
      descricao: 'Coordenação e supervisão de enfermagem da sua equipe',
      icon: HeartHandshake,
      cor: 'bg-pink-50 border-pink-200 text-[var(--color-brand-primary)]',
      badgeCor: 'bg-pink-100 text-pink-800',
    },
    {
      nome: 'Corpo de Bombeiros',
      numero: '193',
      descricao: 'Resgate domiciliar, traumas, desmaios e contenção',
      icon: Flame,
      cor: 'bg-orange-50 border-orange-200 text-orange-700',
      badgeCor: 'bg-orange-100 text-orange-800',
    },
    {
      nome: 'Polícia Militar',
      numero: '190',
      descricao: 'Segurança domiciliar e ocorrências no perímetro',
      icon: Shield,
      cor: 'bg-blue-50 border-blue-200 text-blue-700',
      badgeCor: 'bg-blue-100 text-blue-800',
    },
    {
      nome: 'Disque 100 — Proteção ao Idoso',
      numero: '100',
      descricao: 'Central Nacional de Direitos Humanos e Apoio à Pessoa Idosa',
      icon: ShieldCheck,
      cor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badgeCor: 'bg-emerald-100 text-emerald-800',
    },
    {
      nome: 'CIATOX — Intoxicações e Medicamentos',
      numero: '08007226001',
      descricao: 'Orientações toxicológicas sobre reações e superdosagens',
      icon: AlertTriangle,
      cor: 'bg-amber-50 border-amber-200 text-amber-700',
      badgeCor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-36">
      <Header title="Central de Ajuda" subtitle="Suporte e Emergência" showBack />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-6">
        {/* Banner de Acolhimento */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 p-2.5 shadow-xs">
            <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              Como podemos te ajudar hoje?
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[300px] mt-1">
              Supervisão técnica de enfermagem e coordenação do cuidado 24h para você e seu familiar.
            </p>
          </div>
        </section>

        {/* 1. SEÇÃO DE EMERGÊNCIA E PROTEÇÃO À SAÚDE */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-rose-600" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
                Emergência & Proteção à Saúde
              </span>
            </div>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full uppercase">
              Discagem Rápida
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {contatosEmergencia.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleCall(item.numero)}
                  className={`rounded-3xl p-4 border transition-all text-left flex items-center justify-between active:scale-[0.99] group cursor-pointer ${item.cor}`}
                >
                  <div className="flex items-center gap-3.5 pr-2">
                    <div className="w-11 h-11 rounded-2xl bg-white/90 shadow-2xs border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black tracking-tight">
                          {item.nome}
                        </h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full ${item.badgeCor}`}>
                          {item.numero}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-85 font-medium leading-relaxed mt-0.5">
                        {item.descricao}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shrink-0 shadow-2xs group-hover:translate-x-0.5 transition-transform">
                    <Phone size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. CANAIS DIRETOS DA CUIDA E AMOR */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Canais de Atendimento Cuida e Amor
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
                    Atendimento em tempo real
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Ligação Telefônica */}
            <button
              onClick={() => handleCall(phone)}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between hover:border-cyan-200 transition-all text-left group cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform shrink-0">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight">
                    Central Telefônica Direta
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
                    E-mail Oficial da Empresa
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

        {/* 3. PERGUNTAS FREQUENTES (FAQ) */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Dúvidas Frequentes da Família
          </span>

          <div className="flex flex-col gap-2">
            {faqs.map((faq, idx) => {
              const aberta = faqAberta === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setFaqAberta(aberta ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      {faq.q}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-slate-400 shrink-0 transition-transform ${
                        aberta ? 'rotate-90 text-[var(--color-brand-primary)]' : ''
                      }`}
                    />
                  </button>

                  {aberta && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. ENDEREÇO DA SEDE */}
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
