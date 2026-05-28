'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EsqueciSenha() {
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula a requisição de envio de e-mail com token
    setTimeout(() => {
      console.log('--- SIMULAÇÃO DE ENVIO DE E-MAIL ---');
      console.log(`Token de recuperação: 749205`);
      console.log('------------------------------------');
      setIsLoading(false);
      router.push('/verificacao');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[var(--color-brand-background)] w-full px-6 pt-10">
      
      <Link href="/login" className="w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-[var(--color-brand-primary)] transition-colors active:scale-95 mb-8">
        <ArrowLeft size={20} />
      </Link>

      <div className="flex flex-col flex-1 pb-10 max-w-[400px] mx-auto w-full">
        <h1 className="text-3xl font-extrabold text-[var(--color-brand-text)] mb-3 tracking-tight">Qual seu CPF?</h1>
        <p className="text-[var(--color-brand-text-light)] text-sm mb-8 leading-relaxed">
          Para garantir sua segurança, precisamos identificar seu cadastro. Enviaremos um código para o e-mail registrado.
        </p>

        <form onSubmit={handleSend} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-brand-text)] ml-1 uppercase tracking-wider">CPF do Responsável</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="000.000.000-00" 
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all bg-white text-base shadow-sm"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || cpf.length < 11}
            className="w-full py-4 mt-6 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--color-brand-primary)]/30 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Avançar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
