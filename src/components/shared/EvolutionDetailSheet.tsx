'use client';

import React, { useEffect } from 'react';
import {
  X,
  Calendar,
  Pill,
  FileText,
  Utensils,
  PersonStanding,
  Brain,
  Users,
} from 'lucide-react';

interface Medicamento {
  MedicamentoId: number;
  Nome: string;
  Dose?: string;
  Horarios?: string;
  Motivo?: string;
}

interface FichaHistorica {
  AnamneseId: number;
  DataCriacao: string;
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

interface EvolutionDetailSheetProps {
  ficha: FichaHistorica | null;
  onClose: () => void;
}

function isTruthy(val: boolean | number | string | undefined | null): boolean {
  return val === true || val === 1 || val === 'S' || val === 's';
}

export function EvolutionDetailSheet({ ficha, onClose }: EvolutionDetailSheetProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!ficha) return null;

  const dataFormatada = new Date(ficha.DataCriacao).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const score = ficha.ScoreSaude ?? null;
  const medicamentos = ficha.FichaAnamnese_Medicamento ?? [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Evolução de ${dataFormatada}`}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[88dvh] flex flex-col"
        style={{ maxWidth: '480px', margin: '0 auto' }}
      >
        {/* Handle visual */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 pt-1 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100">
              <Calendar size={18} strokeWidth={2.25} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand-secondary)]">
                Evolução Clínica
              </span>
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight capitalize">
                {dataFormatada}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {score !== null && (
              <span className="text-[11px] font-black text-[var(--color-brand-primary)] bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100">
                Vitalidade: {score}%
              </span>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar detalhes"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Conteúdo scrollável */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-4 pb-8">
          {/* Queixa Principal */}
          {ficha.MotivoConsulta && (
            <div className="bg-pink-50/60 rounded-2xl p-3.5 border border-pink-100/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-brand-primary)]">
                Queixa Principal / Motivo
              </span>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-1">
                {ficha.MotivoConsulta}
              </p>
            </div>
          )}

          {/* Notas da Enfermeira */}
          {ficha.Observacoes && (
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText size={14} className="text-[var(--color-brand-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Notas da Enfermeira
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {ficha.Observacoes}
              </p>
            </div>
          )}

          {/* Medicamentos */}
          {medicamentos.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Pill size={15} className="text-[var(--color-brand-primary)]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Terapia Medicamentosa
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {medicamentos.map((m, idx) => (
                  <div
                    key={m.MedicamentoId ?? idx}
                    className="bg-white rounded-xl p-2.5 border border-slate-100 flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {m.Nome}{m.Dose ? ` (${m.Dose})` : ''}
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
                ))}
              </div>
            </div>
          )}

          {/* Rotina Intestinal */}
          {ficha.FuncionamentoIntestinal && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Utensils size={15} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Rotina Intestinal
                </span>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  {ficha.FuncionamentoIntestinal}
                  {ficha.Consistencia ? ` — Consistência: ${ficha.Consistencia}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Hábitos de Vida */}
          {(ficha.AtividadeFisica !== undefined || ficha.Tabagismo !== undefined || ficha.Etilismo !== undefined) && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center shrink-0 border border-cyan-100">
                <PersonStanding size={15} />
              </div>
              <div className="flex flex-col flex-1 gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Hábitos de Vida
                </span>
                <div className="flex flex-col gap-1.5">
                  {ficha.AtividadeFisica !== undefined && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-slate-600 font-medium">Atividade Física:</span>
                      <span className="font-bold text-slate-800">
                        {isTruthy(ficha.AtividadeFisica)
                          ? `Sim${ficha.AtividadeFisica_Frequencia ? ` (${ficha.AtividadeFisica_Frequencia})` : ''}`
                          : 'Não pratica'}
                      </span>
                    </div>
                  )}
                  {ficha.Tabagismo !== undefined && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-slate-600 font-medium">Tabagismo:</span>
                      <span className="font-bold text-slate-800">
                        {isTruthy(ficha.Tabagismo)
                          ? `Sim${ficha.Tabagismo_Frequencia ? ` (${ficha.Tabagismo_Frequencia})` : ''}`
                          : 'Não'}
                      </span>
                    </div>
                  )}
                  {ficha.Etilismo !== undefined && (
                    <div className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <span className="text-slate-600 font-medium">Etilismo:</span>
                      <span className="font-bold text-slate-800">
                        {isTruthy(ficha.Etilismo)
                          ? `Sim${ficha.Etilismo_Frequencia ? ` (${ficha.Etilismo_Frequencia})` : ''}`
                          : 'Não'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Patologias */}
          {(ficha.Patologias || ficha.OutrosPatologias) && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <Brain size={15} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Comorbidades e Patologias
                </span>
                {ficha.Patologias && (
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">{ficha.Patologias}</p>
                )}
                {ficha.OutrosPatologias && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Outras: {ficha.OutrosPatologias}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Histórico Familiar */}
          {ficha.HistoricoFamiliar && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Users size={15} />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Histórico Familiar
                </span>
                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                  {ficha.HistoricoFamiliar}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
