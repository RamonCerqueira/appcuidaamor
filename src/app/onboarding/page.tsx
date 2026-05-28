'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/images/caregiver_black.png',
    title: 'Cuidado Premium',
    desc: 'Tenha o histórico médico, medicações e prontuário de saúde do seu ente querido sempre à mão.'
  },
  {
    image: '/images/caregivers_team.png',
    title: 'Escalas em Tempo Real',
    desc: 'Saiba exatamente qual cuidador(a) da Cuida e Amor estará de plantão a cada dia.'
  },
  {
    image: '/images/family_peace.png',
    title: 'Gestão Descomplicada',
    desc: 'Acesse faturas, escalas e solicite alterações na rotina diretamente pelo aplicativo.'
  }
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      router.push('/login');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden flex flex-col justify-end bg-pink-50 select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Header Logo (Com gradiente no topo para garantir 100% de visibilidade sempre) */}
      <div className="absolute top-0 left-0 w-full pt-12 pb-24 px-8 z-20 flex items-center gap-4 bg-gradient-to-b from-white/90 via-white/50 to-transparent animate-in fade-in duration-700">
        <img src="/logo01.svg" alt="Cuida e Amor Logo" className="w-[100px] h-[100px] object-contain drop-shadow-xl" />
        <span className="text-pink-600 font-black text-2xl tracking-tight drop-shadow-md uppercase">CUIDAR É AMAR!</span>
      </div>

      {/* Background Image Full Screen with crossfade */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover object-top" 
          />
        </div>
      ))}

      {/* Beautiful Soft Pink Gradient Overlay (Lower 60%) */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-pink-50 via-pink-50/90 to-transparent pointer-events-none" />

      {/* Content Area */}
      <div className="relative z-10 w-full max-w-[480px] mx-auto px-6 pb-12 flex flex-col items-center">
        
        {/* Texts */}
        <div className="text-center mb-8 h-32 flex flex-col justify-end">
          <h1 
            key={`title-${currentSlide}`}
            className="text-3xl font-extrabold text-slate-800 tracking-tight mb-3 animate-in slide-in-from-bottom-4 fade-in duration-700"
          >
            {slides[currentSlide].title}
          </h1>
          <p 
            key={`desc-${currentSlide}`}
            className="text-slate-600 text-[15px] font-medium leading-relaxed max-w-[320px] mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-both"
          >
            {slides[currentSlide].desc}
          </p>
        </div>

        {/* Dots */}
        <div className="flex gap-2.5 mb-10">
          {slides.map((_, i) => (
            <div 
              key={`dot-${i}`} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-8 bg-pink-400' : 'w-2 bg-pink-200'}`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-pink-400 text-white rounded-2xl font-bold text-lg hover:bg-pink-500 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-pink-200"
        >
          {currentSlide === slides.length - 1 ? 'Começar agora' : 'Próximo'}
          {currentSlide < slides.length - 1 && <ChevronRight size={20} className="text-white" />}
        </button>

        {/* Skip button - always visible */}
        <div className="mt-6 h-6 flex items-center justify-center">
          <button 
            onClick={() => router.push('/login')}
            className="text-sm font-semibold text-slate-500 hover:text-pink-500 transition-colors cursor-pointer"
          >
            Já tenho conta
          </button>
        </div>
        
      </div>
    </div>
  );
}
