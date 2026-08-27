'use client';

import React from 'react';

export type StatusType = 
  | 'ACEITO' 
  | 'RECUSADO' 
  | 'Em Análise' 
  | 'EM ANÁLISE'
  | 'CONFIRMADO' 
  | 'Confirmado'
  | 'AGENDADO' 
  | 'Agendado'
  | 'PAGO' 
  | 'Pago'
  | 'ABERTO' 
  | 'Aberto'
  | 'ATIVO' 
  | 'Ativo'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function StatusBadge({ status, size = 'sm', pulse = false }: StatusBadgeProps) {
  const norm = (status || '').toUpperCase();

  let colors = 'bg-slate-100 text-slate-600 border-slate-200';
  let dotColor = 'bg-slate-400';

  if (norm === 'ACEITO' || norm === 'PAGO' || norm === 'ATIVO' || norm === 'CONFIRMADO') {
    colors = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    dotColor = 'bg-emerald-500';
  } else if (norm === 'RECUSADO' || norm === 'CANCELADO' || norm === 'ATRASADO') {
    colors = 'bg-rose-50 text-rose-700 border-rose-200/60';
    dotColor = 'bg-rose-500';
  } else if (norm === 'EM ANÁLISE' || norm === 'EM ANALISE' || norm === 'PENDENTE' || norm === 'ABERTO') {
    colors = 'bg-amber-50 text-amber-700 border-amber-200/60';
    dotColor = 'bg-amber-500';
  } else if (norm === 'AGENDADO' || norm === 'EM PLANTÃO' || norm === 'EM PLANTAO') {
    colors = 'bg-cyan-50 text-cyan-700 border-cyan-200/60';
    dotColor = 'bg-cyan-500';
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] font-extrabold px-2.5 py-0.5 tracking-wider' 
    : 'text-xs font-extrabold px-3 py-1 tracking-wider';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border uppercase ${colors} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}
