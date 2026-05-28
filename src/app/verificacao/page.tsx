'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MailOpen } from 'lucide-react';
import Link from 'next/link';

export default function Verificacao() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // Pegar apenas o último dígito
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Delete and go to previous
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setIsLoading(true);
    
    // Simula a verificação do PIN
    setTimeout(() => {
      setIsLoading(false);
      router.push('/nova-senha');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[var(--color-brand-background)] w-full px-6 pt-10">
      
      <Link href="/esqueci-senha" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors active:scale-95 mb-8">
        <ArrowLeft size={20} />
      </Link>

      <div className="flex flex-col flex-1 pb-10 max-w-[400px] mx-auto w-full items-center">
        
        <div className="w-20 h-20 bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] rounded-full flex items-center justify-center mb-6">
          <MailOpen size={36} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--color-brand-text)] mb-3 tracking-tight text-center">Verifique seu e-mail</h1>
        <p className="text-[var(--color-brand-text-light)] text-sm mb-10 leading-relaxed text-center px-2">
          Nós enviamos um código de 6 dígitos para o seu e-mail cadastrado. Por favor, insira-o abaixo.
        </p>

        <div className="flex gap-2.5 justify-center w-full mb-8">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-secondary)] focus:border-transparent transition-all shadow-sm"
            />
          ))}
        </div>

        <button 
          onClick={handleVerify}
          disabled={isLoading || code.join('').length !== 6}
          className="w-full py-4 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--color-brand-primary)]/30 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 disabled:active:scale-100"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Validar Código'
          )}
        </button>

        <div className="mt-8 text-center text-sm text-[var(--color-brand-text-light)]">
          Não recebeu o código? <br/>
          <button className="font-bold text-[var(--color-brand-secondary)] hover:underline mt-1">
            Reenviar e-mail
          </button>
        </div>

      </div>
    </div>
  );
}
