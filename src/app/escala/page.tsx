'use client';

import Header from '@/components/Header';
import { ChevronLeft, ChevronRight, FileText, Calendar as CalendarIcon, List, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Funções utilitárias para o calendário
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Escala() {
  const [escalas, setEscalas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  const [responsavel, setResponsavel] = useState('Família Silva');
  const [iniciais, setIniciais] = useState('FS');
  
  // Plantão Selecionado no Calendário
  const [selectedDate, setSelectedDate] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/escala?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(json => {
        if (json.sucesso) {
          setEscalas(json.plantoes);
          if (json.responsavel) setResponsavel(json.responsavel);
          if (json.iniciais) setIniciais(json.iniciais);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  // Montando o calendário
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarCells = [...blanks, ...days];

  // Helper: Busca plantão para um dia específico
  const getPlantaoForDay = (day: number) => {
    return escalas.find(e => {
      const d = new Date(e.data);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const plantaoSelecionado = selectedDate ? getPlantaoForDay(selectedDate) : null;

  if (loading && escalas.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
        <Header title="Escala Mensal" />
        <main className="flex-1 px-5 pt-6 flex flex-col gap-6 animate-pulse">
          <div className="h-40 bg-gray-200 rounded-[2rem]" />
          <div className="h-64 bg-gray-200 rounded-[2rem]" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Escala Mensal" subtitle={responsavel} userInitials={iniciais} />

      <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
        
        {/* Nav e Toggles */}
        <div className="flex justify-between items-center bg-white rounded-full p-1.5 shadow-sm border border-pink-50">
          <div className="flex bg-gray-50 rounded-full p-1 w-full max-w-[140px]">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`flex-1 flex justify-center py-2 rounded-full transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'}`}
            >
              <CalendarIcon size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 flex justify-center py-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'}`}
            >
              <List size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 pr-2">
            <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 active:scale-95 transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-[var(--color-brand-text)] w-24 text-center uppercase tracking-widest">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-50 text-pink-500 hover:bg-pink-100 active:scale-95 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Calendar UI */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-pink-100/40 border border-pink-50">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {DAY_NAMES.map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-extrabold text-gray-400">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-3 gap-x-1">
                {calendarCells.map((day, i) => {
                  if (!day) return <div key={i} />;
                  
                  const isSelected = day === selectedDate;
                  const plantao = getPlantaoForDay(day);
                  const hasPlantao = !!plantao;

                  return (
                    <div key={i} className="flex justify-center">
                      <button 
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all
                          ${isSelected ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 
                            hasPlantao ? 'bg-pink-50 text-pink-500 hover:bg-pink-100' : 'text-gray-400 hover:bg-gray-50'}
                        `}
                      >
                        {day}
                        {hasPlantao && !isSelected && (
                          <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-pink-500" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col">
                <h3 className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase mb-4">
                  Plantão do dia {String(selectedDate).padStart(2, '0')}/{String(month + 1).padStart(2, '0')}
                </h3>
                
                {plantaoSelecionado ? (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 border border-pink-100">
                      <User size={24} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-extrabold text-[var(--color-brand-text)] uppercase">{plantaoSelecionado.cuidador}</h4>
                      <p className="text-xs text-gray-400 mt-0.5 font-bold">{plantaoSelecionado.horaInicio} às {plantaoSelecionado.horaSaida}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs font-bold text-gray-400">
                    Nenhum plantão agendado.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
          <section className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] font-extrabold text-gray-400 tracking-widest uppercase px-1">Registros do Mês</h3>
            
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-pink-50 flex flex-col overflow-hidden">
              
              {escalas.length > 0 ? escalas.map((escala: any, index: number) => {
                const dateObj = new Date(escala.data);
                const dataFormatada = !isNaN(dateObj.getTime()) ? `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}` : '';

                return (
                  <div key={index} className={`p-5 flex flex-col border-b border-gray-50 hover:bg-pink-50/30 transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-pink-50 rounded-2xl border border-pink-100 shrink-0">
                         <span className="text-[10px] text-pink-400 font-bold uppercase">{DAY_NAMES[dateObj.getDay()]}</span>
                         <span className="text-base font-extrabold text-pink-500 leading-none">{String(dateObj.getDate()).padStart(2, '0')}</span>
                      </div>
                      <div className="flex flex-col flex-1">
                        <h4 className="text-xs font-extrabold text-[var(--color-brand-text)] uppercase tracking-tight">{escala.cuidador}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 font-bold">{escala.horaInicio} – {escala.horaSaida}</p>
                      </div>
                      <div className="bg-green-50 text-green-600 text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider border border-green-100 shrink-0">
                        {escala.status}
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center text-xs font-bold text-gray-400">
                  Nenhum plantão localizado neste mês.
                </div>
              )}

            </div>
          </section>
        )}

        <Link href="/pedidos" className="w-full py-4 mt-2 bg-white text-[var(--color-brand-text)] rounded-[1.5rem] font-bold border border-gray-100 shadow-sm flex justify-center items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all text-sm">
          <FileText size={18} className="text-pink-400" />
          Solicitar alteração na escala
        </Link>

      </main>
    </div>
  );
}
