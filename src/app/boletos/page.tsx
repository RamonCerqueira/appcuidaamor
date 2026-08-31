'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  Copy,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Receipt,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Toast } from '@/components/ui/Toast';

export default function Boletos() {
  const [abertos, setAbertos] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/boletos')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          setAbertos(json.abertos || []);
          setHistorico(json.historico || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopyBarcode = () => {
    if (!boletoAtual?.LinhaDigitavel) return;
    navigator.clipboard.writeText(boletoAtual.LinhaDigitavel);
    setToastMessage('Linha digitável / Código PIX copiado com sucesso!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPdf = () => {
    if (!boletoAtual?.LinkBoleto) return;
    window.open(boletoAtual.LinkBoleto, '_blank');
  };

  const boletoAtual = abertos.length > 0 ? abertos[0] : null;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
        <Header title="Financeiro" subtitle="Faturas e Boletos" showBack />
        <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-44 rounded-3xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
      <Header title="Financeiro" subtitle="Faturas e Boletos" showBack />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Card da Fatura Atual */}
        {boletoAtual ? (
          <section className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[#aa2261] rounded-3xl p-6 text-white shadow-xl shadow-[var(--color-brand-primary)]/20 relative overflow-hidden flex flex-col gap-4">
            <div className="absolute right-[-10%] top-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                Fatura Atual em Aberto
              </span>
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-md uppercase">
                Aguardando Pagamento
              </span>
            </div>

            <div className="flex flex-col relative z-10">
              <span className="text-3xl font-black tracking-tight text-white">
                R$ {boletoAtual.Valor?.toFixed(2).replace('.', ',') || '0,00'}
              </span>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-white/90 bg-black/15 px-3 py-1 rounded-full w-fit border border-white/10">
                <AlertCircle size={14} className="text-amber-300" />
                <span>
                  Vencimento em{' '}
                  {new Date(boletoAtual.Vencimento).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
              <Button
                variant="outline"
                size="md"
                onClick={handleCopyBarcode}
                disabled={!boletoAtual.LinhaDigitavel}
                leftIcon={<Copy size={16} />}
                className="bg-white text-slate-800 hover:bg-slate-50 border-white shadow-sm"
              >
                Copiar Código
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={handleOpenPdf}
                disabled={!boletoAtual.LinkBoleto}
                leftIcon={<FileText size={16} />}
                className="bg-white/15 hover:bg-white/25 text-white border border-white/20"
              >
                Ver Boleto PDF
              </Button>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center justify-center text-center gap-3 py-8">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-1">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-black text-slate-800">
              Tudo em Dia!
            </h3>
            <p className="text-xs text-slate-500 font-medium max-w-[260px] leading-relaxed">
              Você não possui cobranças ou faturas em aberto no momento.
            </p>
          </section>
        )}

        {/* Histórico de Faturas Pagas */}
        <section className="flex flex-col gap-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 px-1">
            Histórico de Pagamentos
          </span>

          <div className="flex flex-col gap-3">
            {historico.length > 0 ? (
              historico.map((item: any, i: number) => {
                const dataVenc = new Date(item.Vencimento);
                const mesAno = dataVenc.toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-4.5 border border-slate-100 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-slate-800 capitalize tracking-tight">
                          {mesAno}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">
                          R${' '}
                          {item.ValorPago?.toFixed(2).replace('.', ',') ||
                            item.Valor?.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <StatusBadge status="Pago" />
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={Receipt}
                title="Sem Histórico Financeiro"
                description="Os comprovantes e faturas quitadas serão exibidos nesta área."
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
