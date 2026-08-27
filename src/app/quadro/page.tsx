'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  Pill,
  Utensils,
  PersonStanding,
  Brain,
  ClipboardEdit,
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function Quadro() {
  const [fichas, setFichas] = useState<any[]>([]);
  const [fichaAtual, setFichaAtual] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quadro')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso && json.fichas && json.fichas.length > 0) {
          setFichas(json.fichas);
          setFichaAtual(json.fichas[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
        <Header title="Quadro de Saúde" showBack />
        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </main>
      </div>
    );
  }

  const ultimaAtt = fichaAtual?.DataCriacao
    ? new Date(fichaAtual.DataCriacao).toLocaleDateString('pt-BR')
    : 'Sem registro';
  const medicamentosAtuais = fichaAtual?.FichaAnamnese_Medicamento || [];
  const historicoFichas = fichas.slice(1);

  // Gráfico Vetorial de Vitalidade
  const ScoreChart = ({ fichasArray }: { fichasArray: any[] }) => {
    if (!fichasArray || fichasArray.length === 0) return null;

    const data = [...fichasArray]
      .slice(0, 6)
      .reverse()
      .map((f) => {
        const d = new Date(f.DataCriacao);
        return {
          label: d
            .toLocaleDateString('pt-BR', { month: 'short' })
            .replace('.', '')
            .toUpperCase(),
          score: f.ScoreSaude || 85,
        };
      });

    const lastScore = data[data.length - 1]?.score || 85;
    const prevScore = data.length > 1 ? data[data.length - 2]?.score : lastScore;
    const diff = lastScore - prevScore;
    const trend = diff >= 0 ? 'up' : 'down';

    const width = 300;
    const height = 90;
    const padding = 20;

    const getX = (i: number) =>
      data.length === 1
        ? width / 2
        : padding + (i * (width - 2 * padding)) / (data.length - 1);
    const getY = (score: number) =>
      height - padding - (score / 100) * (height - 2 * padding);

    const points = data.map((d, i) => `${getX(i)},${getY(d.score)}`).join(' ');
    const pathData = `M ${points}`;

    return (
      <section className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[#b52668] rounded-3xl p-5 text-white shadow-xl shadow-[var(--color-brand-primary)]/20 relative overflow-hidden">
        <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
              Score de Vitalidade
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-black tracking-tight">{lastScore}%</span>
              <span className="text-xs font-bold text-white/90">
                {lastScore >= 80 ? 'Condição Estável' : 'Requer Atenção'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-black">
            <TrendingUp size={14} />
            <span>
              {diff >= 0 ? `+${diff}` : diff} pts
            </span>
          </div>
        </div>

        {/* SVG Sparkline */}
        {data.length > 1 && (
          <div className="w-full flex justify-center mt-3 relative z-10">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible"
            >
              <path
                d={pathData}
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {data.map((d, i) => (
                <g key={i}>
                  <circle
                    cx={getX(i)}
                    cy={getY(d.score)}
                    r="4"
                    fill="#E0428C"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                  <text
                    x={getX(i)}
                    y={height}
                    fill="rgba(255,255,255,0.8)"
                    fontSize="9"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header title="Quadro de Saúde" subtitle="Prontuário" showBack />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Score de Vitalidade */}
        <ScoreChart fichasArray={fichas} />

        {/* Prontuário Médico Atual */}
        {fichaAtual ? (
          <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardEdit size={18} className="text-[var(--color-brand-primary)]" />
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                  Prontuário Atual
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Avaliado em: {ultimaAtt}
              </span>
            </div>

            {/* Medicamentos */}
            <div className="flex gap-3.5 items-start">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 border border-pink-100">
                <Pill size={20} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Medicamentos em Uso
                </span>
                <div className="flex flex-col gap-1.5 mt-1">
                  {medicamentosAtuais.length > 0 ? (
                    medicamentosAtuais.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/80 flex flex-col"
                      >
                        <span className="text-xs font-bold text-slate-800">
                          {m.Nome} ({m.Dose})
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Horários: {m.Horarios}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 font-medium">
                      Nenhum medicamento registrado nesta avaliação.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Alimentação e Intestino */}
            <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Utensils size={20} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Alimentação & Intestino
                </span>
                <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                  {fichaAtual?.FuncionamentoIntestinal || 'Funcionamento normal.'}
                </p>
                {fichaAtual?.Consistencia && (
                  <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Consistência: {fichaAtual.Consistencia}
                  </span>
                )}
              </div>
            </div>

            {/* Atividade Física */}
            <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center shrink-0 border border-cyan-100">
                <PersonStanding size={20} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Atividade Física
                </span>
                <p className="text-xs text-slate-700 font-semibold mt-1">
                  {fichaAtual?.AtividadeFisica === 'S' || fichaAtual?.AtividadeFisica === true
                    ? 'Pratica regularmente'
                    : 'Não pratica no momento'}
                  {fichaAtual?.AtividadeFisica_Frequencia
                    ? ` (${fichaAtual.AtividadeFisica_Frequencia})`
                    : ''}
                </p>
              </div>
            </div>

            {/* Patologias Base */}
            <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Brain size={20} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Patologias & Diagnósticos
                </span>
                <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                  {fichaAtual?.Patologias || 'Nenhuma patologia crônica informada.'}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <EmptyState
            title="Quadro Clínico em Preparação"
            description="A ficha de anamnese do paciente será preenchida pela equipe de enfermagem após a primeira avaliação presencial."
          />
        )}

        {/* Histórico de Evoluções Mensais */}
        {historicoFichas.length > 0 && (
          <section className="flex flex-col gap-3">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
              Evoluções Anteriores
            </span>

            <div className="flex flex-col gap-3">
              {historicoFichas.map((f: any, idx: number) => {
                const dataHist = new Date(f.DataCriacao);
                const mesAno = dataHist.toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col gap-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100/70 pb-2">
                      <span className="text-xs font-black text-slate-800 capitalize">
                        {mesAno}
                      </span>
                      <span className="text-[11px] font-bold text-[var(--color-brand-primary)] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                        Score: {f.ScoreSaude || 80}%
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium leading-relaxed">
                      {f.Observacoes || f.Patologias || 'Avaliação mensal realizada sem intercorrências.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
