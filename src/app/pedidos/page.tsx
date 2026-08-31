'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  UserMinus,
  CalendarClock,
  Coffee,
  FileText,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  User,
  Calendar as CalendarIcon,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { Select, SelectOption } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

type Cuidador = {
  id: number;
  nome: string;
  avatarSrc?: string | null;
  plantoes?: string[];
};

type SolicitacaoHistorico = {
  id: number;
  tipo: string;
  data: string;
  status: string;
  respostaAdmin: string | null;
  cuidadorId?: number | null;
  cuidadorNome?: string | null;
  validade?: string | null;
  observacao?: string | null;
};

const MOTIVOS_TROCA = [
  'Incompatibilidade de perfil',
  'Pontualidade / Assiduidade',
  'Técnica e procedimentos de cuidado',
  'Solicitação da família / paciente',
  'Outro motivo',
];

const TIPOS_AJUSTE_ESCALA = [
  'Mudança de Turno (Diurno / Noturno)',
  'Alteração de Horário de Entrada/Saída',
  'Inclusão de Plantão Extra / Novo Dia',
  'Redução de Carga Horária / Cancelamento',
  'Outro ajuste',
];

const CATEGORIAS_OUTRA = [
  'Dúvida Contratual ou Administrativa',
  'Medicamentos e Prescrição Médica',
  'Elogio à Equipe / Profissional',
  'Reclamação ou Ouvidoria',
  'Reposição de Materiais / Insumos',
  'Outro assunto',
];

export default function Pedidos() {
  const [cuidadores, setCuidadores] = useState<Cuidador[]>([]);
  const [historico, setHistorico] = useState<SolicitacaoHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Estados dos Modais
  const [activeModal, setActiveModal] = useState<
    'REMOVER' | 'ALTERAR' | 'FOLGA' | 'OUTRA' | null
  >(null);

  // Campos dos formulários
  const [selectedCuidador, setSelectedCuidador] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [tipoAjuste, setTipoAjuste] = useState('');
  const [categoria, setCategoria] = useState('');
  const [dataDesejada, setDataDesejada] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [titulo, setTitulo] = useState('');
  const [observacao, setObservacao] = useState('');
  const [datasFolga, setDatasFolga] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetch('/api/cuidadores-ativos')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) setCuidadores(json.cuidadores || []);
      })
      .catch((err) => console.error('Erro ao carregar cuidadores:', err));

    fetch('/api/solicitacoes')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) setHistorico(json.solicitacoes || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cuidadoresOptions: SelectOption[] = cuidadores.map((c) => ({
    value: c.id,
    label: c.nome,
    sublabel: c.plantoes && c.plantoes.length > 0 ? `${c.plantoes.length} plantões na escala` : 'Cuidador(a) Ativo(a)',
    avatarSrc: c.avatarSrc,
    badge: 'Escala',
  }));

  const resetForm = () => {
    setSelectedCuidador(null);
    setMotivo('');
    setTipoAjuste('');
    setCategoria('');
    setDataDesejada('');
    setDataInicio('');
    setTitulo('');
    setObservacao('');
    setDatasFolga([]);
    setCurrentMonth(new Date());
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  const isFormValid = () => {
    if (!activeModal) return false;
    switch (activeModal) {
      case 'REMOVER':
        return !!selectedCuidador && !!motivo;
      case 'ALTERAR':
        return !!tipoAjuste && (!!observacao.trim() || !!dataInicio);
      case 'FOLGA':
        return !!selectedCuidador && datasFolga.length > 0;
      case 'OUTRA':
        return !!categoria && !!observacao.trim();
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setSubmitting(true);

    const payload = {
      tipo: activeModal,
      cuidadorId: selectedCuidador,
      motivo: motivo || undefined,
      tipoAjuste: tipoAjuste || undefined,
      categoria: categoria || undefined,
      dataDesejada: dataDesejada || undefined,
      dataInicio: dataInicio || undefined,
      datasFolga: activeModal === 'FOLGA' ? datasFolga : undefined,
      observacao: [titulo ? `[${titulo}]` : '', observacao].filter(Boolean).join(' ').trim() || undefined,
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
        const cuidadorObj = cuidadores.find((c) => c.id === selectedCuidador);

        const novosHistoricos: SolicitacaoHistorico[] = [];

        if (activeModal === 'FOLGA') {
          datasFolga.forEach((d) => {
            novosHistoricos.push({
              id: Math.random(),
              tipo: 'FOLGA',
              data: new Date().toISOString(),
              status: 'Em Análise',
              respostaAdmin: null,
              cuidadorId: selectedCuidador,
              cuidadorNome: cuidadorObj?.nome || null,
              validade: d,
              observacao: observacao || null,
            });
          });
        } else {
          novosHistoricos.push({
            id: data.solicitacao?.Lanc || Math.random(),
            tipo: activeModal || 'OUTRA',
            data: new Date().toISOString(),
            status: 'Em Análise',
            respostaAdmin: null,
            cuidadorId: selectedCuidador,
            cuidadorNome: cuidadorObj?.nome || null,
            validade: dataDesejada || dataInicio || null,
            observacao: payload.observacao || motivo || tipoAjuste || categoria || null,
          });
        }

        setHistorico([...novosHistoricos, ...historico]);
        closeModal();
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error('Erro ao enviar solicitação:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTipo = (tipo: string) => {
    switch (tipo) {
      case 'REMOVER':
        return 'Substituição de Cuidador(a)';
      case 'ALTERAR':
      case 'ESCALA':
        return 'Ajuste de Escala / Horário';
      case 'FOLGA':
        return 'Solicitação de Folga / Suspensão';
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
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Nova Solicitação
            </span>
            <span className="text-[11px] font-semibold text-[var(--color-brand-primary)] flex items-center gap-1">
              <Sparkles size={12} />
              Atendimento Direto
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Troca de Cuidador */}
            <button
              type="button"
              onClick={() => setActiveModal('REMOVER')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100/90 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-rose-200 active:scale-98 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/80 group-hover:scale-105 transition-transform shadow-xs">
                <UserMinus size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Troca de<br />Cuidador(a)
              </span>
            </button>

            {/* Card 2: Ajustar Escala */}
            <button
              type="button"
              onClick={() => setActiveModal('ALTERAR')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100/90 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-pink-200 active:scale-98 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100/80 group-hover:scale-105 transition-transform shadow-xs">
                <CalendarClock size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Ajustar<br />Escala
              </span>
            </button>

            {/* Card 3: Solicitar Folga */}
            <button
              type="button"
              onClick={() => setActiveModal('FOLGA')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100/90 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-amber-200 active:scale-98 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/80 group-hover:scale-105 transition-transform shadow-xs">
                <Coffee size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Solicitar<br />Folga
              </span>
            </button>

            {/* Card 4: Outra Solicitação */}
            <button
              type="button"
              onClick={() => setActiveModal('OUTRA')}
              className="bg-white rounded-3xl p-4.5 border border-slate-100/90 shadow-xs flex flex-col items-center justify-center gap-2.5 hover:border-cyan-200 active:scale-98 transition-all h-32 text-center group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100/80 group-hover:scale-105 transition-transform shadow-xs">
                <FileText size={22} strokeWidth={2} />
              </div>
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Outra<br />Solicitação
              </span>
            </button>
          </div>
        </section>

        {/* Histórico de Solicitações com Acompanhamento */}
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
                const statusNormalizado = (hist.status || '').toUpperCase();
                const isFinalizado =
                  statusNormalizado === 'ACEITO' ||
                  statusNormalizado === 'RECUSADO' ||
                  statusNormalizado === 'CONCLUIDO' ||
                  statusNormalizado === 'FINALIZADO';

                return (
                  <div
                    key={hist.id || index}
                    className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex flex-col gap-3 transition-all"
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : index)}
                      className="flex items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-800 tracking-tight truncate">
                            {formatTipo(hist.tipo)}
                          </h4>
                          {isExpanded ? (
                            <ChevronUp size={14} className="text-slate-400 shrink-0" />
                          ) : (
                            <ChevronDown size={14} className="text-slate-400 shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-medium truncate">
                          <span>Aberto em {dataFormatada}</span>
                          {hist.cuidadorNome && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600 font-semibold truncate">
                                {hist.cuidadorNome}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <StatusBadge status={hist.status || 'Em Análise'} />
                    </div>

                    {/* Detalhes e Timeline de Acompanhamento */}
                    {isExpanded && (
                      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3.5 animate-in fade-in duration-200">
                        {hist.observacao && (
                          <div className="bg-white rounded-xl p-3 border border-slate-200/70 flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400">
                              Detalhes do Pedido
                            </span>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                              {hist.observacao}
                            </p>
                          </div>
                        )}

                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
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

                          <div className={`flex items-center gap-2.5 font-semibold ${
                            isFinalizado ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {isFinalizado ? (
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Clock size={15} className="text-amber-500 shrink-0 animate-pulse" />
                            )}
                            <span>3. Supervisão em análise operacional</span>
                          </div>

                          {isFinalizado && (
                            <div className="flex items-center gap-2.5 text-slate-800 font-bold">
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                              <span>4. Decisão e atendimento concluídos</span>
                            </div>
                          )}
                        </div>

                        {hist.respostaAdmin && (
                          <div className="bg-white rounded-xl p-3 border border-pink-100 bg-pink-50/30 flex items-start gap-2.5 mt-1">
                            <MessageSquare
                              size={16}
                              className="text-[var(--color-brand-primary)] shrink-0 mt-0.5"
                            />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-extrabold uppercase text-[var(--color-brand-primary)]">
                                Parecer Oficial da Supervisão
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
                description="Quando você enviar um pedido de troca, escala ou folga, ele aparecerá aqui com o status em tempo real."
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
        <div className="flex flex-col gap-4 py-1">
          {/* ===================== FORM 1: TROCA DE CUIDADOR ===================== */}
          {activeModal === 'REMOVER' && (
            <>
              <Select
                label="Selecione o(a) Profissional Atual"
                placeholder="Escolha a cuidadora da escala..."
                value={selectedCuidador}
                onChange={(val) => setSelectedCuidador(Number(val))}
                options={cuidadoresOptions}
              />

              <Select
                label="Motivo da Substituição"
                placeholder="Selecione o motivo..."
                value={motivo}
                onChange={(val) => setMotivo(String(val))}
                options={MOTIVOS_TROCA.map((m) => ({ value: m, label: m }))}
              />

              <Input
                label="Data Desejada para Troca (Opcional)"
                type="date"
                value={dataDesejada}
                onChange={(e) => setDataDesejada(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Observações Adicionais (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte-nos mais detalhes para alinharmos o perfil ideal..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm font-medium rounded-2xl p-3.5 border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none shadow-xs transition-all placeholder:text-slate-400"
                />
              </div>
            </>
          )}

          {/* ===================== FORM 2: AJUSTAR ESCALA ===================== */}
          {activeModal === 'ALTERAR' && (
            <>
              <Select
                label="Tipo de Ajuste Desejado"
                placeholder="Selecione o tipo de ajuste..."
                value={tipoAjuste}
                onChange={(val) => setTipoAjuste(String(val))}
                options={TIPOS_AJUSTE_ESCALA.map((t) => ({ value: t, label: t }))}
              />

              <Select
                label="Profissional Envolvido (Opcional)"
                placeholder="Selecione se for para profissional específico..."
                value={selectedCuidador}
                onChange={(val) => setSelectedCuidador(val ? Number(val) : null)}
                options={[
                  { value: 0, label: 'Toda a Equipe / Geral da Casa' },
                  ...cuidadoresOptions,
                ]}
              />

              <Input
                label="Data de Início da Nova Escala"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Detalhes do Ajuste de Horário / Dias
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Gostaria de alterar o horário de início para às 08:00 a partir da próxima semana..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm font-medium rounded-2xl p-3.5 border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none shadow-xs transition-all placeholder:text-slate-400"
                />
              </div>
            </>
          )}

          {/* ===================== FORM 3: SOLICITAR FOLGA ===================== */}
          {activeModal === 'FOLGA' && (
            <>
              <Select
                label="Selecione o(a) Profissional"
                placeholder="Escolha a cuidadora da escala..."
                value={selectedCuidador}
                onChange={(val) => {
                  setSelectedCuidador(Number(val));
                  setDatasFolga([]);
                }}
                options={cuidadoresOptions}
              />

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Dias de Folga / Suspensão
                  </label>
                  {datasFolga.length > 0 && (
                    <span className="text-[11px] font-bold text-[var(--color-brand-primary)]">
                      {datasFolga.length} {datasFolga.length === 1 ? 'dia selecionado' : 'dias selecionados'}
                    </span>
                  )}
                </div>

                {!selectedCuidador ? (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center text-xs font-semibold text-slate-400">
                    Selecione uma profissional acima para visualizar seus dias de plantão na escala.
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs">
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
                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                      >
                        &lt;
                      </button>
                      <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
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
                        className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 font-bold transition-colors cursor-pointer"
                      >
                        &gt;
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-1">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
                        <span key={dia} className="text-[10px] font-bold text-slate-400 uppercase">
                          {dia}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {(() => {
                        const plantoesCuidador =
                          cuidadores.find((c) => c.id === selectedCuidador)?.plantoes || [];
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
                                  ? 'bg-[var(--color-brand-primary)] text-white shadow-xs font-extrabold scale-95'
                                  : isPlantao
                                  ? 'bg-pink-50 text-[var(--color-brand-primary)] hover:bg-pink-100 border border-pink-200/80 cursor-pointer font-bold'
                                  : 'text-slate-300 select-none'
                              }`}
                            >
                              {d}
                            </button>
                          );
                        }
                        return days;
                      })()}
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500 font-semibold px-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-pink-50 border border-pink-200 inline-block" />
                        <span>Dia de plantão</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-md bg-[var(--color-brand-primary)] inline-block" />
                        <span>Selecionado</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Motivo / Observação da Folga (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Viagem da família no final de semana..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm font-medium rounded-2xl p-3.5 border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none shadow-xs transition-all placeholder:text-slate-400"
                />
              </div>
            </>
          )}

          {/* ===================== FORM 4: OUTRA SOLICITAÇÃO ===================== */}
          {activeModal === 'OUTRA' && (
            <>
              <Select
                label="Categoria do Assunto"
                placeholder="Selecione a categoria..."
                value={categoria}
                onChange={(val) => setCategoria(String(val))}
                options={CATEGORIAS_OUTRA.map((c) => ({ value: c, label: c }))}
              />

              <Input
                label="Título / Resumo"
                placeholder="Ex: Dúvida sobre novo medicamento..."
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Mensagem Detalhada
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva aqui sua dúvida, solicitação ou recado para a nossa equipe..."
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  className="w-full bg-white text-slate-800 text-sm font-medium rounded-2xl p-3.5 border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none shadow-xs transition-all placeholder:text-slate-400"
                />
              </div>
            </>
          )}

          <Button
            variant="primary"
            size="lg"
            isLoading={submitting}
            onClick={handleSubmit}
            disabled={submitting || !isFormValid()}
            className="w-full mt-2 shadow-md shadow-[var(--color-brand-primary)]/20"
          >
            Confirmar e Enviar Solicitação
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
