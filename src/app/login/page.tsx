'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ShieldCheck, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    // Formata CPF no padrão 000.000.000-00
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }

    setCpf(value);
    if (error) setError('');
  };

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
        setError(data.mensagem || 'CPF ou credencial incorretos. Verifique o CPF e a data de nascimento (DD/MM/AAAA) ou senha.');
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full px-6 py-10 justify-between">
      {/* Top Header com Logo */}
      <div className="flex flex-col items-center pt-4">
        <div className="w-24 h-24 rounded-3xl bg-white p-3 shadow-md shadow-pink-500/5 border border-pink-100/70 flex items-center justify-center mb-4">
          <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-brand-primary)]">
          Portal da Família
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
          Acesse sua Conta
        </h1>
        <p className="text-xs text-slate-500 font-medium text-center mt-1 max-w-[280px]">
          Acompanhe o cuidado do seu familiar em tempo real.
        </p>
      </div>

      {/* Formulário de Login */}
      <div className="w-full max-w-[380px] mx-auto flex flex-col gap-4 my-auto py-6">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="CPF (Contratante ou Idoso)"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            value={cpf}
            onChange={handleCpfChange}
            required
            autoComplete="username"
            leftIcon={<User size={18} />}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Senha ou Data de Nascimento"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ex: 27/12/1940 ou 27121940"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (error) setError('');
              }}
              required
              autoComplete="current-password"
              leftIcon={<Calendar size={18} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <div className="flex items-center justify-between mt-1 px-0.5">
              <span className="text-[11px] text-slate-400 font-medium">
                Com ou sem barras (DD/MM/AAAA)
              </span>
              <Link
                href="/esqueci-senha"
                className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200/70 rounded-2xl text-rose-700 text-xs font-semibold leading-relaxed animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={cpf.replace(/\D/g, '').length < 11 || !senha}
            className="w-full mt-2 shadow-md shadow-[var(--color-brand-primary)]/20"
          >
            Entrar no Sistema
          </Button>
        </form>

        <div className="mt-2 text-center text-xs text-slate-500 font-medium">
          Precisa de ajuda com o acesso?{' '}
          <Link
            href="/suporte"
            className="font-bold text-[var(--color-brand-primary)] hover:underline"
          >
            Falar com Suporte
          </Link>
        </div>
      </div>

      {/* Footer com Selo de Segurança */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium py-2">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>Ambiente seguro e criptografado</span>
      </div>
    </div>
  );
}
