'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function EsqueciSenha() {
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }

    setCpf(value);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/verificacao');
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full px-6 pt-10 pb-8 justify-between">
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/login"
            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-600 hover:text-[var(--color-brand-primary)] active:scale-95 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Etapa 1 de 3
          </span>
        </div>

        <div className="flex flex-col max-w-[380px] mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 mb-4">
            <KeyRound size={26} strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
            Recuperação de Acesso
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            Informe o CPF do titular contratante para enviarmos o código de autenticação por e-mail.
          </p>

          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <Input
              label="CPF do Contratante"
              type="text"
              inputMode="numeric"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              required
              leftIcon={<User size={18} />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={cpf.replace(/\D/g, '').length < 11}
              className="mt-4 shadow-md shadow-[var(--color-brand-primary)]/20"
            >
              Enviar Código de Verificação
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-xs font-bold text-slate-500 hover:text-slate-700"
        >
          Lembrou sua senha? <span className="text-[var(--color-brand-primary)] underline">Voltar para o login</span>
        </Link>
      </div>
    </div>
  );
}
