'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const slides = [
  {
    image: '/images/caregiver_black.png',
    tag: 'Cuidado Contínuo',
    title: 'Prontuário e Saúde Sempre à Mão',
    desc: 'Acompanhe medicações, hábitos e evoluções clínicas do seu ente querido com total transparência.',
  },
  {
    image: '/images/caregivers_team.png',
    tag: 'Equipe de Plantão',
    title: 'Escalas Atualizadas em Tempo Real',
    desc: 'Saiba exatamente quem está cuidando agora e os próximos profissionais escalados para o atendimento.',
  },
  {
    image: '/images/family_peace.png',
    tag: 'Tranquilidade para a Família',
    title: 'Gestão Completa e Descomplicada',
    desc: 'Consulte faturas, emita 2ª via e envie solicitações de escala ou folga diretamente pelo aplicativo.',
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const router = useRouter();

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      router.push('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden flex flex-col justify-end bg-slate-900 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Header com Logo e Pular */}
      <div className="absolute top-0 left-0 w-full pt-10 px-6 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-white/50">
          <img src="/logo01.svg" alt="Cuida e Amor" className="w-6 h-6 object-contain" />
          <span className="text-xs font-black text-[var(--color-brand-primary)] tracking-tight">CUIDA E AMOR</span>
        </div>

        <button
          onClick={() => router.push('/login')}
          className="text-xs font-bold text-white/90 bg-black/30 hover:bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 transition-colors cursor-pointer"
        >
          Pular
        </button>
      </div>

      {/* Imagem de Fundo em Tela Cheia com Crossfade */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      {/* Gradiente de transição para fundo claro */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[var(--color-brand-background)] via-[var(--color-brand-background)]/95 to-transparent pointer-events-none" />

      {/* Área de Conteúdo */}
      <div className="relative z-10 w-full px-6 pb-12 flex flex-col items-center">
        {/* Badge da Etapa */}
        <div className="bg-pink-50 border border-pink-100 text-[var(--color-brand-primary)] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          {slides[currentSlide].tag}
        </div>

        {/* Textos com transição */}
        <div className="text-center mb-6 h-28 flex flex-col justify-center">
          <h2
            key={`title-${currentSlide}`}
            className="text-2xl font-black text-slate-800 tracking-tight mb-2 leading-tight animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {slides[currentSlide].title}
          </h2>
          <p
            key={`desc-${currentSlide}`}
            className="text-slate-600 text-xs font-medium leading-relaxed max-w-[320px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 delay-75"
          >
            {slides[currentSlide].desc}
          </p>
        </div>

        {/* Indicadores / Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? 'w-8 bg-[var(--color-brand-primary)]'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Botão de Avanço */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="w-full shadow-lg shadow-[var(--color-brand-primary)]/25"
          rightIcon={
            currentSlide === slides.length - 1 ? (
              <ArrowRight size={18} />
            ) : (
              <ChevronRight size={18} />
            )
          }
        >
          {currentSlide === slides.length - 1 ? 'Acessar o Aplicativo' : 'Próximo'}
        </Button>

        <div className="mt-4">
          <button
            onClick={() => router.push('/login')}
            className="text-xs font-bold text-slate-500 hover:text-[var(--color-brand-primary)] transition-colors cursor-pointer"
          >
            Já possui acesso? <span className="underline">Entrar com CPF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
