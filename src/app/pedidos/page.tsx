'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  UserMinus,
  CalendarClock,
  Coffee,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

type Cuidador = {
  id: number;
  nome: string;
  plantoes?: string[];
};

export default function Pedidos() {
  const [cuidadores, setCuidadores] = useState<Cuidador[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Estados dos Modais
  const [activeModal, setActiveModal] = useState<
    'REMOVER' | 'ESCALA' | 'FOLGA' | 'OUTRA' | null
  >(null);
  const [selectedCuidador, setSelectedCuidador] = useState<number | null>(null);
  const [observacao, setObservacao] = useState('');
  const [datasFolga, setDatasFolga] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showObservacao, setShowObservacao] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch('/api/cuidadores-ativos')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) setCuidadores(json.cuidadores || []);
      });

    fetch('/api/solicitacoes')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) setHistorico(json.solicitacoes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (activeModal === 'REMOVER' && !selectedCuidador) return;
    if (activeModal === 'FOLGA' && (!selectedCuidador || datasFolga.length === 0)) return;
    if (activeModal === 'OUTRA' && !observacao) return;

    setSubmitting(true);

    const payload = {
      tipo: activeModal,
      cuidadorId: selectedCuidador,
      datasFolga,
      observacao,
    };

    try {
      const res = await fetch('/api/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.sucesso) {
        setSuccessToast('Solicitação enviada com sucesso para a coordenação!');
        const novosHistoricos: any[] = [];

        if (activeModal === 'FOLGA') {
          datasFolga.forEach(() => {
            novosHistoricos.push({
              id: Math.random(),
              tipo: activeModal,
              data: new Date().toISOString(),
              status: 'Em Análise',
              respostaAdmin: null,
            });
          });
        } else {
          novosHistoricos.push({
            id: data.solicitacao?.Lanc || Math.random(),
            tipo: activeModal,
            data: new Date().toISOString(),
            status: 'Em Análise',
            respostaAdmin: null,
          });
        }

        setHistorico([...novosHistoricos, ...historico]);
        closeModal();
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedCuidador(null);
    setObservacao('');
    setDatasFolga([]);
    setShowObservacao(false);
    setCurrentMonth(new Date());
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  const formatTipo = (tipo: string) => {
    switch (tipo) {
      case 'REMOVER':
        return 'Substituição de Cuidador';
      case 'ESCALA':
        return 'Ajuste de Escala / Horário';
      case 'FOLGA':
        return 'Solicitação de Folga';
      default:
        return 'Outra Solicitação';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header title="Solicitações" subtitle="Central de Atendimento" showBack />

      {successToast && (
        <Toast
          message={successToast}
          type="success"
          onClose={() => setSuccessToast(null)}
        />
      )}

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Bloco de Ações Rápidas */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Nova Solicitação
          </span>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveModal('REMOVER')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-rose-200 active:scale-95 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                <UserMinus size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Troca de<br />Cuidador(a)
              </span>
            </button>

            <button
              onClick={() => setActiveModal('ESCALA')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-pink-200 active:scale-95 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 group-hover:scale-105 transition-transform">
                <CalendarClock size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Ajustar<br />Escala
              </span>
            </button>

            <button
              onClick={() => setActiveModal('FOLGA')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-amber-200 active:scale-95 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                <Coffee size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Solicitar<br />Folga
              </span>
            </button>

            <button
              onClick={() => setActiveModal('OUTRA')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-cyan-200 active:scale-95 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 group-hover:scale-105 transition-transform">
                <FileText size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Outra<br />Solicitação
              </span>
            </button>
          </div>
        </section>

        {/* Histórico de Solicitações com Acompanhamento Passo a Passo */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Histórico & Acompanhamento
          </span>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-24 rounded-3xl" />
                <Skeleton className="h-24 rounded-3xl" />
              </div>
            ) : historico.length > 0 ? (
              historico.map((hist, index) => {
                const date = new Date(hist.data);
                const dataFormatada = !isNaN(date.getTime())
                  ? `${String(date.getDate()).padStart(2, '0')}/${String(
                      date.getMonth() + 1
                    ).padStart(2, '0')} às ${String(date.getHours()).padStart(
                      2,
                      '0'
                    )}:${String(date.getMinutes()).padStart(2, '0')}`
                  : 'Data não informada';

                const isExpanded = expandedId === index;
                const isFinalizado =
                  hist.status === 'ACEITO' ||
                  hist.status === 'RECUSADO' ||
                  hist.status === 'CONCLUIDO';

                return (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col gap-3 transition-all"
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : index)}
                      className="flex items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-800 tracking-tight">
                            {formatTipo(hist.tipo)}
                          </h4>
                          {isExpanded ? (
                            <ChevronUp size={14} className="text-slate-400" />
                          ) : (
                            <ChevronDown size={14} className="text-slate-400" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Aberto em {dataFormatada}
                        </span>
                      </div>
                      <StatusBadge status={hist.status || 'Em Análise'} />
                    </div>

                    {/* Timeline de Acompanhamento do Chamado */}
                    {isExpanded && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3 animate-in fade-in duration-200">
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          Etapas do Atendimento
                        </span>

                        <div className="flex flex-col gap-2.5 text-xs">
                          <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            <span>1. Solicitação registrada no sistema</span>
                          </div>

                          <div className="flex items-center gap-2.5 text-emerald-700 font-semibold">
                            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            <span>2. Recebida pela equipe de coordenação</span>
                          </div>

                          <div className="flex items-center gap-2.5 text-amber-700 font-semibold">
                            <Clock size={15} className="text-amber-500 shrink-0" />
                            <span>
                              3. Supervisão em análise operacional
                            </span>
                          </div>

                          {isFinalizado && (
                            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                              <span>4. Decisão concluída</span>
                            </div>
                          )}
                        </div>

                        {hist.respostaAdmin && (
                          <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-start gap-2 mt-1">
                            <MessageSquare
                              size={15}
                              className="text-[var(--color-brand-primary)] shrink-0 mt-0.5"
                            />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                                Parecer da Supervisão
                              </span>
                              <p className="text-xs text-slate-700 font-semibold mt-0.5 leading-relaxed">
                                {hist.respostaAdmin}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhum Chamado Aberto"
                description="Quando você enviar um pedido de troca ou folga, ele aparecerá aqui com o status em tempo real."
              />
            )}
          </div>
        </section>
      </main>

      {/* BottomSheet com Formulário da Solicitação */}
      <BottomSheet
        isOpen={!!activeModal}
        onClose={closeModal}
        title={activeModal ? formatTipo(activeModal) : ''}
      >
        <div className="flex flex-col gap-4">
          {/* Seletor de Cuidador */}
          {(activeModal === 'REMOVER' || activeModal === 'FOLGA') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">
                Selecione o Profissional
              </label>
              <select
                value={selectedCuidador || ''}
                onChange={(e) => setSelectedCuidador(Number(e.target.value))}
                className="w-full bg-slate-50 text-slate-800 text-sm font-semibold rounded-2xl p-3.5 border border-slate-200 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 outline-none cursor-pointer"
              >
                <option value="" disabled>
                  Escolha um(a) cuidador(a)...
                </option>
                {cuidadores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Calendário de Seleção de Datas (FOLGA) */}
          {activeModal === 'FOLGA' && (
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 ml-1">
                Dias de Folga Desejados
              </label>

              {!selectedCuidador ? (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center text-xs font-semibold text-slate-400">
                  Selecione um(a) cuidador(a) acima para visualizar os dias de plantão.
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1,
                            1
                          )
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold"
                    >
                      &lt;
                    </button>
                    <span className="text-xs font-black text-slate-800 uppercase">
                      {currentMonth.toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1,
                            1
                          )
                        )
                      }
                      className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold"
                    >
                      &gt;
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {(() => {
                      const plantoesCuidador =
                        cuidadores.find((c) => c.id === selectedCuidador)?.plantoes ||
                        [];
                      const plantoesDates = plantoesCuidador.map((p) => {
                        const d = new Date(p);
                        return new Date(
                          d.getFullYear(),
                          d.getMonth(),
                          d.getDate()
                        ).getTime();
                      });

                      const year = currentMonth.getFullYear();
                      const month = currentMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();

                      const days = [];
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="h-9" />);
                      }

                      for (let d = 1; d <= daysInMonth; d++) {
                        const date = new Date(year, month, d);
                        const isPlantao = plantoesDates.includes(date.getTime());
                        const dateIso = date.toISOString();
                        const isSelected = datasFolga.includes(dateIso);

                        days.push(
                          <button
                            key={d}
                            type="button"
                            disabled={!isPlantao}
                            onClick={() => {
                              if (!isPlantao) return;
                              if (isSelected) {
                                setDatasFolga(datasFolga.filter((iso) => iso !== dateIso));
                              } else {
                                setDatasFolga([...datasFolga, dateIso]);
                              }
                            }}
                            className={`h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                                : isPlantao
                                ? 'bg-pink-50 text-[var(--color-brand-primary)] hover:bg-pink-100/70 border border-pink-100 cursor-pointer'
                                : 'text-slate-300'
                            }`}
                          >
                            {d}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Campo de Detalhes / Observação */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setShowObservacao(!showObservacao)}
              className="text-xs font-extrabold text-[var(--color-brand-primary)] text-left hover:underline"
            >
              {showObservacao ? 'Ocultar observação' : '+ Adicionar observação detalhada'}
            </button>

            {showObservacao && (
              <textarea
                rows={3}
                placeholder="Descreva aqui o motivo ou detalhes da solicitação..."
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium rounded-2xl p-3.5 border border-slate-200 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none"
              />
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            isLoading={submitting}
            onClick={handleSubmit}
            disabled={
              submitting ||
              (activeModal === 'REMOVER' && !selectedCuidador) ||
              (activeModal === 'FOLGA' && (!selectedCuidador || datasFolga.length === 0)) ||
              (activeModal === 'OUTRA' && !observacao)
            }
            className="w-full mt-2 shadow-md shadow-[var(--color-brand-primary)]/20"
          >
            Confirmar e Enviar Pedido
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
