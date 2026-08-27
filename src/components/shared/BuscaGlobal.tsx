'use client';

import React, { useState } from 'react';
import { Search, X, Calendar, User, Activity, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BuscaGlobalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BuscaGlobal({ isOpen, onClose }: BuscaGlobalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  if (!isOpen) return null;

  const itens = [
    {
      tipo: 'escala',
      titulo: 'Escala de Plantões de Agosto',
      subtitulo: 'Consultar plantonistas e horários',
      link: '/escala',
      icon: Calendar,
      cor: 'bg-cyan-50 text-cyan-600',
    },
    {
      tipo: 'saude',
      titulo: 'Medicamentos & Prontuário Clínico',
      subtitulo: 'Ficha de saúde e vitalidade',
      link: '/quadro',
      icon: Activity,
      cor: 'bg-pink-50 text-[var(--color-brand-primary)]',
    },
    {
      tipo: 'financeiro',
      titulo: 'Segunda Via de Boleto / PIX',
      subtitulo: 'Faturas abertas e comprovantes',
      link: '/boletos',
      icon: CreditCard,
      cor: 'bg-amber-50 text-amber-600',
    },
    {
      tipo: 'documentos',
      titulo: 'Contrato e Relatórios de Enfermagem',
      subtitulo: 'Central digital de documentos',
      link: '/documentos',
      icon: FileText,
      cor: 'bg-blue-50 text-blue-600',
    },
  ];

  const filtrados = itens.filter(
    (item) =>
      item.titulo.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitulo.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (link: string) => {
    onClose();
    router.push(link);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-12 animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 flex flex-col gap-4">
        {/* Input de Busca */}
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-slate-400 pointer-events-none" />
          <input
            autoFocus
            type="text"
            placeholder="O que você precisa encontrar hoje?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3.5 bg-slate-50 text-slate-800 text-sm font-semibold rounded-2xl border border-slate-200 focus:border-[var(--color-brand-primary)] focus:bg-white outline-none transition-all"
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resultados */}
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
            Sugestões Rápidas
          </span>

          {filtrados.length > 0 ? (
            filtrados.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.link)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-pink-50/60 border border-slate-150 border-slate-100 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.cor}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-[var(--color-brand-primary)]">
                        {item.titulo}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-medium">{item.subtitulo}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-slate-400 font-semibold">
              Nenhum resultado encontrado para &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
