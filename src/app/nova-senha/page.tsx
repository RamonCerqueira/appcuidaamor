'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function NovaSenha() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isMatch = senha === confirmarSenha && senha.length > 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[var(--color-brand-background)] w-full px-6 pt-16">
      
      <div className="flex flex-col flex-1 pb-10 max-w-[400px] mx-auto w-full items-center">
        
        <div className="w-20 h-20 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-full flex items-center justify-center mb-6">
          <Lock size={36} strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--color-brand-text)] mb-3 tracking-tight text-center">Nova Senha</h1>
        <p className="text-[var(--color-brand-text-light)] text-sm mb-10 leading-relaxed text-center px-4">
          Crie uma nova senha segura para acessar sua conta.
        </p>

        <form onSubmit={handleSave} className="w-full flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[var(--color-brand-text)] ml-1 uppercase tracking-wider">Nova Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="No mínimo 6 caracteres" 
                className="w-full pl-11 pr-12 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent transition-all bg-white text-base shadow-sm"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[var(--color-brand-text)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-bold text-[var(--color-brand-text)] ml-1 uppercase tracking-wider">Confirmar Senha</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors" />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Repita sua nova senha" 
                className={`w-full pl-11 pr-12 py-4 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] transition-all bg-white text-base shadow-sm ${confirmarSenha.length > 0 ? (isMatch ? 'border-green-400' : 'border-red-400') : 'border-gray-200'}`}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              {confirmarSenha.length > 0 && isMatch && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-green-500">
                  <CheckCircle2 size={20} />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !isMatch || senha.length < 6}
            className="w-full py-4 mt-8 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-[var(--color-brand-primary)]/30 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Salvar Senha e Entrar'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
