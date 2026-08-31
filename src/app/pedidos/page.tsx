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
  Calendar as CalendarIcon,
  Sparkles,
  X,
  Send,
  AlertCircle,
  PhoneCall,
  Trash2,
  Clock3,
  ShieldAlert,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';
import { Select, SelectOption } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';

type Cuidador = {
  id: number;
  nome: string;
  avatarSrc?: string | null;
  plantoes?: string[];
  proximoPlantao?: string | null;
};

type PlantaoMapa = {
  dataIso: string;
  dataKey: string; // YYYY-MM-DD
  cuidadorId: number;
  cuidadorNome: string;
  avatarSrc: string | null;
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

const TAGS_PREFERENCIA_PERFIL = [
  'Mais calma e paciente',
  'Experiência com Alzheimer/Demência',
  'Foco em mobilidade e acamados',
  'Mais comunicativa e ativa',
  'Técnica em Enfermagem',
  'Experiência com Dietas/Sondas',
];

const TIPOS_AJUSTE_ESCALA = [
  'Mudança de Turno (Diurno / Noturno)',
  'Alteração de Horário de Entrada/Saída',
  'Inclusão de Plantão Extra / Novo Dia',
  'Redução de Carga Horária / Cancelamento',
  'Outro ajuste',
];

const CATEGORIAS_OUTRA = [
  { label: 'Dúvida Contratual ou Financeira', sla: 'Atendimento em até 4 horas úteis' },
  { label: 'Medicamentos e Prescrição Médica', sla: 'Prioridade Enfermagem • Retorno em até 2 horas' },
  { label: 'Elogio à Equipe / Profissional', sla: 'Registrado com destaque para a gerência' },
  { label: 'Reclamação ou Ouvidoria', sla: 'Prioridade da Diretoria • Análise imediata' },
  { label: 'Reposição de Materiais / Insumos', sla: 'Encaminhado ao setor de suprimentos' },
  { label: 'Outro assunto', sla: 'Atendimento geral da coordenação' },
];

export default function Pedidos() {
  const [cuidadores, setCuidadores] = useState<Cuidador[]>([]);
  const [mapaPlantoes, setMapaPlantoes] = useState<PlantaoMapa[]>([]);
  const [historico, setHistorico] = useState<SolicitacaoHistorico[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [abaHistorico, setAbaHistorico] = useState<'TODOS' | 'ANDAMENTO' | 'CONCLUIDOS'>('TODOS');

  // Estados dos Modais
  const [activeModal, setActiveModal] = useState<
    'REMOVER' | 'ALTERAR' | 'FOLGA' | 'OUTRA' | null
  >(null);

  // Campos dos formulários
  const [selectedCuidador, setSelectedCuidador] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [urgenciaTroca, setUrgenciaTroca] = useState<'REGULAR' | 'IMEDIATA'>('REGULAR');
  const [tagsPerfilSelecionadas, setTagsPerfilSelecionadas] = useState<string[]>([]);
  
  // Ajuste de Escala
  const [tipoAjuste, setTipoAjuste] = useState('');
  const [escopoAjuste, setEscopoAjuste] = useState<'DEFINITIVO' | 'TEMPORARIO'>('DEFINITIVO');
  const [novoHorarioInicio, setNovoHorarioInicio] = useState('');
  const [novoHorarioFim, setNovoHorarioFim] = useState('');
  const [dataInicio, setDataInicio] = useState('');

  // Folga
  const [precisaSubstituta, setPrecisaSubstituta] = useState<boolean>(true);
  const [datasFolga, setDatasFolga] = useState<string[]>([]);

  // Outra
  const [categoria, setCategoria] = useState('');
  const [titulo, setTitulo] = useState('');
  const [observacao, setObservacao] = useState('');
  const [dataDesejada, setDataDesejada] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const carregarDados = () => {
    Promise.all([
      fetch('/api/cuidadores-ativos').then((res) => res.json()).catch(() => ({})),
      fetch('/api/solicitacoes').then((res) => res.json()).catch(() => ({})),
    ])
      .then(([cuidJson, solJson]) => {
        if (cuidJson?.sucesso) {
          setCuidadores(cuidJson.cuidadores || []);
          setMapaPlantoes(cuidJson.mapaPlantoes || []);
        }
        if (solJson?.sucesso) {
          setHistorico(solJson.solicitacoes || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const cuidadoresOptions: SelectOption[] = cuidadores.map((c) => ({
    value: c.id,
    label: c.nome,
    sublabel:
      c.plantoes && c.plantoes.length > 0
        ? `${c.plantoes.length} ${c.plantoes.length === 1 ? 'plantão futuro' : 'plantões futuros'}`
        : 'Escala Vigente',
    avatarSrc: c.avatarSrc,
    badge: 'Escala Ativa',
  }));

  const resetForm = () => {
    setSelectedCuidador(null);
    setMotivo('');
    setUrgenciaTroca('REGULAR');
    setTagsPerfilSelecionadas([]);
    setTipoAjuste('');
    setEscopoAjuste('DEFINITIVO');
    setNovoHorarioInicio('');
    setNovoHorarioFim('');
    setCategoria('');
    setDataDesejada('');
    setDataInicio('');
    setTitulo('');
    setObservacao('');
    setDatasFolga([]);
    setPrecisaSubstituta(true);
    setCurrentMonth(new Date());
  };

  const closeModal = () => {
    setActiveModal(null);
    resetForm();
  };

  const toggleTagPerfil = (tag: string) => {
    if (tagsPerfilSelecionadas.includes(tag)) {
      setTagsPerfilSelecionadas(tagsPerfilSelecionadas.filter((t) => t !== tag));
    } else {
      setTagsPerfilSelecionadas([...tagsPerfilSelecionadas, tag]);
    }
  };

  // Sincronização bidirecional: Usuário clica no calendário ➔ auto-seleciona cuidadora
  const handleDateClick = (dateIso: string, dataKey: string) => {
    const plantaoDoDia = mapaPlantoes.find((p) => p.dataKey === dataKey);

    if (activeModal === 'FOLGA') {
      if (datasFolga.includes(dateIso)) {
        setDatasFolga(datasFolga.filter((d) => d !== dateIso));
      } else {
        setDatasFolga([...datasFolga, dateIso]);
        if (plantaoDoDia && !selectedCuidador) {
          setSelectedCuidador(plantaoDoDia.cuidadorId);
        }
      }
    } else if (activeModal === 'REMOVER') {
      setDataDesejada(dataKey);
      if (plantaoDoDia) {
        setSelectedCuidador(plantaoDoDia.cuidadorId);
      }
    } else if (activeModal === 'ALTERAR') {
      setDataInicio(dataKey);
      if (plantaoDoDia && !selectedCuidador) {
        setSelectedCuidador(plantaoDoDia.cuidadorId);
      }
    }
  };

  const isFormValid = () => {
    if (!activeModal) return false;
    switch (activeModal) {
      case 'REMOVER':
        return !!selectedCuidador && !!motivo;
      case 'ALTERAR':
        return !!tipoAjuste && (!!observacao.trim() || !!dataInicio || !!novoHorarioInicio);
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
      urgenciaTroca: activeModal === 'REMOVER' ? urgenciaTroca : undefined,
      tagsPerfil: activeModal === 'REMOVER' && tagsPerfilSelecionadas.length > 0 ? tagsPerfilSelecionadas : undefined,
      tipoAjuste: tipoAjuste || undefined,
      escopoAjuste: activeModal === 'ALTERAR' ? escopoAjuste : undefined,
      novoHorarioInicio: novoHorarioInicio || undefined,
      novoHorarioFim: novoHorarioFim || undefined,
      precisaSubstituta: activeModal === 'FOLGA' ? precisaSubstituta : undefined,
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
        carregarDados();
        closeModal();
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (e) {
      console.error('Erro ao enviar solicitação:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelarSolicitacao = async (id: number) => {
    if (!confirm('Deseja realmente cancelar esta solicitação?')) return;

    setCancelingId(id);
    try {
      const res = await fetch(`/api/solicitacoes?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.sucesso) {
        setSuccessToast('Solicitação cancelada com sucesso.');
        carregarDados();
        setTimeout(() => setSuccessToast(null), 4000);
      } else {
        alert(data.mensagem || 'Não foi possível cancelar a solicitação.');
      }
    } catch (e) {
      console.error('Erro ao cancelar solicitação:', e);
    } finally {
      setCancelingId(null);
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

  const cuidadorSelecionadoObj = cuidadores.find((c) => c.id === selectedCuidador);

  // Filtragem do Histórico
  const historicoFiltrado = historico.filter((h) => {
    const statusNorm = (h.status || '').toUpperCase();
    const isFinalizado =
      statusNorm === 'ACEITO' ||
      statusNorm === 'RECUSADO' ||
      statusNorm === 'CONCLUIDO' ||
      statusNorm === 'FINALIZADO' ||
      statusNorm === 'CANCELADO';

    if (abaHistorico === 'ANDAMENTO') return !isFinalizado;
    if (abaHistorico === 'CONCLUIDOS') return isFinalizado;
    return true;
  });

  const totalEmAndamento = historico.filter((h) => {
    const s = (h.status || '').toUpperCase();
    return s !== 'ACEITO' && s !== 'RECUSADO' && s !== 'CONCLUIDO' && s !== 'FINALIZADO' && s !== 'CANCELADO';
  }).length;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-36">
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

        {/* Histórico com Filtro de Abas e Acompanhamento */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Histórico de Chamados
            </span>
            {totalEmAndamento > 0 && (
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {totalEmAndamento} em andamento
              </span>
            )}
          </div>

          {/* Abas Rápidas */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setAbaHistorico('TODOS')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                abaHistorico === 'TODOS'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Todos ({historico.length})
            </button>
            <button
              type="button"
              onClick={() => setAbaHistorico('ANDAMENTO')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                abaHistorico === 'ANDAMENTO'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Em Aberto ({totalEmAndamento})
            </button>
            <button
              type="button"
              onClick={() => setAbaHistorico('CONCLUIDOS')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                abaHistorico === 'CONCLUIDOS'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Concluídos ({historico.length - totalEmAndamento})
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-24 rounded-3xl" />
                <Skeleton className="h-24 rounded-3xl" />
              </div>
            ) : historicoFiltrado.length > 0 ? (
              historicoFiltrado.map((hist, index) => {
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
                const isCancelado = statusNormalizado === 'CANCELADO';
                const isPendente = !isFinalizado && !isCancelado;

                const msgWhatsapp = encodeURIComponent(
                  `Olá! Gostaria de falar sobre o chamado #${hist.id || ''} (${formatTipo(hist.tipo)}) registrado no App Cuida e Amor.`
                );

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

                    {/* Detalhes, Timeline e Ações do Chamado */}
                    {isExpanded && (
                      <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3.5 animate-in fade-in duration-200">
                        {hist.observacao && (
                          <div className="bg-white rounded-xl p-3 border border-slate-200/70 flex flex-col gap-1">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400">
                              Resumo do Registro
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
                            isFinalizado ? 'text-emerald-700' : isCancelado ? 'text-slate-400 line-through' : 'text-amber-700'
                          }`}>
                            {isFinalizado ? (
                              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                            ) : isCancelado ? (
                              <X size={15} className="text-slate-400 shrink-0" />
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

                          {isCancelado && (
                            <div className="flex items-center gap-2.5 text-rose-600 font-bold">
                              <X size={15} className="text-rose-500 shrink-0" />
                              <span>Solicitação cancelada</span>
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

                        {/* Botões de Ação Direta no Chamado */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                          <a
                            href={`https://wa.me/557135069426?text=${msgWhatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <PhoneCall size={13} className="text-emerald-600" />
                            <span>Falar com Supervisão</span>
                          </a>

                          {isPendente && (
                            <button
                              type="button"
                              disabled={cancelingId === hist.id}
                              onClick={() => handleCancelarSolicitacao(hist.id)}
                              className="py-2 px-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 size={13} />
                              <span>{cancelingId === hist.id ? 'Cancelando...' : 'Cancelar'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhum Chamado Encontrado"
                description={
                  abaHistorico === 'ANDAMENTO'
                    ? 'Você não possui solicitações em análise no momento.'
                    : 'Quando você enviar um pedido de troca, escala ou folga, ele aparecerá aqui com o status em tempo real.'
                }
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
              {/* Seleção do Cuidador */}
              <div className="flex flex-col gap-1">
                <Select
                  label="1. Cuidador(a) a ser Substituído(a)"
                  placeholder="Escolha a profissional da escala ativa..."
                  value={selectedCuidador}
                  onChange={(val) => setSelectedCuidador(val ? Number(val) : null)}
                  options={cuidadoresOptions}
                />
              </div>

              {/* Calendário de Sincronização */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    {selectedCuidador
                      ? `Plantões de ${cuidadorSelecionadoObj?.nome || 'Profissional'}`
                      : 'Ou Toque em um Dia com Plantão na Escala'}
                  </label>
                  {selectedCuidador && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCuidador(null);
                        setDataDesejada('');
                      }}
                      className="text-[11px] font-bold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <X size={12} /> Ver todos os dias
                    </button>
                  )}
                </div>

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
                      const plantoesPermitidos = selectedCuidador
                        ? mapaPlantoes.filter((p) => p.cuidadorId === selectedCuidador)
                        : mapaPlantoes;

                      const plantoesKeys = plantoesPermitidos.map((p) => p.dataKey);

                      const year = currentMonth.getFullYear();
                      const month = currentMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();

                      const days = [];
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="h-9" />);
                      }

                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isPlantao = plantoesKeys.includes(dateKey);
                        const isSelected = dataDesejada === dateKey;
                        const dateObj = new Date(year, month, d);

                        days.push(
                          <button
                            key={d}
                            type="button"
                            disabled={!isPlantao}
                            onClick={() => handleDateClick(dateObj.toISOString(), dateKey)}
                            className={`h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs font-extrabold scale-95 ring-2 ring-[var(--color-brand-primary)]/20'
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
                </div>
              </div>

              {/* Urgência da Transição */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Urgência da Troca
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgenciaTroca('REGULAR')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      urgenciaTroca === 'REGULAR'
                        ? 'bg-pink-50/70 border-[var(--color-brand-primary)] text-slate-800 ring-2 ring-[var(--color-brand-primary)]/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Transição Regular
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">
                      Cumpre os plantões até a nova assumir
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgenciaTroca('IMEDIATA')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      urgenciaTroca === 'IMEDIATA'
                        ? 'bg-rose-50/70 border-rose-500 text-slate-800 ring-2 ring-rose-500/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-rose-700 flex items-center gap-1.5">
                      <ShieldAlert size={12} className="text-rose-600" />
                      Imediata / Urgente
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">
                      Não receber no próximo plantão
                    </span>
                  </button>
                </div>
              </div>

              {/* Motivo da Substituição */}
              <Select
                label="Motivo Principal"
                placeholder="Selecione o motivo..."
                value={motivo}
                onChange={(val) => setMotivo(String(val))}
                options={MOTIVOS_TROCA.map((m) => ({ value: m, label: m }))}
              />

              {/* Tags de Preferência de Perfil para a Nova Cuidadora */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Preferências para o Novo Perfil (Opcional)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TAGS_PREFERENCIA_PERFIL.map((tag) => {
                    const selected = tagsPerfilSelecionadas.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagPerfil(tag)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                          selected
                            ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-pink-200'
                        }`}
                      >
                        {selected && '✓ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Observações Adicionais (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Conte mais detalhes para alinharmos a profissional ideal..."
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

              {/* Escopo: Definitivo vs Temporário */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Escopo da Mudança
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEscopoAjuste('DEFINITIVO')}
                    className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      escopoAjuste === 'DEFINITIVO'
                        ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    💼 Definitivo / Contratual
                  </button>

                  <button
                    type="button"
                    onClick={() => setEscopoAjuste('TEMPORARIO')}
                    className={`py-2 px-3 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      escopoAjuste === 'TEMPORARIO'
                        ? 'bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    ⏱️ Temporário / Pontual
                  </button>
                </div>
              </div>

              {/* Novos Horários de Entrada e Saída */}
              <div className="grid grid-cols-2 gap-2.5">
                <Input
                  label="Novo Horário Início"
                  type="time"
                  value={novoHorarioInicio}
                  onChange={(e) => setNovoHorarioInicio(e.target.value)}
                />
                <Input
                  label="Novo Horário Término"
                  type="time"
                  value={novoHorarioFim}
                  onChange={(e) => setNovoHorarioFim(e.target.value)}
                />
              </div>

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
                  Detalhes Adicionais
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de alterar o horário aos sábados e domingos..."
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
                label="1. Escolha a Cuidadora Titular"
                placeholder="Selecione a profissional..."
                value={selectedCuidador}
                onChange={(val) => {
                  setSelectedCuidador(val ? Number(val) : null);
                  setDatasFolga([]);
                }}
                options={cuidadoresOptions}
              />

              {/* Calendário de Dias de Folga */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    Toque nos Dias de Plantão para Folga
                  </label>
                  {datasFolga.length > 0 && (
                    <span className="text-[11px] font-bold text-[var(--color-brand-primary)]">
                      {datasFolga.length} {datasFolga.length === 1 ? 'dia' : 'dias'}
                    </span>
                  )}
                </div>

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
                      const plantoesPermitidos = selectedCuidador
                        ? mapaPlantoes.filter((p) => p.cuidadorId === selectedCuidador)
                        : mapaPlantoes;

                      const plantoesKeys = plantoesPermitidos.map((p) => p.dataKey);

                      const year = currentMonth.getFullYear();
                      const month = currentMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();

                      const days = [];
                      for (let i = 0; i < firstDay; i++) {
                        days.push(<div key={`empty-${i}`} className="h-9" />);
                      }

                      for (let d = 1; d <= daysInMonth; d++) {
                        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const isPlantao = plantoesKeys.includes(dateKey);
                        const dateObj = new Date(year, month, d);
                        const dateIso = dateObj.toISOString();
                        const isSelected = datasFolga.includes(dateIso);

                        days.push(
                          <button
                            key={d}
                            type="button"
                            disabled={!isPlantao}
                            onClick={() => handleDateClick(dateIso, dateKey)}
                            className={`h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-[var(--color-brand-primary)] text-white shadow-xs font-extrabold scale-95 ring-2 ring-[var(--color-brand-primary)]/20'
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
                </div>
              </div>

              {/* Pílulas de Dias Selecionados com Botão X */}
              {datasFolga.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-pink-50/40 rounded-2xl border border-pink-100">
                  {datasFolga.map((dIso) => {
                    const dObj = new Date(dIso);
                    const label = `${String(dObj.getDate()).padStart(2, '0')}/${String(dObj.getMonth() + 1).padStart(2, '0')}`;
                    return (
                      <span
                        key={dIso}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[var(--color-brand-primary)] text-xs font-extrabold rounded-full border border-pink-200 shadow-2xs"
                      >
                        <span>📅 {label}</span>
                        <button
                          type="button"
                          onClick={() => setDatasFolga(datasFolga.filter((d) => d !== dIso))}
                          className="hover:text-rose-700 cursor-pointer p-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Opção Crítica: Cobertura com Cuidadora Substituta */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1">
                  Necessidade de Cobertura
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPrecisaSubstituta(true)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      precisaSubstituta
                        ? 'bg-pink-50/70 border-[var(--color-brand-primary)] text-slate-800 ring-2 ring-[var(--color-brand-primary)]/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-[var(--color-brand-primary)] flex items-center gap-1.5">
                      👩‍⚕️ Enviar Substituta
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">
                      Coordenação escala folguista para cobrir
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrecisaSubstituta(false)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                      !precisaSubstituta
                        ? 'bg-pink-50/70 border-[var(--color-brand-primary)] text-slate-800 ring-2 ring-[var(--color-brand-primary)]/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      🏠 Apenas Suspender
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">
                      Família cuidará / Idoso ausente
                    </span>
                  </button>
                </div>
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
                options={CATEGORIAS_OUTRA.map((c) => ({ value: c.label, label: c.label }))}
              />

              {/* Indicador de SLA da Categoria */}
              {categoria && (
                <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-cyan-900 font-semibold animate-in fade-in duration-150">
                  <Clock3 size={16} className="text-cyan-700 shrink-0" />
                  <span>
                    {CATEGORIAS_OUTRA.find((c) => c.label === categoria)?.sla ||
                      'Encaminhado diretamente para a coordenação responsável.'}
                  </span>
                </div>
              )}

              <Input
                label="Título / Resumo"
                placeholder="Ex: Dúvida sobre novo medicamento prescrito..."
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
