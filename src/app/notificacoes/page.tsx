'use client';

import React from 'react';
import Header from '@/components/Header';
import {
  CreditCard,
  CalendarCheck,
  ShieldAlert,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function Notificacoes() {
  const notificacoes = [
    {
      id: 1,
      tipo: 'financeiro',
      titulo: 'Fatura Mensal Disponível',
      descricao: 'A fatura referente aos serviços prestados já está disponível para consulta e quitação.',
      horario: 'Há 2 horas',
      link: '/boletos',
      lida: false,
    },
    {
      id: 2,
      tipo: 'escala',
      titulo: 'Escala Confirmada',
      descricao: 'O plantão da cuidadora Ana Paula foi confirmado para amanhã às 07:00.',
      horario: 'Há 5 horas',
      link: '/escala',
      lida: false,
    },
    {
      id: 3,
      tipo: 'geral',
      titulo: 'Boletim de Saúde Mensal',
      descricao: 'A avaliação médica mensal do paciente foi registrada e atualizada no prontuário.',
      horario: 'Ontem às 16:30',
      link: '/quadro',
      lida: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header
        title="Notificações"
        subtitle="Comunicados"
        showBack
        showNotificationDot={false}
      />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
            Recentes
          </span>
          <span className="text-xs font-bold text-[var(--color-brand-primary)]">
            3 comunicados
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {notificacoes.map((item) => {
            const isFin = item.tipo === 'financeiro';
            const isEsc = item.tipo === 'escala';

            const icon = isFin ? (
              <CreditCard size={20} className="text-amber-600" />
            ) : isEsc ? (
              <CalendarCheck size={20} className="text-cyan-600" />
            ) : (
              <Sparkles size={20} className="text-[var(--color-brand-primary)]" />
            );

            const iconBg = isFin
              ? 'bg-amber-50 border-amber-100'
              : isEsc
              ? 'bg-cyan-50 border-cyan-100'
              : 'bg-pink-50 border-pink-100';

            return (
              <Link
                key={item.id}
                href={item.link}
                className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-start gap-3.5 hover:border-pink-100 active:scale-[0.99] transition-all relative overflow-hidden group"
              >
                {!item.lida && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color-brand-primary)]" />
                )}

                <div
                  className={`w-11 h-11 rounded-2xl ${iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5`}
                >
                  {icon}
                </div>

                <div className="flex flex-col flex-1 pr-3">
                  <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug">
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {item.descricao}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-2">
                    <Clock size={11} />
                    <span>{item.horario}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
