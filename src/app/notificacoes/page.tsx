'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import {
  CreditCard,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  HeartHandshake,
  Activity,
  ClipboardList,
  CheckCheck,
  Filter,
  ArrowRight,
  ShieldAlert,
  Bell,
  Headphones,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export interface Notificacao {
  id: string;
  tipo: 'cuidado' | 'escala' | 'saude' | 'pedidos' | 'financeiro' | 'geral';
  titulo: string;
  descricao: string;
  data: string;
  tempoRelativo: string;
  prioridade: 'urgente' | 'alta' | 'normal';
  link: string;
}

type FiltroTipo = 'todas' | 'nao_lidas' | 'cuidado' | 'escala' | 'saude' | 'pedidos' | 'financeiro';

const STORAGE_KEY = 'appcuidaamor_notificacoes_lidas_v1';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [lidasIds, setLidasIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroTipo>('todas');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Carrega IDs lidos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLidasIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignora erro de parsing
    }
  }, []);

  // Busca notificações reais da API
  useEffect(() => {
    fetch('/api/notificacoes')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso && Array.isArray(json.notificacoes)) {
          setNotificacoes(json.notificacoes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao buscar notificações:', err);
        setLoading(false);
      });
  }, []);

  const marcarComoLida = (id: string) => {
    setLidasIds((prev) => {
      const novo = new Set(prev);
      novo.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(novo)));
      } catch {
        // Ignora
      }
      return novo;
    });
  };

  const marcarTodasComoLidas = () => {
    const todosIds = notificacoes.map((n) => n.id);
    const novo = new Set(todosIds);
    setLidasIds(novo);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todosIds));
    } catch {
      // Ignora
    }
    setToastMsg('Todas as notificações foram marcadas como lidas');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const notificacoesComLidas = useMemo(() => {
    return notificacoes.map((n) => ({
      ...n,
      lida: lidasIds.has(n.id),
    }));
  }, [notificacoes, lidasIds]);

  const totalNaoLidas = useMemo(() => {
    return notificacoesComLidas.filter((n) => !n.lida).length;
  }, [notificacoesComLidas]);

  const notificacoesFiltradas = useMemo(() => {
    if (filtroAtivo === 'todas') return notificacoesComLidas;
    if (filtroAtivo === 'nao_lidas') return notificacoesComLidas.filter((n) => !n.lida);
    return notificacoesComLidas.filter((n) => n.tipo === filtroAtivo);
  }, [notificacoesComLidas, filtroAtivo]);

  const filtros: { id: FiltroTipo; label: string; count?: number }[] = [
    { id: 'todas', label: 'Todas', count: notificacoes.length },
    { id: 'nao_lidas', label: 'Não Lidas', count: totalNaoLidas },
    { id: 'cuidado', label: 'Cuidado' },
    { id: 'escala', label: 'Escala' },
    { id: 'saude', label: 'Saúde' },
    { id: 'pedidos', label: 'Solicitações' },
    { id: 'financeiro', label: 'Financeiro' },
  ];

  const getTipoConfig = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case 'cuidado':
        return {
          icon: <HeartHandshake size={20} className="text-pink-600" />,
          bg: 'bg-pink-50 border-pink-100 text-pink-700',
          badgeText: 'Cuidado Hoje',
        };
      case 'escala':
        return {
          icon: <CalendarCheck size={20} className="text-cyan-600" />,
          bg: 'bg-cyan-50 border-cyan-100 text-cyan-700',
          badgeText: 'Escala',
        };
      case 'saude':
        return {
          icon: <Activity size={20} className="text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-100 text-emerald-700',
          badgeText: 'Prontuário',
        };
      case 'pedidos':
        return {
          icon: <ClipboardList size={20} className="text-blue-600" />,
          bg: 'bg-blue-50 border-blue-100 text-blue-700',
          badgeText: 'Solicitação',
        };
      case 'financeiro':
        return {
          icon: <CreditCard size={20} className="text-amber-600" />,
          bg: 'bg-amber-50 border-amber-100 text-amber-700',
          badgeText: 'Financeiro',
        };
      case 'geral':
      default:
        return {
          icon: <Headphones size={20} className="text-purple-600" />,
          bg: 'bg-purple-50 border-purple-100 text-purple-700',
          badgeText: 'Apoio 24h',
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-36">
      <Header
        title="Notificações"
        subtitle="Central de Avisos"
        showBack
        showNotificationDot={totalNaoLidas > 0}
      />

      {/* Toast de Feedback */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <main className="flex-1 px-5 pt-4 flex flex-col gap-4">
        {/* Barra de Status & Ação Rápida */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-800 tracking-tight">
              {totalNaoLidas > 0 ? (
                <span className="flex items-center gap-1.5 text-[var(--color-brand-primary)] font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                  {totalNaoLidas} {totalNaoLidas === 1 ? 'não lida' : 'não lidas'}
                </span>
              ) : (
                <span className="text-slate-400 font-bold">Tudo em dia</span>
              )}
            </span>
          </div>

          {totalNaoLidas > 0 && (
            <button
              onClick={marcarTodasComoLidas}
              className="text-[11px] font-extrabold text-[var(--color-brand-primary)] hover:text-pink-700 active:scale-95 transition-all flex items-center gap-1 bg-pink-50/80 hover:bg-pink-100/70 border border-pink-100 px-2.5 py-1 rounded-full cursor-pointer"
            >
              <CheckCheck size={14} />
              <span>Marcar todas como lidas</span>
            </button>
          )}
        </div>

        {/* Abas / Filtros de Categoria em Rolagem Horizontal */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-5 px-5">
          {filtros.map((f) => {
            const ativo = filtroAtivo === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFiltroAtivo(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  ativo
                    ? 'bg-[var(--color-brand-primary)] text-white shadow-md shadow-[var(--color-brand-primary)]/20 scale-[1.02]'
                    : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
                }`}
              >
                <span>{f.label}</span>
                {typeof f.count === 'number' && f.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      ativo
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista de Notificações */}
        {loading ? (
          <div className="flex flex-col gap-3 pt-2">
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
          </div>
        ) : notificacoesFiltradas.length > 0 ? (
          <div className="flex flex-col gap-3 pt-1">
            {notificacoesFiltradas.map((item) => {
              const cfg = getTipoConfig(item.tipo);
              const isUrgente = item.prioridade === 'urgente';
              const isAlta = item.prioridade === 'alta';

              return (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => marcarComoLida(item.id)}
                  className={`rounded-3xl p-4.5 border transition-all relative overflow-hidden flex flex-col gap-2.5 active:scale-[0.99] group ${
                    !item.lida
                      ? 'bg-white border-pink-200 shadow-sm shadow-pink-500/5 hover:border-pink-300'
                      : 'bg-white/80 border-slate-100/90 shadow-xs hover:border-slate-200 opacity-90'
                  }`}
                >
                  {/* Ponto indicador de não lida */}
                  {!item.lida && (
                    <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-brand-primary)]" />
                    </span>
                  )}

                  {/* Topo do Card com Badge e Timestamp */}
                  <div className="flex items-center gap-2 pr-6">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${cfg.bg} uppercase tracking-wider`}
                    >
                      {cfg.badgeText}
                    </span>

                    {isUrgente && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 uppercase tracking-widest flex items-center gap-1">
                        <ShieldAlert size={11} />
                        Urgente
                      </span>
                    )}

                    {isAlta && !isUrgente && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-widest">
                        Prioritário
                      </span>
                    )}

                    <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock size={11} />
                      <span>{item.tempoRelativo}</span>
                    </div>
                  </div>

                  {/* Corpo com Ícone e Descrição */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl ${cfg.bg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5`}
                    >
                      {cfg.icon}
                    </div>

                    <div className="flex flex-col flex-1">
                      <h4 className="text-sm font-black text-slate-800 tracking-tight leading-snug">
                        {item.titulo}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                        {item.descricao}
                      </p>
                    </div>
                  </div>

                  {/* Rodapé com Ação Rápida */}
                  <div className="flex items-center justify-end pt-1 border-t border-slate-50 text-[11px] font-bold text-[var(--color-brand-primary)] group-hover:translate-x-0.5 transition-transform">
                    <span>Acessar detalhes</span>
                    <ArrowRight size={13} className="ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Nenhum comunicado no momento"
            description={
              filtroAtivo === 'nao_lidas'
                ? 'Você já leu todas as suas notificações recentes.'
                : 'Quando houver atualizações sobre seu atendimento, elas aparecerão aqui.'
            }
          />
        )}
      </main>
    </div>
  );
}
