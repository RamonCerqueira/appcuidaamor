'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function NovaSenha() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isMatch = senha.length >= 6 && senha === confirmarSenha;

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
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full px-6 pt-10 pb-8 justify-between">
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="w-10 h-10" />
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            Etapa 3 de 3
          </span>
        </div>

        <div className="flex flex-col max-w-[380px] mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100 mb-4">
            <Lock size={26} strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">
            Definir Nova Senha
          </h1>
          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
            Crie uma senha forte e memorize-a para seus próximos acessos ao portal.
          </p>

          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <Input
              label="Nova Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
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

            <Input
              label="Confirme a Nova Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite novamente"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              autoComplete="new-password"
              leftIcon={<Lock size={18} />}
              rightIcon={
                confirmarSenha && (
                  <div className="p-1">
                    {isMatch ? (
                      <CheckCircle2 size={18} className="text-emerald-500" />
                    ) : (
                      <ShieldAlert size={18} className="text-rose-400" />
                    )}
                  </div>
                )
              }
            />

            {confirmarSenha && !isMatch && (
              <p className="text-xs text-rose-500 font-semibold ml-1">
                {senha.length < 6
                  ? 'A senha deve conter no mínimo 6 caracteres.'
                  : 'As senhas digitadas não coincidem.'}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!isMatch}
              className="mt-4 shadow-md shadow-[var(--color-brand-primary)]/20"
            >
              Salvar Senha e Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
