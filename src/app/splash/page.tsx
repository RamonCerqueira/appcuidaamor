'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Splash() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Simula tempo de carregamento e direciona
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 4500);

    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // --- CLASSE DE BALÃO DE CORAÇÃO ROSA FLUTUANTE (FADE OUT NO MEIO) ---
    class HeartBalloon {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      maxAlpha: number;
      swayAngle: number;
      swaySpeed: number;
      swayAmount: number;

      constructor(initAtBottom = false) {
        this.size = Math.random() * 14 + 10; // Tamanhos ligeiramente menores para maior harmonia na enxurrada
        this.x = Math.random() * width;
        
        // Se for inicialização, distribui na metade inferior da tela, senão inicia estritamente no rodapé
        const halfHeight = height / 2;
        this.y = initAtBottom 
          ? height + this.size * 2 
          : halfHeight + Math.random() * halfHeight;
        
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = -Math.random() * 0.9 - 0.4; // Flutua um pouco mais rápido para a enxurrada fluir
        
        const pinkTones = [
          'rgba(244, 114, 182, ', // var(--color-brand-primary) rosa delicado
          'rgba(251, 113, 133, ', // Rosa suave
          'rgba(244, 63, 94, ',  // Rosa mais vibrante
          'rgba(236, 72, 153, ',  // Magenta suave
        ];
        this.color = pinkTones[Math.floor(Math.random() * pinkTones.length)];
        this.maxAlpha = Math.random() * 0.4 + 0.15; // Opacidade translúcida sutil
        this.alpha = this.maxAlpha;
        
        // Ondulação suave
        this.swayAngle = Math.random() * Math.PI * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayAmount = Math.random() * 0.5 + 0.2;
      }

      update(mouseX: number, mouseY: number) {
        this.swayAngle += this.swaySpeed;
        
        // Flutuação ascendente com balanço horizontal
        this.x += Math.sin(this.swayAngle) * this.swayAmount + this.speedX;
        this.y += this.speedY;

        // --- DINÂMICA DE FADE OUT ATÉ A METADE DA TELA ---
        const halfHeight = height / 2;
        if (this.y > halfHeight) {
          // Calcula a proporção da altura entre a metade da tela e o fundo
          // y = height -> progress = 1 (opacidade máxima)
          // y = halfHeight -> progress = 0 (totalmente transparente)
          const progress = (this.y - halfHeight) / halfHeight;
          this.alpha = this.maxAlpha * Math.max(0, Math.min(1, progress));
        } else {
          this.alpha = 0;
        }

        // Reposiciona no rodapé quando chega no meio da tela ou fica invisível
        if (this.y <= halfHeight || this.alpha <= 0.01) {
          this.y = height + this.size * 2;
          this.x = Math.random() * width;
          this.alpha = 0;
          this.maxAlpha = Math.random() * 0.4 + 0.15;
          this.speedY = -Math.random() * 0.9 - 0.4;
        }

        // Repulsão suave do mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (120 - distance) / 120;
          this.x -= forceDirectionX * force * 3;
          this.y -= forceDirectionY * force * 3;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return; // Evita desenhar elementos invisíveis

        c.save();
        
        c.translate(this.x, this.y);
        c.rotate(Math.sin(this.swayAngle) * 0.08); // Ondulação do ângulo do balão

        // Desenha o coração com Bezier Curves
        c.beginPath();
        c.moveTo(0, -this.size * 0.25);
        // Lado esquerdo do coração
        c.bezierCurveTo(-this.size * 0.5, -this.size * 0.8, -this.size, -this.size * 0.3, -this.size, this.size * 0.1);
        c.bezierCurveTo(-this.size, this.size * 0.5, -this.size * 0.3, this.size * 0.8, 0, this.size * 1.1);
        // Lado direito do coração
        c.bezierCurveTo(this.size * 0.3, this.size * 0.8, this.size, this.size * 0.5, this.size, this.size * 0.1);
        c.bezierCurveTo(this.size, -this.size * 0.3, this.size * 0.5, -this.size * 0.8, 0, -this.size * 0.25);
        c.closePath();

        // Degradê radial brilhante 3D
        const gradient = c.createRadialGradient(
          -this.size * 0.2,
          -this.size * 0.2,
          0,
          0,
          0,
          this.size
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 1.2})`); // Brilho de reflexo
        gradient.addColorStop(0.3, `${this.color}${this.alpha})`);
        gradient.addColorStop(1, `${this.color}${this.alpha * 0.15})`);

        c.fillStyle = gradient;
        c.fill();

        // Pequena cordinha ondulada pendurada na ponta do coração
        c.beginPath();
        c.moveTo(0, this.size * 1.1);
        c.bezierCurveTo(
          Math.sin(this.swayAngle) * 2.5, this.size * 1.1 + 6,
          -Math.sin(this.swayAngle) * 2.5, this.size * 1.1 + 12,
          0, this.size * 1.1 + 18
        );
        c.strokeStyle = `rgba(244, 114, 182, ${this.alpha * 0.3})`;
        c.lineWidth = 1.0;
        c.stroke();

        c.restore();
      }
    }

    const balloons: HeartBalloon[] = [];
    const init = () => {
      // ENXURRADA DE CORAÇÕES: Aumentamos para 120 balões dinâmicos (alta densidade)
      const count = Math.min(Math.floor(width / 5), 125);
      for (let i = 0; i < count; i++) {
        // Inicializa distribuídos na metade inferior na carga inicial
        balloons.push(new HeartBalloon(false));
      }
    };
    init();

    // Rastreamento de mouse e touch
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    // Loop de renderização 2D
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      balloons.forEach((b) => {
        b.update(mouseX, mouseY);
        b.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // --- LIMPEZA DE RECURSOS ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center w-full relative overflow-hidden bg-gradient-to-tr from-pink-50 via-rose-50 to-teal-50/40 select-none">
      {/* Canvas interativo na camada intermediária acima do fundo */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block pointer-events-none" />

      {/* Auras luminosas respirando sutilmente */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-pink-200/30 filter blur-3xl opacity-70 animate-pulse duration-[4000ms] pointer-events-none" />
      <div className="absolute w-[250px] h-[250px] rounded-full bg-teal-100/30 filter blur-2xl opacity-60 animate-pulse duration-[6000ms] pointer-events-none" style={{ animationDelay: '1500ms' }} />

      {/* Cartão Central Logo com Glassmorphism e Efeito de Vidro */}
      <div className="flex flex-col items-center z-10 p-8 rounded-[3.5rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(244,114,182,0.06)] max-w-[280px] transition-all duration-300 hover:scale-105">
        
        {/* Container da logo branca */}
        <div className="w-36 h-36 rounded-[2.25rem] bg-white flex items-center justify-center shadow-xl shadow-pink-500/5 mb-6 p-4 animate-in zoom-in duration-500">
          <img src="/logo01.svg" alt="Cuida e Amor" className="w-full h-full object-contain" />
        </div>
        
        {/* Dots animados */}
        <div className="flex gap-2.5 items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
