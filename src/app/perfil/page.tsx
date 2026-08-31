'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import {
  User,
  Mail,
  Shield,
  LogOut,
  ChevronRight,
  Heart,
  FileCheck,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Skeleton } from '@/components/ui/Skeleton';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/perfil')
      .then((res) => res.json())
      .then((json) => {
        if (json.sucesso) {
          setPerfil(json.perfil);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Erro ao deslogar:', e);
    } finally {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
        <Header title="Minha Conta" subtitle="Perfil" showBack />
        <main className="flex-1 px-5 pt-6 flex flex-col items-center gap-5">
          <Skeleton className="w-20 h-20" variant="circle" />
          <Skeleton className="w-44 h-5" />
          <Skeleton className="w-full h-44 rounded-3xl" />
        </main>
      </div>
    );
  }

  const nomeCompleto = perfil?.nome || 'Família Silva';
  const pacienteVinculado =
    perfil?.pacienteVinculado || 'Nenhum paciente vinculado';
  const emailValido = perfil?.email || 'atendimento@cuidaeamor.com.br';

  let cpfMascarado = perfil?.cpf || '***.***.***-**';
  const cleanCpf = cpfMascarado.replace(/\D/g, '');
  if (cleanCpf.length === 11) {
    cpfMascarado = `${cleanCpf.substring(0, 3)}.***.***-${cleanCpf.substring(
      9,
      11
    )}`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent w-full pb-36">
      <Header
        title="Minha Conta"
        subtitle="Cadastro"
        showBack
        userName={nomeCompleto}
      />

      <main className="flex-1 px-5 pt-5 flex flex-col gap-5">
        {/* Card do Titular Contratante */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center text-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50/50 rounded-full blur-2xl pointer-events-none" />

          <Avatar name={nomeCompleto} size="xl" variant="pink" active />

          <div className="flex flex-col items-center">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">
              {nomeCompleto}
            </h2>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-brand-secondary)] mt-0.5">
              Titular Responsável Financeiro
            </span>
          </div>

          {/* Card do Paciente Vinculado */}
          <div className="w-full bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between mt-2">
            <div className="flex items-center gap-2.5">
              <Heart size={16} className="text-[var(--color-brand-primary)] shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Paciente Assistido
                </span>
                <span className="text-xs font-black text-slate-800">
                  {pacienteVinculado}
                </span>
              </div>
            </div>
            <StatusBadge status="Ativo" size="sm" />
          </div>
        </section>

        {/* Grupo de Dados Cadastrais */}
        <section className="bg-white rounded-3xl p-2 border border-slate-100 shadow-xs flex flex-col">
          <div className="p-4 flex items-center justify-between border-b border-slate-100/70">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                <User size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">CPF Registrado</span>
                <span className="text-[11px] text-slate-500 font-medium">{cpfMascarado}</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between border-b border-slate-100/70">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
                <Mail size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">E-mail de Notificação</span>
                <span className="text-[11px] text-slate-500 font-medium">{emailValido}</span>
              </div>
            </div>
          </div>

          <div
            onClick={() => router.push('/suporte')}
            className="p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Headphones size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Ajuda e Suporte</span>
                <span className="text-[11px] text-slate-500 font-medium">Contatos diretos da empresa</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
        </section>

        {/* Botão de Logout Seguro */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 bg-rose-50 hover:bg-rose-100/80 text-rose-600 rounded-3xl font-extrabold text-sm border border-rose-200/60 shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer mt-1"
        >
          <LogOut size={18} />
          <span>Sair da Minha Conta</span>
        </button>
      </main>

      {/* BottomSheet de Confirmação de Logout */}
      <BottomSheet
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Deseja realmente sair?"
      >
        <div className="flex flex-col gap-4 text-center items-center pt-2">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
            <LogOut size={26} strokeWidth={2} />
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-[280px]">
            Sua sessão será encerrada com segurança e você precisará digitar seu CPF e senha no próximo acesso.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Permanecer
            </Button>
            <Button
              variant="danger"
              size="md"
              isLoading={loggingOut}
              onClick={handleLogout}
            >
              Sim, Sair
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
