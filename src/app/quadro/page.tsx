'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  Weight,
  Ruler,
  Users,
  FileText,
  User,
  ChevronRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { EvolutionDetailSheet } from '@/components/shared/EvolutionDetailSheet';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Medicamento {
  MedicamentoId: number;
  Nome: string;
  Dose?: string;
  Horarios?: string;
  Motivo?: string;
}

interface FichaAnamnese {
  AnamneseId: number;
  DataCriacao: string;
  DataAlteracao?: string;
  ScoreSaude?: number;
  MotivoConsulta?: string;
  Observacoes?: string;
  Patologias?: string;
  OutrosPatologias?: string;
  FuncionamentoIntestinal?: string;
  Consistencia?: string;
  AtividadeFisica?: boolean | number | string;
  AtividadeFisica_Frequencia?: string;
  Tabagismo?: boolean | number | string;
  Tabagismo_Frequencia?: string;
  Etilismo?: boolean | number | string;
  Etilismo_Frequencia?: string;
  HistoricoFamiliar?: string;
  FichaAnamnese_Medicamento?: Medicamento[];
}

interface Paciente {
  codCli: number;
  nome: string;
  peso?: string | null;
  altura?: string | null;
  codSeg?: string | null;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function isTruthy(val: boolean | number | string | undefined | null): boolean {
  return val === true || val === 1 || val === 'S' || val === 's';
}

// ─── Sub-componente: Gráfico de Sparkline ────────────────────────────────────

function ScoreChart({ fichasArray }: { fichasArray: FichaAnamnese[] }) {
  if (!fichasArray || fichasArray.length === 0) return null;

  const data = [...fichasArray]
    .slice(0, 6)
    .reverse()
    .map((f) => {
      const d = new Date(f.DataCriacao);
      return {
        label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
        score: f.ScoreSaude ?? 85,
      };
    });

  const lastScore = data[data.length - 1]?.score ?? 85;
  const prevScore = data.length > 1 ? (data[data.length - 2]?.score ?? lastScore) : lastScore;
  const diff = lastScore - prevScore;

  const width = 300;
  const height = 90;
  const padding = 20;

  const getX = (i: number) =>
    data.length === 1 ? width / 2 : padding + (i * (width - 2 * padding)) / (data.length - 1);
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
          <span>{diff >= 0 ? `+${diff}` : diff} pts</span>
        </div>
      </div>

      {data.length > 1 && (
        <div className="w-full flex justify-center mt-3 relative z-10">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
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
                <circle cx={getX(i)} cy={getY(d.score)} r="4" fill="#E0428C" stroke="#ffffff" strokeWidth="2.5" />
                <text x={getX(i)} y={height} fill="rgba(255,255,255,0.8)" fontSize="9" fontWeight="800" textAnchor="middle">
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function Quadro() {
  const [fichas, setFichas] = useState<FichaAnamnese[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'quadro' | 'feed'>('quadro');
  const [fichaSelecionada, setFichaSelecionada] = useState<FichaAnamnese | null>(null);

  useEffect(() => {
    fetch('/api/quadro')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          if (json.paciente) setPaciente(json.paciente);
          if (json.fichas && json.fichas.length > 0) setFichas(json.fichas);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCloseSheet = useCallback(() => setFichaSelecionada(null), []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
        <Header title="Quadro de Saúde" subtitle="Prontuário e Evolução" showBack />
        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
          <Skeleton className="h-28 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </main>
      </div>
    );
  }

  const fichaAtual = fichas[0] ?? null;
  const historicoFichas = fichas.slice(1);
  const medicamentosAtuais = fichaAtual?.FichaAnamnese_Medicamento ?? [];

  const ultimaAtt = fichaAtual?.DataCriacao
    ? new Date(fichaAtual.DataCriacao).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sem registro';

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
        <Header title="Quadro de Saúde" subtitle="Prontuário e Evolução" showBack />

        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">

          {/* Card do Paciente */}
          {paciente && (
            <section className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center font-black border border-pink-100">
                    <User size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Paciente Assistido
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-800 leading-tight">
                      {paciente.nome || 'Paciente'}
                    </h2>
                  </div>
                </div>
                {paciente.codCli && (
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    ID: #{paciente.codCli}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100/80">
                <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center gap-2.5 border border-slate-100/70">
                  <div className="w-8 h-8 rounded-xl bg-pink-100/60 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0">
                    <Weight size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Peso Cadastrado
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {paciente.peso ? `${paciente.peso} kg` : 'Não informado'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-2.5 flex items-center gap-2.5 border border-slate-100/70">
                  <div className="w-8 h-8 rounded-xl bg-teal-100/60 text-teal-600 flex items-center justify-center shrink-0">
                    <Ruler size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                      Altura Mapeada
                    </span>
                    <span className="text-xs font-black text-slate-800">
                      {paciente.altura ? `${paciente.altura} m` : 'Não informada'}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Gráfico de Vitalidade */}
          <ScoreChart fichasArray={fichas} />

          {/* Segmented Control — Abas */}
          <div className="bg-slate-100/70 rounded-2xl p-1 flex gap-1" role="tablist" aria-label="Navegação do Quadro de Saúde">
            <button
              id="tab-quadro"
              role="tab"
              aria-selected={abaAtiva === 'quadro'}
              aria-controls="panel-quadro"
              onClick={() => setAbaAtiva('quadro')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                abaAtiva === 'quadro'
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-sm border border-pink-100/60'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <ClipboardEdit size={13} />
                Quadro Atual
              </span>
            </button>
            <button
              id="tab-feed"
              role="tab"
              aria-selected={abaAtiva === 'feed'}
              aria-controls="panel-feed"
              onClick={() => setAbaAtiva('feed')}
              className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
                abaAtiva === 'feed'
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-sm border border-pink-100/60'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Activity size={13} />
                Feed de Evoluções
                {historicoFichas.length > 0 && (
                  <span className="bg-[var(--color-brand-primary)] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {historicoFichas.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* ─── ABA 1: QUADRO CLÍNICO ATUAL ─── */}
          <div id="panel-quadro" role="tabpanel" aria-labelledby="tab-quadro" hidden={abaAtiva !== 'quadro'}>
            {fichaAtual ? (
              <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <ClipboardEdit size={18} className="text-[var(--color-brand-primary)]" />
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                      Evolução Clínica Atual
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{ultimaAtt}</span>
                </div>

                {/* Queixa Principal */}
                {fichaAtual.MotivoConsulta && (
                  <div className="bg-pink-50/50 rounded-2xl p-3.5 border border-pink-100/80 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">
                      Queixa Principal / Motivo
                    </span>
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                      {fichaAtual.MotivoConsulta}
                    </p>
                  </div>
                )}

                {/* Notas de Enfermagem */}
                {fichaAtual.Observacoes && (
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <FileText size={14} className="text-[var(--color-brand-primary)]" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Notas da Enfermeira / Evolução
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 leading-relaxed mt-0.5 whitespace-pre-line">
                      {fichaAtual.Observacoes}
                    </p>
                  </div>
                )}

                {/* Medicamentos */}
                <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 border border-pink-100">
                    <Pill size={20} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Terapia Medicamentosa Vigorosa
                    </span>
                    <div className="flex flex-col gap-2 mt-1.5">
                      {medicamentosAtuais.length > 0 ? (
                        medicamentosAtuais.map((m, idx) => (
                          <div key={m.MedicamentoId ?? idx} className="bg-slate-50 rounded-xl p-2.5 border border-slate-100/80 flex flex-col gap-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800">
                                {m.Nome} {m.Dose ? `(${m.Dose})` : ''}
                              </span>
                              {m.Horarios && (
                                <span className="text-[10px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                                  {m.Horarios}
                                </span>
                              )}
                            </div>
                            {m.Motivo && (
                              <span className="text-[11px] text-slate-500 font-medium">
                                Indicação: {m.Motivo}
                              </span>
                            )}
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

                {/* Rotina Intestinal */}
                <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <Utensils size={20} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Rotina Intestinal &amp; Digestão
                    </span>
                    <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                      {fichaAtual.FuncionamentoIntestinal || 'Funcionamento normal.'}
                    </p>
                    {fichaAtual.Consistencia && (
                      <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Consistência: <strong>{fichaAtual.Consistencia}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Hábitos de Vida */}
                <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center shrink-0 border border-cyan-100">
                    <PersonStanding size={20} />
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Hábitos de Vida
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100/80">
                        <span className="text-slate-600 font-medium">Atividade Física:</span>
                        <span className="font-bold text-slate-800">
                          {isTruthy(fichaAtual.AtividadeFisica)
                            ? `Sim${fichaAtual.AtividadeFisica_Frequencia ? ` (${fichaAtual.AtividadeFisica_Frequencia})` : ''}`
                            : 'Não pratica'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100/80">
                        <span className="text-slate-600 font-medium">Tabagismo:</span>
                        <span className="font-bold text-slate-800">
                          {isTruthy(fichaAtual.Tabagismo)
                            ? `Sim${fichaAtual.Tabagismo_Frequencia ? ` (${fichaAtual.Tabagismo_Frequencia})` : ''}`
                            : 'Não'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl border border-slate-100/80">
                        <span className="text-slate-600 font-medium">Etilismo:</span>
                        <span className="font-bold text-slate-800">
                          {isTruthy(fichaAtual.Etilismo)
                            ? `Sim${fichaAtual.Etilismo_Frequencia ? ` (${fichaAtual.Etilismo_Frequencia})` : ''}`
                            : 'Não'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patologias */}
                <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Brain size={20} />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Comorbidades &amp; Patologias
                    </span>
                    <p className="text-xs text-slate-700 font-semibold mt-1 leading-relaxed">
                      {fichaAtual.Patologias || 'Nenhuma patologia crônica informada.'}
                    </p>
                    {fichaAtual.OutrosPatologias && (
                      <p className="text-[11px] text-slate-500 font-medium mt-1">
                        Outras condições: {fichaAtual.OutrosPatologias}
                      </p>
                    )}
                  </div>
                </div>

                {/* Histórico Familiar */}
                {fichaAtual.HistoricoFamiliar && (
                  <div className="flex gap-3.5 items-start border-t border-slate-100/70 pt-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <Users size={20} />
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                        Histórico Familiar
                      </span>
                      <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                        {fichaAtual.HistoricoFamiliar}
                      </p>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <EmptyState
                title="Quadro Clínico em Preparação"
                description="A ficha de anamnese do paciente será preenchida pela equipe de enfermagem após a primeira avaliação presencial."
              />
            )}
          </div>

          {/* ─── ABA 2: FEED DE EVOLUÇÕES HISTÓRICAS ─── */}
          <div id="panel-feed" role="tabpanel" aria-labelledby="tab-feed" hidden={abaAtiva !== 'feed'}>
            {fichas.length > 0 ? (
              <section className="flex flex-col gap-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
                  {fichas.length} {fichas.length === 1 ? 'Registro' : 'Registros'} de Evolução
                </span>

                <div className="flex flex-col gap-3">
                  {fichas.map((f, idx) => {
                    const dataHist = new Date(f.DataCriacao);
                    const dataFormatada = dataHist.toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    });
                    const isAtual = idx === 0;
                    const medsFicha = f.FichaAnamnese_Medicamento ?? [];

                    return (
                      <button
                        key={f.AnamneseId}
                        onClick={() => setFichaSelecionada(f)}
                        className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col gap-2.5 text-left w-full hover:border-pink-200 transition-all active:scale-[0.99]"
                        aria-label={`Ver detalhes da evolução de ${dataFormatada}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[var(--color-brand-primary)]" />
                            <span className="text-xs font-black text-slate-800 capitalize">
                              {dataFormatada}
                            </span>
                            {isAtual && (
                              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                Atual
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-[var(--color-brand-primary)] bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100">
                              {f.ScoreSaude ?? 80}%
                            </span>
                            <ChevronRight size={14} className="text-slate-300" />
                          </div>
                        </div>

                        {f.MotivoConsulta && (
                          <span className="text-[11px] font-bold text-slate-700">
                            Queixa:{' '}
                            <span className="font-medium text-slate-600">{f.MotivoConsulta}</span>
                          </span>
                        )}

                        <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                          {f.Observacoes || f.Patologias || 'Avaliação periódica realizada sem intercorrências.'}
                        </p>

                        {medsFicha.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-slate-100/60">
                            {medsFicha.slice(0, 4).map((m, mIdx) => (
                              <span
                                key={m.MedicamentoId ?? mIdx}
                                className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                              >
                                💊 {m.Nome} {m.Dose ? `(${m.Dose})` : ''}
                              </span>
                            ))}
                            {medsFicha.length > 4 && (
                              <span className="text-[10px] font-semibold text-[var(--color-brand-primary)] bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                                +{medsFicha.length - 4} meds
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : (
              <EmptyState
                title="Nenhuma Evolução Registrada"
                description="As evoluções clínicas periódicas aparecerão aqui conforme forem registradas pela equipe de enfermagem."
              />
            )}
          </div>

        </main>
      </div>

      {/* Bottom Sheet de Detalhe da Evolução Selecionada */}
      <EvolutionDetailSheet ficha={fichaSelecionada} onClose={handleCloseSheet} />
    </>
  );
}
