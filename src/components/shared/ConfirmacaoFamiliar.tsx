'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ThumbsUp,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export function ConfirmacaoFamiliar() {
  const [statusConfirmacao, setStatusConfirmacao] = useState<
    'pendente' | 'tudo_certo' | 'problema'
  >('pendente');
  const [modalOpen, setModalOpen] = useState(false);
  const [motivoProblema, setMotivoProblema] = useState('');
  const [detalhes, setDetalhes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTudoCerto = () => {
    setStatusConfirmacao('tudo_certo');
    setToastMessage('Obrigado pelo seu retorno! A equipe foi notificada.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnviarProblema = () => {
    setStatusConfirmacao('problema');
    setModalOpen(false);
    setToastMessage('Sua ocorrência foi enviada com prioridade para a supervisão.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={statusConfirmacao === 'tudo_certo' ? 'success' : 'info'}
          onClose={() => setToastMessage(null)}
        />
      )}

      <section className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100">
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                Confirmação Familiar
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                Controle de Qualidade Contínuo
              </span>
            </div>
          </div>

          {statusConfirmacao === 'tudo_certo' && (
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Confirmado Hoje
            </span>
          )}
        </div>

        {statusConfirmacao === 'pendente' && (
          <div className="flex flex-col gap-3 pt-1">
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Está tudo ocorrendo bem com o atendimento e o plantão de hoje?
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleTudoCerto}
                className="py-3 px-3 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-700 text-xs font-bold rounded-2xl border border-emerald-200/80 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <ThumbsUp size={15} />
                <span>Tudo Certo</span>
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="py-3 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle size={15} className="text-amber-500" />
                <span>Preciso de Ajuda</span>
              </button>
            </div>
          </div>
        )}

        {statusConfirmacao === 'tudo_certo' && (
          <div className="flex items-center gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-100 text-xs text-emerald-800 font-semibold">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>
              Você confirmou que o atendimento de hoje está ótimo. Agradecemos a confiança!
            </span>
          </div>
        )}

        {statusConfirmacao === 'problema' && (
          <div className="flex items-center gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-100 text-xs text-amber-800 font-semibold">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <span>
              Ocorrência recebida pela coordenação. Nossa supervisão já está verificando.
            </span>
          </div>
        )}
      </section>

      {/* Modal de Relato de Ocorrência */}
      <BottomSheet
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Como podemos ajudar no plantão?"
      >
        <div className="flex flex-col gap-4 pt-1">
          <p className="text-xs text-slate-600 font-medium">
            Selecione o motivo para direcionarmos com prioridade para a supervisão:
          </p>

          <div className="flex flex-col gap-2">
            {[
              'Atraso ou ausência de cuidador',
              'Dúvida ou divergência na escala',
              'Intercorrência durante o atendimento',
              'Dúvida financeira ou cobrança',
              'Outra situação operacional',
            ].map((opcao, i) => (
              <label
                key={i}
                onClick={() => setMotivoProblema(opcao)}
                className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                  motivoProblema === opcao
                    ? 'bg-pink-50 text-[var(--color-brand-primary)] border-[var(--color-brand-primary)]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{opcao}</span>
                <input
                  type="radio"
                  name="motivo"
                  checked={motivoProblema === opcao}
                  onChange={() => setMotivoProblema(opcao)}
                  className="accent-[var(--color-brand-primary)]"
                />
              </label>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="Descreva detalhes adicionais para a equipe..."
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs font-medium rounded-2xl p-3.5 border border-slate-200 focus:border-[var(--color-brand-primary)] focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 outline-none resize-none"
          />

          <Button
            variant="primary"
            size="lg"
            onClick={handleEnviarProblema}
            disabled={!motivoProblema}
            className="w-full mt-2 shadow-md shadow-[var(--color-brand-primary)]/20"
          >
            Enviar para Supervisão
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
