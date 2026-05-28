'use client';

import Header from '@/components/Header';
import { User, Mail, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Erro ao realizar logout:', e);
    }
    // Redireciona para o login
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
        <Header title="Meu Perfil" />
        <main className="flex-1 px-5 pt-8 flex flex-col gap-8 items-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-xl mb-4" />
          <div className="h-6 w-40 bg-gray-200 rounded-xl" />
          <div className="h-4 w-32 bg-gray-200 rounded-xl mt-1" />
          <div className="w-full h-48 bg-gray-200 rounded-3xl mt-4" />
        </main>
      </div>
    );
  }

  const nomeCompleto = perfil?.nome || 'Família Silva';
  const pacienteVinculado = perfil?.pacienteVinculado || 'Nenhum paciente vinculado';
  const emailValido = perfil?.email || 'atendimento@cuidaeamor.com.br';
  
  // Mascara o CPF: Ex: 123.456.789-00 -> 123.***.***-00
  let cpfMascarado = perfil?.cpf || '***.***.***-**';
  const cleanCpf = cpfMascarado.replace(/[^\d]/g, '');
  if (cleanCpf.length === 11) {
    cpfMascarado = `${cleanCpf.substring(0, 3)}.***.***-${cleanCpf.substring(9, 11)}`;
  }

  // Extrai as iniciais do nome
  const iniciais = nomeCompleto
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FS';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Meu Perfil" subtitle={nomeCompleto} userInitials={iniciais} />

      <main className="flex-1 px-5 pt-8 flex flex-col gap-8">
        {/* User Card */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[var(--color-brand-tertiary)] flex items-center justify-center border-4 border-white shadow-xl shadow-[var(--color-brand-tertiary)]/20 mb-4">
            <span className="font-bold text-3xl text-white">{iniciais}</span>
          </div>
          <h2 className="text-xl font-extrabold text-[var(--color-brand-text)] text-center px-4 leading-tight uppercase tracking-tight">
            {nomeCompleto}
          </h2>
          <p className="text-sm text-[var(--color-brand-text-light)] mt-1 font-semibold uppercase tracking-widest text-[10px]">
            Responsável Financeiro
          </p>

          <div className="w-full max-w-[320px] bg-white border border-gray-100 shadow-sm rounded-xl p-4 mt-5 flex flex-col items-center">
             <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Paciente Assistido</span>
             <span className="text-sm font-extrabold text-pink-500 text-center">{pacienteVinculado}</span>
          </div>
          <div className="bg-green-100 text-green-700 text-[10px] font-extrabold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">
            Cadastro Ativo
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-3xl p-2 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex flex-col mt-4">
          <div className="p-4 flex items-center justify-between border-b border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">Dados Pessoais</h4>
                <p className="text-[11px] text-[var(--color-brand-text-light)] mt-0.5 font-medium">
                  CPF: {cpfMascarado}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 animate-pulse" />
          </div>

          <div className="p-4 flex items-center justify-between border-b border-gray-100/50 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Mail size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">E-mail Cadastrado</h4>
                <p className="text-[11px] text-[var(--color-brand-text-light)] mt-0.5 font-medium">
                  {emailValido}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer rounded-b-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                <Shield size={20} />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-[var(--color-brand-text)]">Política de Privacidade</h4>
                <p className="text-[11px] text-[var(--color-brand-text-light)] mt-0.5 font-medium">
                  Termos de uso do aplicativo
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 mt-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl font-bold text-base transition-colors flex items-center justify-center gap-2 border border-red-100 active:scale-95 transition-transform"
        >
          <LogOut size={20} />
          Sair do Aplicativo
        </button>
      </main>
    </div>
  );
}
