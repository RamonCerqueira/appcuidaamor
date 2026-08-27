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
} from 'lucide-react';
import { MeuFamiliarAgora } from '@/components/shared/MeuFamiliarAgora';
import { TimelineCuidado } from '@/components/shared/TimelineCuidado';
import { ConfirmacaoFamiliar } from '@/components/shared/ConfirmacaoFamiliar';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          setData(json);
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

  const primeiroNome = responsavel.split(' ')[0];
  const userInitials = responsavel
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FS';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header
        title="Visão Geral"
        subtitle={`Olá, ${primeiroNome}`}
        userInitials={userInitials}
        userName={responsavel}
        showSearch
      />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* 1. "Meu Familiar Agora" (Visão Unificada de Alta Prioridade) */}
        <MeuFamiliarAgora
          paciente={paciente}
          cuidador={cuidador}
          scoreVitalidade={86}
          ultimaAtualizacao="Hoje às 14:30"
        />

        {/* 2. Diário / Timeline do Cuidado de Hoje */}
        <TimelineCuidado />

        {/* 3. Confirmação Familiar ("Está tudo bem?") */}
        <ConfirmacaoFamiliar />

        {/* 4. Grid de Acesso Rápido aos 4 Módulos Centrais */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Acesso Rápido
          </span>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Saúde */}
            <Link
              href="/quadro"
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs hover:border-pink-200 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 group-hover:scale-105 transition-transform">
                <Activity size={20} strokeWidth={2.25} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Saúde
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Prontuário e remédios
                </p>
              </div>
            </Link>

            {/* Escala */}
            <Link
              href="/escala"
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs hover:border-cyan-200 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform">
                <Calendar size={20} strokeWidth={2.25} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Escala
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Plantões e turnos
                </p>
              </div>
            </Link>

            {/* Financeiro */}
            <Link
              href="/boletos"
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs hover:border-amber-200 transition-all flex flex-col justify-between h-32 group relative"
            >
              {boletosPendentes > 0 && (
                <span className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-amber-500 text-white font-extrabold text-[9px] rounded-full uppercase tracking-wider">
                  {boletosPendentes} pendente
                </span>
              )}
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <CreditCard size={20} strokeWidth={2.25} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Financeiro
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  {boletosPendentes > 0 ? 'Fatura em aberto' : 'Tudo em dia'}
                </p>
              </div>
            </Link>

            {/* Pedidos */}
            <Link
              href="/pedidos"
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs hover:border-emerald-200 transition-all flex flex-col justify-between h-32 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <ClipboardList size={20} strokeWidth={2.25} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Solicitações
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Folgas e trocas
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* 5. Central de Contato & Emergência Rápida */}
        <section className="bg-slate-900 rounded-3xl p-5 text-white flex flex-col gap-3 shadow-lg shadow-slate-900/10">
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
