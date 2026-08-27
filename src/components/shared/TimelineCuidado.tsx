'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Utensils,
  Pill,
  PersonStanding,
  Activity,
  Clock,
  ChevronRight,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import Link from 'next/link';

interface TimelineEvent {
  hora: string;
  tipo: 'plantao' | 'remedio' | 'comida' | 'atividade' | 'saude' | 'troca';
  titulo: string;
  detalhe?: string;
  concluido: boolean;
}

export function TimelineCuidado() {
  const eventos: TimelineEvent[] = [
    {
      hora: '07:00',
      tipo: 'plantao',
      titulo: 'Plantão Iniciado',
      detalhe: 'Check-in confirmado da cuidadora no domicílio.',
      concluido: true,
    },
    {
      hora: '08:30',
      tipo: 'remedio',
      titulo: 'Medicamentos Matinais',
      detalhe: 'Anti-hipertensivo administrado conforme prescrição.',
      concluido: true,
    },
    {
      hora: '10:15',
      tipo: 'atividade',
      titulo: 'Atividade & Mobilidade',
      detalhe: 'Caminhada assistida no jardim com boa disposição.',
      concluido: true,
    },
    {
      hora: '12:20',
      tipo: 'comida',
      titulo: 'Almoço & Hidratação',
      detalhe: 'Refeição completa com boa aceitação hídrica.',
      concluido: true,
    },
    {
      hora: '14:30',
      tipo: 'saude',
      titulo: 'Avaliação de Sinais e Vitalidade',
      detalhe: 'Score de 86% — Sinais estáveis e confortável.',
      concluido: true,
    },
    {
      hora: '19:00',
      tipo: 'troca',
      titulo: 'Próxima Troca de Cuidadora',
      detalhe: 'Passagem de plantão noturno agendada.',
      concluido: false,
    },
  ];

  const getIcon = (tipo: TimelineEvent['tipo']) => {
    switch (tipo) {
      case 'plantao':
        return <CalendarCheck size={16} className="text-emerald-600" />;
      case 'remedio':
        return <Pill size={16} className="text-[var(--color-brand-primary)]" />;
      case 'comida':
        return <Utensils size={16} className="text-amber-600" />;
      case 'atividade':
        return <PersonStanding size={16} className="text-blue-600" />;
      case 'saude':
        return <Activity size={16} className="text-emerald-600" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  const getBgColor = (tipo: TimelineEvent['tipo'], concluido: boolean) => {
    if (!concluido) return 'bg-slate-100 border-slate-200 text-slate-400';
    switch (tipo) {
      case 'plantao':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      case 'remedio':
        return 'bg-pink-50 border-pink-200 text-[var(--color-brand-primary)]';
      case 'comida':
        return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'atividade':
        return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'saude':
        return 'bg-emerald-50 border-emerald-200 text-emerald-600';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  return (
    <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
      {/* Header do Diário */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100">
            <Sparkles size={16} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-slate-800 tracking-tight">
              Diário do Cuidado
            </h3>
            <span className="text-[10px] font-bold text-slate-400">
              Linha do tempo de hoje
            </span>
          </div>
        </div>

        <Link
          href="/quadro"
          className="text-xs font-bold text-[var(--color-brand-secondary)] hover:underline flex items-center gap-0.5"
        >
          Ver prontuário <ChevronRight size={13} />
        </Link>
      </div>

      {/* Itens da Linha do Tempo */}
      <div className="relative pl-6 flex flex-col gap-4 my-1">
        {/* Linha vertical conectora */}
        <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-150 bg-slate-200 rounded-full" />

        {eventos.map((evt, idx) => (
          <div key={idx} className="relative flex items-start gap-3.5 group">
            {/* Ícone no Nó da Linha */}
            <div
              className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                evt.concluido
                  ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                  : 'border-slate-300 text-slate-300'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  evt.concluido ? 'bg-[var(--color-brand-primary)]' : 'bg-transparent'
                }`}
              />
            </div>

            {/* Conteúdo do Evento */}
            <div className="flex flex-col flex-1 bg-slate-50/70 p-3 rounded-2xl border border-slate-100/90 group-hover:border-pink-100 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${getBgColor(
                      evt.tipo,
                      evt.concluido
                    )}`}
                  >
                    {getIcon(evt.tipo)}
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {evt.titulo}
                  </h4>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-2xs">
                  {evt.hora}
                </span>
              </div>

              {evt.detalhe && (
                <p className="text-[11px] text-slate-500 font-medium mt-1.5 leading-relaxed pl-8">
                  {evt.detalhe}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
