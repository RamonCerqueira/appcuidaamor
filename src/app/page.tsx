'use client';

import Header from '@/components/Header';
import { Calendar, CreditCard, ChevronRight, Activity, Heart, UserCircle2, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.sucesso) {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
        <Header title="Painel Principal" subtitle="Carregando dados..." />
        <main className="flex-1 px-6 pt-6 flex flex-col gap-8 animate-pulse">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4"><div className="h-32 bg-slate-200 rounded-2xl"/><div className="h-32 bg-slate-200 rounded-2xl"/></div>
        </main>
      </div>
    );
  }

  const responsavel = data?.responsavel?.Cliente || data?.responsavel?.Razao || 'Família Silva';
  const paciente = data?.paciente;
  const cuidador = data?.cuidadorHoje;
  const boletosPendentes = data?.notificacoes?.boletosPendentes || 0;

  const primeiroNome = responsavel.split(' ')[0];
  const userInitials = responsavel.split(' ').filter((n: string) => n).map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Visão Geral" subtitle={`Olá, ${primeiroNome}`} userInitials={userInitials} />

      <main className="flex-1 px-6 pt-6 flex flex-col gap-6">
        
        {/* Patient Card - Serene Layout */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-pink-100/40 border border-pink-50 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-50 to-teal-50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
          
          <div className="flex justify-between items-center z-10">
             <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Paciente Assistido</h3>
             <span className="bg-teal-50 text-teal-600 border border-teal-100 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse"></span> Ativo
             </span>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-full flex items-center justify-center shrink-0 border border-pink-100/50 p-0.5">
              {paciente?.Caminho ? (
                <img src={paciente.Caminho} alt={paciente.Cliente} className="w-full h-full object-cover rounded-full" />
              ) : (
                <UserCircle2 size={32} className="text-pink-300" strokeWidth={1.5} />
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-extrabold text-[var(--color-brand-text)] tracking-tight">
                {paciente ? (paciente.Cliente || paciente.Razao) : 'Nenhum paciente vinculado'}
              </h2>
              <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Heart size={12} className="text-pink-400" fill="currentColor" /> Monitoramento Contínuo
              </p>
            </div>
          </div>
        </div>

        {/* Caregiver Today */}
        <section className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Plantão Atual</h3>
            <Link href="/escala" className="text-xs font-semibold text-[var(--color-brand-secondary)] flex items-center hover:underline">
              Ver escala completa <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
            {cuidador ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 shadow-inner border border-pink-100">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-extrabold text-[var(--color-brand-text)] text-sm tracking-tight">{cuidador.Nome}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} className="text-gray-400" />
                      <p className="text-xs text-[var(--color-brand-text-light)] font-semibold">{cuidador.HoraInicio} às {cuidador.HoraSaida}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 text-green-600 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                  {cuidador.Status || 'AGENDADO'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                <Calendar size={28} className="text-slate-300" strokeWidth={1.5} />
                <p className="text-sm text-slate-500 font-medium">Não há plantão agendado para o dia de hoje.</p>
              </div>
            )}
          </div>
        </section>

        {/* Action Grid */}
        <section className="flex flex-col gap-3 mt-2 mb-4">
          <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase px-1">Atalhos</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/quadro" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md hover:border-slate-300 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Activity size={20} className="text-blue-600" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Saúde</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Acessar prontuário</p>
              </div>
            </Link>
            
            <Link href="/boletos" className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col items-start gap-4 hover:shadow-md hover:border-slate-300 transition-all group relative">
              {boletosPendentes > 0 && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />}
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <CreditCard size={20} className="text-amber-600" strokeWidth={2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Financeiro</h4>
                <p className={`text-[11px] font-semibold mt-1 ${boletosPendentes > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {boletosPendentes > 0 ? `${boletosPendentes} fatura(s) pendente(s)` : 'Tudo em dia'}
                </p>
              </div>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
