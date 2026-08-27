'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function Verificacao() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    const lastDigit = clean[clean.length - 1];
    const newCode = [...code];
    newCode[index] = lastDigit;
    setCode(newCode);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && !code[index]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/nova-senha');
    }, 1200);
  };

  const handleResend = () => {
    setToastMessage('Um novo código de 6 dígitos foi enviado ao seu e-mail.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full px-6 pt-10 pb-8 justify-between">
      {toastMessage && (
        <Toast message={toastMessage} type="success" onClose={() => setToastMessage(null)} />
      )}

      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/esqueci-senha"
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-[var(--color-brand-primary)] active:scale-95 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Etapa 2 de 3
          </span>
        </div>

        <div className="flex flex-col max-w-[380px] mx-auto items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-[var(--color-brand-secondary)] flex items-center justify-center border border-cyan-100 mb-4">
            <MailCheck size={26} strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
            Validação do Código
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 px-2">
            Insira abaixo o código de 6 dígitos enviado para o seu e-mail cadastrado.
          </p>

          {/* Grid de 6 dígitos */}
          <div className="flex gap-2.5 justify-center w-full mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-black text-slate-800 rounded-2xl border border-slate-200 bg-white focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 transition-all outline-none shadow-xs"
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={code.join('').length !== 6}
            className="w-full shadow-md shadow-[var(--color-brand-primary)]/20"
          >
            Validar e Continuar
          </Button>

          <div className="mt-6 text-xs text-slate-500 font-medium">
            Não recebeu o e-mail?{' '}
            <button
              onClick={handleResend}
              className="font-bold text-[var(--color-brand-primary)] hover:underline cursor-pointer"
            >
              Reenviar código
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-xs font-bold text-slate-500 hover:text-slate-700"
        >
          Cancelar e voltar ao login
        </Link>
      </div>
    </div>
  );
}
