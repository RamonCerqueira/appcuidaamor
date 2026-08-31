'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Clock,
  User,
  ClipboardList,
  CalendarCheck2,
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Escala() {
  const [escalas, setEscalas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [responsavel, setResponsavel] = useState('Família Silva');
  const [iniciais, setIniciais] = useState('FS');
  const [selectedDayPlantao, setSelectedDayPlantao] = useState<any | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/escala?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          setEscalas(json.plantoes || []);
          if (json.responsavel) setResponsavel(json.responsavel);
          if (json.iniciais) setIniciais(json.iniciais);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  const getPlantaoForDay = (day: number) => {
    return escalas.find((e) => {
      const d = new Date(e.data);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  const handleDayClick = (day: number) => {
    const plantao = getPlantaoForDay(day);
    if (plantao) {
      setSelectedDayPlantao({ ...plantao, dayNumber: day });
    }
  };

  if (loading && escalas.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
        <Header title="Escala Mensal" showBack />
        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
          <Skeleton className="h-12 rounded-full" />
          <Skeleton className="h-80 rounded-3xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
      <Header
        title="Escala Mensal"
        subtitle={responsavel}
        userInitials={iniciais}
        userName={responsavel}
        showBack
      />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Controles de Mês e Toggle Calendário/Lista */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-2 border border-slate-100 shadow-xs">
          {/* Navegação de Mês */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider px-2 min-w-[120px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="w-8 h-8 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Toggle View Mode */}
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <CalendarIcon size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[var(--color-brand-primary)] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* MODO CALENDÁRIO */}
        {viewMode === 'calendar' && (
          <section className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col gap-4 animate-in fade-in duration-200">
            {/* Header Dias da Semana */}
            <div className="grid grid-cols-7 gap-1">
              {DAY_NAMES.map((d, i) => (
                <span
                  key={i}
                  className="text-center text-[10px] font-black uppercase text-slate-400 py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Grid dos Dias */}
            <div className="grid grid-cols-7 gap-y-2.5 gap-x-1">
              {calendarCells.map((day, idx) => {
                if (!day) return <div key={idx} />;

                const plantao = getPlantaoForDay(day);
                const hasPlantao = !!plantao;

                return (
                  <div key={idx} className="flex justify-center">
                    <button
                      onClick={() => handleDayClick(day)}
                      disabled={!hasPlantao}
                      className={`relative w-10 h-10 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all ${
                        hasPlantao
                          ? 'bg-pink-50 text-[var(--color-brand-primary)] border border-pink-100 hover:bg-pink-100/70 hover:scale-105 active:scale-95 cursor-pointer shadow-xs'
                          : 'text-slate-400 bg-transparent'
                      }`}
                    >
                      <span>{day}</span>
                      {hasPlantao && (
                        <span className="w-1 h-1 rounded-full bg-[var(--color-brand-primary)] mt-0.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-100 border border-pink-300" />
                <span>Dia com plantão</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <span>Sem atendimento</span>
              </div>
            </div>
          </section>
        )}

        {/* MODO LISTA */}
        {viewMode === 'list' && (
          <section className="flex flex-col gap-3 animate-in fade-in duration-200">
            {escalas.length > 0 ? (
              escalas.map((escala: any, index: number) => {
                const dateObj = new Date(escala.data);
                const diaFormatado = String(dateObj.getDate()).padStart(2, '0');
                const diaSemana = DAY_NAMES[dateObj.getDay()];

                return (
                  <div
                    key={index}
                    onClick={() =>
                      setSelectedDayPlantao({
                        ...escala,
                        dayNumber: dateObj.getDate(),
                      })
                    }
                    className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-pink-100 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-100/80 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-[var(--color-brand-primary)] uppercase leading-none">
                          {diaSemana}
                        </span>
                        <span className="text-base font-black text-slate-800 leading-tight">
                          {diaFormatado}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
                          {escala.cuidador}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-0.5">
                          <Clock size={12} className="text-slate-400" />
                          <span>
                            {escala.horaInicio} às {escala.horaSaida}
                          </span>
                        </div>
                      </div>
                    </div>

                    <StatusBadge status={escala.status || 'Confirmado'} />
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={CalendarCheck2}
                title="Sem Plantões neste Mês"
                description="Não localizamos plantões agendados para este período no sistema."
              />
            )}
          </section>
        )}

        {/* CTA para Pedidos de Escala */}
        <Link
          href="/pedidos"
          className="w-full py-4 bg-white hover:bg-slate-50 text-slate-800 rounded-3xl font-extrabold text-sm border border-slate-200/80 shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
        >
          <ClipboardList size={18} className="text-[var(--color-brand-primary)]" />
          <span>Solicitar Alteração na Escala</span>
        </Link>
      </main>

      {/* Bottom Sheet de Detalhes do Plantão */}
      <BottomSheet
        isOpen={!!selectedDayPlantao}
        onClose={() => setSelectedDayPlantao(null)}
        title={`Plantão de ${String(selectedDayPlantao?.dayNumber || '').padStart(2, '0')} de ${MONTH_NAMES[month]}`}
      >
        {selectedDayPlantao && (
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <Avatar name={selectedDayPlantao.cuidador} size="lg" variant="teal" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Profissional Escalado
                </span>
                <h4 className="text-base font-black text-slate-800">
                  {selectedDayPlantao.cuidador}
                </h4>
                <span className="text-xs text-[var(--color-brand-secondary)] font-bold">
                  Cuidador(a) de Plantão
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  Horário do Turno
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5">
                  {selectedDayPlantao.horaInicio} às {selectedDayPlantao.horaSaida}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">
                  Situação
                </span>
                <span className="text-xs font-bold text-emerald-600 mt-0.5">
                  {selectedDayPlantao.status || 'Confirmado'}
                </span>
              </div>
            </div>

            <Link
              href="/pedidos"
              className="w-full py-3.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 mt-2 shadow-md shadow-[var(--color-brand-primary)]/20 transition-colors"
            >
              <ClipboardList size={16} />
              <span>Solicitar Troca ou Folga neste Dia</span>
            </Link>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
