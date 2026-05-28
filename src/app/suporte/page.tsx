'use client';

import Header from '@/components/Header';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';

export default function Suporte() {
  const phone = '7135069426';
  const email = 'atendimento@cuidaeamor.com.br';
  const whatsappUrl = 'https://wa.me/557135069426';

  const handleWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${email}`, '_self');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-brand-background)] w-full relative pb-24">
      <Header title="Suporte" />

      <main className="flex-1 px-5 pt-8 flex flex-col gap-6">
        <div className="text-center mb-2">
          <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-[var(--color-brand-primary)]/10 border border-gray-50 transform rotate-3 mx-auto mb-4 p-2">
            <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain transform -rotate-3" />
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--color-brand-text)]">Como podemos ajudar?</h2>
          <p className="text-sm text-[var(--color-brand-text-light)] mt-2 px-4 leading-relaxed">
            Nossa equipe está disponível para garantir o melhor atendimento para você e sua família.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="bg-white rounded-3xl p-5 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center gap-5 hover:bg-green-50 transition-colors group active:scale-95 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0 group-hover:scale-110 transition-transform">
              <MessageCircle size={28} />
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-base font-bold text-[var(--color-brand-text)] group-hover:text-green-700 transition-colors">
                WhatsApp
              </h4>
              <p className="text-xs text-[var(--color-brand-text-light)] mt-0.5">Resposta rápida (Até 5 min)</p>
            </div>
          </button>

          {/* Phone Call */}
          <button
            onClick={handleCall}
            className="bg-white rounded-3xl p-5 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center gap-5 hover:bg-[var(--color-brand-secondary)]/10 transition-colors group active:scale-95 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[var(--color-brand-secondary)]/20 flex items-center justify-center text-[var(--color-brand-secondary)] shrink-0 group-hover:scale-110 transition-transform">
              <Phone size={28} />
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-base font-bold text-[var(--color-brand-text)] group-hover:text-[var(--color-brand-secondary)] transition-colors">
                Ligar agora
              </h4>
              <p className="text-xs text-[var(--color-brand-text-light)] mt-0.5">Atendimento: (71) 3506-9426</p>
            </div>
          </button>

          {/* Email */}
          <button
            onClick={handleEmail}
            className="bg-white rounded-3xl p-5 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100/50 flex items-center gap-5 hover:bg-gray-50 transition-colors group active:scale-95 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0 group-hover:scale-110 transition-transform">
              <Mail size={28} />
            </div>
            <div className="flex flex-col text-left">
              <h4 className="text-base font-bold text-[var(--color-brand-text)]">E-mail</h4>
              <p className="text-xs text-[var(--color-brand-text-light)] mt-0.5">atendimento@cuidaeamor.com.br</p>
            </div>
          </button>
        </div>

        {/* Address Matriz */}
        <div className="mt-4 bg-[var(--color-brand-primary)]/5 rounded-3xl p-5 border border-[var(--color-brand-primary)]/10 flex items-start gap-4">
          <MapPin size={24} className="text-[var(--color-brand-primary)] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-[var(--color-brand-primary)]">Matriz Salvador</h4>
            <p className="text-[11px] text-[var(--color-brand-text-light)] mt-1 leading-relaxed">
              Av. ACM, 1234 - Edifício Empresarial, Sala 501. Pituba, Salvador - BA.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
