'use client';

import Header from '@/components/Header';
import { Copy, FileText, CheckCircle2, AlertCircle, Printer, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Boletos() {
  const [abertos, setAbertos] = useState<any[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/boletos')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          setAbertos(json.abertos);
          setHistorico(json.historico);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopyBarcode = () => {
    if (!boletoAtual?.LinhaDigitavel) return;
    
    navigator.clipboard.writeText(boletoAtual.LinhaDigitavel);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenPdf = () => {
    if (!boletoAtual?.LinkBoleto) return;
    window.open(boletoAtual.LinkBoleto, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24 animate-pulse">
        <Header title="Financeiro" />
        <main className="flex-1 px-5 pt-6 flex flex-col gap-6">
          <div className="h-48 bg-gray-200 rounded-[2rem]" />
          <div className="h-64 bg-gray-200 rounded-[2rem]" />
        </main>
      </div>
    );
  }

  const boletoAtual = abertos.length > 0 ? abertos[0] : null;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Financeiro" />

      <main className="flex-1 px-5 pt-6 flex flex-col gap-8">
        {/* Toast Notificação de Código Copiado */}
        {copied && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[999] bg-green-600 text-white font-bold text-xs px-4 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 size={16} />
            Código copiado com sucesso!
          </div>
        )}

        {/* Current Bill Card */}
        {boletoAtual ? (
          <div className="bg-gradient-to-br from-[var(--color-brand-primary)] to-[#c54982] rounded-[2rem] p-7 shadow-xl shadow-[var(--color-brand-primary)]/20 flex flex-col text-white relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold tracking-widest text-white/80 uppercase">
                Fatura Atual
              </span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/10">
                Aberto
              </span>
            </div>

            <h2 className="text-4xl font-extrabold mt-3 tracking-tight">
              R$ {boletoAtual.Valor?.toFixed(2).replace('.', ',') || '0,00'}
            </h2>

            <div className="flex items-center gap-2 mt-4 text-white/90 text-xs font-medium bg-black/10 w-fit px-3 py-1.5 rounded-full border border-white/5">
              <AlertCircle size={14} className="text-[var(--color-brand-accent)]" /> Vence em{' '}
              {new Date(boletoAtual.Vencimento).toLocaleDateString('pt-BR')}
            </div>

            <div className="flex gap-3 mt-8 z-10">
              <button
                onClick={handleCopyBarcode}
                disabled={!boletoAtual.LinhaDigitavel}
                className="flex-1 bg-white text-[var(--color-brand-primary)] disabled:opacity-50 hover:bg-gray-50 transition-colors rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <Copy size={16} />
                Copiar Código
              </button>
              <button
                onClick={handleOpenPdf}
                disabled={!boletoAtual.LinkBoleto}
                className="flex-1 bg-black/20 disabled:opacity-50 hover:bg-black/30 backdrop-blur-md transition-colors rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold border border-white/10 active:scale-95 transition-transform cursor-pointer"
              >
                <FileText size={16} />
                Ver PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center justify-center text-center py-10">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="font-extrabold text-[var(--color-brand-text)] text-xl">Tudo em dia!</h3>
            <p className="text-sm text-[var(--color-brand-text-light)] mt-2">
              Você não possui faturas abertas no momento.
            </p>
          </div>
        )}

        {/* History */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-extrabold text-gray-400 tracking-widest uppercase px-1">
            Histórico de Pagamentos
          </h3>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col overflow-hidden">
            {historico.length > 0 ? (
              historico.map((item: any, i: number) => (
                <div
                  key={i}
                  className="p-5 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50/50 transition-colors last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 shrink-0 border border-green-100">
                      <CheckCircle2 size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-extrabold text-[var(--color-brand-text)]">
                        {new Date(item.Vencimento).toLocaleDateString('pt-BR', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h4>
                      <p className="text-xs text-[var(--color-brand-text-light)] mt-0.5 font-medium">
                        Pago • R${' '}
                        {item.ValorPago?.toFixed(2).replace('.', ',') ||
                          item.Valor?.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm font-bold text-gray-400">
                Nenhum pagamento registrado.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* O Modal antigo foi removido pois a Caixa abrirá o PDF original no botão */}
    </div>
  );
}
