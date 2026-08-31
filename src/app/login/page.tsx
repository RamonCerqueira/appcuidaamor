'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Calendar,
  ArrowRight,
  HelpCircle,
  Headphones,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
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
        setError(
          data.mensagem ||
            'CPF ou credencial incorretos. Verifique o CPF e a data de nascimento (DD/MM/AAAA) ou senha cadastrada.'
        );
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = cpf.replace(/\D/g, '').length === 11 && senha.trim().length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full px-5 py-6 sm:py-8 justify-between">
      {/* 1. Header Compacto e Elegante */}
      <header className="flex flex-col items-center pt-2 sm:pt-4">
        <div className="w-20 h-20 rounded-3xl bg-white p-2.5 shadow-md shadow-pink-500/10 border border-pink-100/80 flex items-center justify-center mb-3">
          <img
            src="/logo01.svg"
            alt="Cuida e Amor"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-brand-primary)]">
          Portal da Família
        </span>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">
          Acesse sua Conta
        </h1>
        <p className="text-xs text-slate-500 font-medium text-center mt-1 max-w-[290px] leading-relaxed">
          Acompanhe o cuidado do seu familiar em tempo real.
        </p>
      </header>

      {/* 2. Formulário com Espaçamento Otimizado (30-40% mais próximo) */}
      <main className="w-full max-w-[390px] mx-auto flex flex-col gap-4 mt-5 mb-4">
        <form onSubmit={handleLogin} className="flex flex-col gap-3.5">
          {/* Campo CPF */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between ml-1">
              <label
                htmlFor="cpf-input"
                className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"
              >
                CPF do Contratante ou Idoso
              </label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-slate-400 hover:text-[var(--color-brand-primary)] transition-colors p-0.5 cursor-pointer"
                title="Quem pode acessar?"
                aria-label="Informações sobre o CPF de acesso"
              >
                <HelpCircle size={14} />
              </button>
            </div>

            <div className="relative flex items-center group w-full">
              <div
                className="absolute left-4 flex items-center justify-center text-slate-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors pointer-events-none"
                aria-hidden="true"
              >
                <User size={18} />
              </div>
              <input
                id="cpf-input"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                required
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-800 text-sm font-semibold rounded-2xl border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 transition-all duration-200 placeholder:text-slate-400 outline-none shadow-xs"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-medium ml-1">
              Digite o CPF do contratante ou do idoso assistido.
            </span>
          </div>

          {/* Campo Senha ou Data de Nascimento */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between ml-1">
              <label
                htmlFor="senha-input"
                className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5"
              >
                Senha ou Data de Nascimento
              </label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-slate-400 hover:text-[var(--color-brand-primary)] transition-colors p-0.5 cursor-pointer"
                title="Como usar a data de nascimento?"
                aria-label="Informações sobre a senha ou data de nascimento"
              >
                <HelpCircle size={14} />
              </button>
            </div>

            <div className="relative flex items-center group w-full">
              <div
                className="absolute left-4 flex items-center justify-center text-slate-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors pointer-events-none"
                aria-hidden="true"
              >
                <Calendar size={18} />
              </div>
              <input
                id="senha-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Ex: 27/12/1940 ou 27121940"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (error) setError('');
                }}
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-12 py-3.5 bg-white text-slate-800 text-sm font-semibold rounded-2xl border border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10 transition-all duration-200 placeholder:text-slate-400 outline-none shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-0.5 px-1">
              <span className="text-[11px] text-slate-400 font-medium">
                Digite sua senha ou sua data de nascimento.
              </span>
            </div>

            {/* Linha de Ações Rápidas: Esqueci Minha Senha & Como Usar */}
            <div className="flex items-center justify-between pt-1 px-1">
              <Link
                href="/esqueci-senha"
                className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline focus:outline-none focus:underline"
              >
                Esqueci minha senha
              </Link>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="text-xs font-bold text-[var(--color-brand-primary)] hover:underline flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                <span>Como usar?</span>
                <HelpCircle size={13} />
              </button>
            </div>
          </div>

          {/* Feedback de Erro */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl text-rose-700 text-xs font-semibold leading-relaxed animate-in fade-in duration-200">
              {error}
            </div>
          )}

          {/* 3. Botão Premium com Profundidade, Gradiente e Efeitos Táteis */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full mt-2 py-4 px-6 rounded-2xl font-black text-sm tracking-wide text-white bg-gradient-to-r from-[var(--color-brand-primary)] via-[#E84D95] to-[var(--color-brand-primary-dark)] shadow-[0_8px_20px_-4px_rgba(224,66,140,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(224,66,140,0.5)] hover:brightness-105 active:scale-[0.985] active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 flex items-center justify-center gap-2 border-t border-white/20 cursor-pointer group select-none"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>

        {/* 4. Divisor Visual e Atendimento Humanizado (Falar com Suporte) */}
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200/80"></div>
            <span className="shrink-0 mx-3 text-[11px] font-bold text-slate-400">
              Precisa de ajuda com o acesso?
            </span>
            <div className="flex-grow border-t border-slate-200/80"></div>
          </div>

          <Link
            href="/suporte"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-pink-50/40 border border-slate-200/80 hover:border-pink-200 shadow-2xs hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                <Headphones size={19} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black text-slate-800 group-hover:text-[var(--color-brand-primary)] transition-colors">
                  Falar com Suporte
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Nossa equipe está pronta para ajudar você.
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              className="text-slate-400 group-hover:text-[var(--color-brand-primary)] group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </div>

        {/* 5. Badges de Confiança e Cuidado */}
        <div className="grid grid-cols-3 gap-2 bg-pink-50/50 border border-pink-100/70 rounded-2xl p-2.5">
          <div className="flex flex-col items-center justify-center text-center gap-1 p-1">
            <div className="w-7 h-7 rounded-xl bg-white text-[var(--color-brand-primary)] flex items-center justify-center shadow-2xs border border-pink-100/60">
              <ShieldCheck size={15} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700 leading-tight">
              Seus dados protegidos
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center gap-1 p-1 border-x border-pink-100/80">
            <div className="w-7 h-7 rounded-xl bg-white text-[var(--color-brand-primary)] flex items-center justify-center shadow-2xs border border-pink-100/60">
              <Lock size={15} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700 leading-tight">
              Acesso seguro
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center gap-1 p-1">
            <div className="w-7 h-7 rounded-xl bg-white text-[var(--color-brand-primary)] flex items-center justify-center shadow-2xs border border-pink-100/60">
              <Clock size={15} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700 leading-tight">
              Acompanhe em tempo real
            </span>
          </div>
        </div>
      </main>

      {/* 6. Rodapé Refinado de Segurança */}
      <footer className="flex flex-col items-center justify-center text-center gap-0.5 pt-2 pb-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <ShieldCheck size={15} className="text-emerald-500" />
          <span>Ambiente seguro e conexão protegida</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          Seus dados são protegidos com segurança e sigilo.
        </p>
      </footer>

      {/* 7. Modal Informativo "Como Funciona o Acesso" */}
      <BottomSheet
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title="Como Funciona o Acesso?"
      >
        <div className="flex flex-col gap-4 pt-1 text-left">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            O Portal da Família foi planejado para ser simples, acessível e seguro para você acompanhar o cuidado do seu familiar.
          </p>

          <div className="flex flex-col gap-3">
            {/* Card CPF */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 border border-pink-100">
                <User size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800">
                  CPF do Contratante ou Idoso
                </span>
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Você pode entrar utilizando o CPF do titular contratante (familiar) ou o CPF do idoso assistido cadastrado.
                </span>
              </div>
            </div>

            {/* Card Senha / Data */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center shrink-0 border border-pink-100">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800">
                  Senha ou Data de Nascimento
                </span>
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  No primeiro acesso, você pode digitar a data de nascimento do idoso assistido (com ou sem barras, ex: <strong>27/12/1940</strong> ou <strong>27121940</strong>). Se você já definiu uma senha pessoal, digite sua senha.
                </span>
              </div>
            </div>

            {/* Card Suporte */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 shadow-2xs">
                <Headphones size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800">
                  Ainda com dúvidas ou dificuldade?
                </span>
                <span className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Nossa equipe da Cuida e Amor está à disposição para ajudar você a acessar sua conta.
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowHelpModal(false)}
            >
              Entendido
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowHelpModal(false);
                router.push('/suporte');
              }}
            >
              Falar com Suporte
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

