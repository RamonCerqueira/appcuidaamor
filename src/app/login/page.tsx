'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.sucesso) {
        router.push('/');
      } else {
        setError(data.mensagem || 'Erro ao realizar login.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 bg-[var(--color-brand-background)] w-full">
      <div className="w-full max-w-[400px] flex flex-col items-center gap-8 pb-10">
        
        {/* Logo */}
        <div className="w-40 h-40 rounded-[2.5rem] bg-white flex items-center justify-center shadow-xl shadow-[var(--color-brand-primary)]/10 border border-gray-50 transform rotate-2 p-3">
          <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain transform -rotate-2" />
        </div>

        <div className="text-center w-full">
          <h1 className="text-3xl font-extrabold text-[var(--color-brand-text)] mb-2 tracking-tight">Bem-vindo(a)</h1>
          <p className="text-[var(--color-brand-text-light)] text-sm px-4">Acesse o portal da família com seu CPF e Senha.</p>
        </div>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 mt-2">
          
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-brand-text)] ml-1 uppercase tracking-wider">Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <input 
                type="password" 
                placeholder="Sua senha" 
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all bg-white text-base shadow-sm"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-1">
            <Link href="/esqueci-senha" className="text-sm text-[var(--color-brand-secondary)] font-bold hover:text-[var(--color-brand-tertiary)] transition-colors">
              Esqueci minha senha
            </Link>
          </div>

          {error && (
            <div className="p-3 mt-2 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center font-medium">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-6 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--color-brand-primary)]/30 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Entrar'
            )}
          </button>
          
        </form>

        <div className="mt-4 text-center text-sm text-[var(--color-brand-text-light)]">
          É seu primeiro acesso? <br/>
          <Link href="/esqueci-senha" className="font-bold text-[var(--color-brand-primary)] hover:underline mt-1 inline-block">
            Criar minha senha agora
          </Link>
        </div>

      </div>
    </div>
  );
}
