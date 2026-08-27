'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import {
  FileText,
  Download,
  Share2,
  FileCheck,
  Shield,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

interface DocumentoItem {
  id: number;
  titulo: string;
  categoria: 'contrato' | 'relatorio' | 'recibo' | 'clinico';
  data: string;
  tamanho: string;
  url?: string;
}

export default function CentralDocumentos() {
  const [filtro, setFiltro] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const documentos: DocumentoItem[] = [
    {
      id: 1,
      titulo: 'Contrato de Prestação de Serviços Home Care',
      categoria: 'contrato',
      data: '01/01/2026',
      tamanho: '240 KB',
    },
    {
      id: 2,
      titulo: 'Boletim Mensal de Enfermagem & Avaliação',
      categoria: 'relatorio',
      data: '26/08/2026',
      tamanho: '1.2 MB',
    },
    {
      id: 3,
      titulo: 'Comprovante de Quitação — Fatura Julho/2026',
      categoria: 'recibo',
      data: '10/08/2026',
      tamanho: '180 KB',
    },
    {
      id: 4,
      titulo: 'Ficha de Anamnese e Prescrição Terapêutica',
      categoria: 'clinico',
      data: '15/08/2026',
      tamanho: '450 KB',
    },
  ];

  const handleDownload = (doc: DocumentoItem) => {
    setToastMessage(`Iniciando download seguro: ${doc.titulo}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const docsFiltrados = documentos.filter((d) => {
    const matchFiltro = filtro === 'todos' || d.categoria === filtro;
    const matchBusca = d.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchFiltro && matchBusca;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full pb-28">
      <Header title="Documentos" subtitle="Central Digital" showBack />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Barra de Pesquisa */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nome do documento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-800 text-sm font-medium rounded-2xl border border-slate-200 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 outline-none shadow-xs"
          />
        </div>

        {/* Filtro por Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'contrato', label: 'Contratos' },
            { id: 'relatorio', label: 'Relatórios' },
            { id: 'recibo', label: 'Recibos' },
            { id: 'clinico', label: 'Clínicos' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltro(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                filtro === cat.id
                  ? 'bg-[var(--color-brand-primary)] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Lista de Documentos */}
        <section className="flex flex-col gap-3">
          {docsFiltrados.length > 0 ? (
            docsFiltrados.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-pink-100 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs font-black text-slate-800 leading-snug">
                      {doc.titulo}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium mt-1">
                      Emitido em {doc.data} • {doc.tamanho}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleDownload(doc)}
                    aria-label="Baixar documento"
                    className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 hover:text-[var(--color-brand-primary)] hover:bg-pink-50 border border-slate-200/70 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center text-xs text-slate-400 font-semibold border border-slate-100">
              Nenhum documento localizado para o filtro selecionado.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
