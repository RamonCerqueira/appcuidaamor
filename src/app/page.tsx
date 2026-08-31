'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import {
  Activity,
  Calendar,
  CreditCard,
  ClipboardList,
  PhoneCall,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  FileText,
  Bell,
  HeartHandshake,
  CalendarCheck,
} from 'lucide-react';
import { MeuFamiliarAgora } from '@/components/shared/MeuFamiliarAgora';
import { TimelineCuidado } from '@/components/shared/TimelineCuidado';
import { ConfirmacaoFamiliar } from '@/components/shared/ConfirmacaoFamiliar';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/dashboard').then((res) => res.json()).catch(() => ({})),
      fetch('/api/notificacoes').then((res) => res.json()).catch(() => ({})),
    ])
      .then(([dashJson, notifJson]) => {
        if (dashJson?.sucesso) {
          setData(dashJson);
        }
        if (notifJson?.sucesso && Array.isArray(notifJson.notificacoes)) {
          setNotificacoes(notifJson.notificacoes.slice(0, 2));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
        <Header title="Visão Geral" subtitle="Carregando..." />
        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <div className="grid grid-cols-2 gap-3.5">
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  const responsavel =
    data?.responsavel?.Cliente || data?.responsavel?.Razao || 'Família Silva';
  const paciente = data?.paciente;
  const cuidador = data?.cuidadorHoje;
  const boletosPendentes = data?.notificacoes?.boletosPendentes || 0;
  const scoreVitalidade: number = data?.scoreVitalidade ?? 86;
  const ultimaEvolucao: string = data?.ultimaEvolucao ?? 'Sem registro recente';

  const primeiroNome = responsavel.split(' ')[0];
  const userInitials = responsavel
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FS';

  return (
    <div className="relative flex flex-col min-h-screen bg-transparent w-full pb-36 overflow-x-hidden">

      <div className="relative z-10">
        <Header
          title="Visão Geral"
          subtitle={`Olá, ${primeiroNome}`}
          userInitials={userInitials}
          userName={responsavel}
          showSearch
          showNotificationDot={notificacoes.length > 0}
        />
      </div>

      <main className="flex-1 px-5 pt-4 flex flex-col gap-5 relative z-10">
        {/* 1. "Meu Familiar Agora" (Visão Unificada de Alta Prioridade) */}
        <MeuFamiliarAgora
          paciente={paciente}
          cuidador={cuidador}
          scoreVitalidade={scoreVitalidade}
          ultimaAtualizacao={ultimaEvolucao}
        />

        {/* 2. Grid de Acesso Rápido (4 Botões em 1 Única Linha - Antes do Diário) */}
        <section className="flex flex-col gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Acesso Rápido
          </span>

          <div className="grid grid-cols-4 gap-2.5">
            {/* Saúde */}
            <Link
              href="/quadro"
              className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-xs hover:border-pink-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 group-hover:scale-105 transition-transform shadow-xs">
                <Activity size={20} strokeWidth={2.25} />
              </div>
              <span className="text-[11px] font-black text-slate-800 tracking-tight">
                Saúde
              </span>
            </Link>

            {/* Escala */}
            <Link
              href="/escala"
              className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-xs hover:border-cyan-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform shadow-xs">
                <Calendar size={20} strokeWidth={2.25} />
              </div>
              <span className="text-[11px] font-black text-slate-800 tracking-tight">
                Escala
              </span>
            </Link>

            {/* Financeiro */}
            <Link
              href="/boletos"
              className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-xs hover:border-amber-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group text-center relative"
            >
              {boletosPendentes > 0 && (
                <span className="absolute 1 -top-1 -right-1 w-5 h-5 bg-amber-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {boletosPendentes}
                </span>
              )}
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform shadow-xs">
                <CreditCard size={20} strokeWidth={2.25} />
              </div>
              <span className="text-[11px] font-black text-slate-800 tracking-tight">
                Financeiro
              </span>
            </Link>

            {/* Solicitações / Pedidos */}
            <Link
              href="/pedidos"
              className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-xs hover:border-emerald-200 active:scale-95 transition-all flex flex-col items-center justify-center gap-2 group text-center"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform shadow-xs">
                <ClipboardList size={20} strokeWidth={2.25} />
              </div>
              <span className="text-[11px] font-black text-slate-800 tracking-tight">
                Pedidos
              </span>
            </Link>
          </div>
        </section>

        {/* 3. Diário / Timeline do Cuidado de Hoje */}
        <TimelineCuidado />

        {/* 4. Confirmação Familiar ("Está tudo bem?") */}
        <ConfirmacaoFamiliar />

        {/* 5. Últimos Comunicados & Notificações */}
        {notificacoes.length > 0 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Últimos Comunicados
              </span>
              <Link
                href="/notificacoes"
                className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline flex items-center gap-0.5"
              >
                <span>Ver todos</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {notificacoes.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs hover:border-pink-100 transition-all flex items-center gap-3 active:scale-[0.99]"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 border border-pink-100">
                    <Bell size={16} />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h5 className="text-xs font-extrabold text-slate-800 truncate">
                      {item.titulo}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {item.descricao}
                    </p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 6. Central de Contato & Emergência Rápida */}
        <section className="bg-slate-900 rounded-3xl p-5 text-white flex flex-col gap-3 shadow-lg shadow-slate-900/10 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-[var(--color-brand-primary-light)] flex items-center justify-center border border-pink-500/30">
                <PhoneCall size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-white">
                  Rede de Apoio e Emergência
                </span>
                <span className="text-[10px] text-slate-400">
                  Plantão 24 horas da coordenação
                </span>
              </div>
            </div>

            <Link
              href="/suporte"
              className="text-xs font-bold text-[var(--color-brand-primary-light)] hover:underline"
            >
              Ver contatos
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <a
              href="https://wa.me/557135069426"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/10 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>WhatsApp Equipe</span>
            </a>

            <a
              href="tel:192"
              className="py-2.5 px-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-2xl border border-rose-500/30 text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>SAMU 192</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
