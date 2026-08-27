'use client';

import React from 'react';
import {
  Heart,
  Clock,
  UserCheck,
  ShieldCheck,
  Activity,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface MeuFamiliarAgoraProps {
  paciente: any;
  cuidador: any;
  scoreVitalidade?: number;
  ultimaAtualizacao?: string;
  onVerQuadro?: () => void;
}

export function MeuFamiliarAgora({
  paciente,
  cuidador,
  scoreVitalidade = 86,
  ultimaAtualizacao = 'Hoje às 14:30',
  onVerQuadro,
}: MeuFamiliarAgoraProps) {
  const nomePaciente = paciente
    ? paciente.Cliente || paciente.Razao
    : 'Paciente Assistido';

  return (
    <section className="bg-gradient-to-br from-white via-white to-pink-50/50 rounded-3xl p-5 border border-pink-100/80 shadow-[0_6px_24px_-4px_rgba(224,66,140,0.07)] flex flex-col gap-4 relative overflow-hidden">
      {/* Luz ambiente sutil */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Paciente */}
      <div className="flex items-center justify-between border-b border-pink-100/60 pb-3.5 relative z-10">
        <div className="flex items-center gap-3">
          <Avatar
            src={paciente?.Caminho}
            name={nomePaciente}
            size="lg"
            variant="pink"
            active
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand-secondary)]">
              Meu Familiar Agora
            </span>
            <h2 className="text-base font-black text-slate-800 tracking-tight leading-snug">
              {nomePaciente}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[var(--color-brand-primary)] font-bold">
              <Heart size={12} fill="currentColor" />
              <span>Assistência Ativa em Domicílio</span>
            </div>
          </div>
        </div>

        <Link
          href="/quadro"
          className="flex flex-col items-end group p-1.5 hover:bg-pink-50 rounded-2xl transition-colors shrink-0"
        >
          <div className="flex items-center gap-1 bg-pink-50 border border-pink-100/80 px-2.5 py-1 rounded-full text-[var(--color-brand-primary)]">
            <Activity size={12} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black">{scoreVitalidade}%</span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 mt-0.5">Vitalidade</span>
        </Link>
      </div>

      {/* Cuidado Agora: Quem está no plantão */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col gap-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <UserCheck size={13} className="text-emerald-500" />
            Quem está cuidando agora
          </span>
          <StatusBadge status={cuidador ? 'Em Plantão' : 'Escala Regular'} pulse />
        </div>

        {cuidador ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={cuidador.Nome} size="md" variant="teal" />
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  {cuidador.Nome}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                  <Clock size={12} className="text-[var(--color-brand-secondary)]" />
                  <span>
                    Turno: {cuidador.HoraInicio} às {cuidador.HoraSaida}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/escala"
              className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline flex items-center gap-0.5"
            >
              Escala <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Calendar size={15} className="text-slate-400" />
              <span>Plantão regular em andamento conforme escala.</span>
            </div>
            <Link
              href="/escala"
              className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline"
            >
              Ver
            </Link>
          </div>
        )}

        {/* Linha do Próximo Evento / Última Atualização */}
        <div className="flex items-center justify-between border-t border-slate-100/80 pt-2.5 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1">
            <Sparkles size={12} className="text-[var(--color-brand-primary)]" />
            <span>Última atualização: {ultimaAtualizacao}</span>
          </div>

          <span className="font-bold text-slate-700">
            Troca prevista: {cuidador?.HoraSaida || '19:00'}
          </span>
        </div>
      </div>
    </section>
  );
}
