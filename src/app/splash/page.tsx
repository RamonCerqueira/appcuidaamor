'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Splash — Cuida e Amor
 * 
 * Conceito: "Acolhimento Luminoso"
 * 
 * - SEM canvas de partículas (eram dots de PowerPoint)
 * - SEM card/box ao redor do logo
 * - Logo GRANDE e solto — o logo É o herói
 * - Dois orbs CSS suaves — profundidade sem exagero
 * - Tipografia hierárquica e espaçada
 * - Progresso integrado à composição
 * - Tudo num único ritmo visual
 */
export default function Splash() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 650);
    const t3 = setTimeout(() => setPhase(3), 1150);
    const t4 = setTimeout(() => router.push('/onboarding'), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [router]);

  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div
      className="relative flex flex-col min-h-screen w-full overflow-hidden select-none"
      style={{
        // Fundo: branco puro no centro, nuances rosadas nas bordas — luxo discreto
        background: '#FFFFFF',
      }}
    >
      {/* Orb 1 — aura rosa-quente, canto superior direito */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,66,140,0.13) 0%, rgba(224,66,140,0.04) 55%, transparent 75%)',
          filter: 'blur(1px)',
          opacity: phase >= 1 ? 1 : 0,
          transition: `opacity 1.4s ease`,
          pointerEvents: 'none',
        }}
      />

      {/* Orb 2 — aura teal-suave, canto inferior esquerdo */}
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,163,184,0.10) 0%, rgba(45,163,184,0.03) 55%, transparent 75%)',
          filter: 'blur(1px)',
          opacity: phase >= 1 ? 1 : 0,
          transition: `opacity 1.8s ease 0.3s`,
          pointerEvents: 'none',
        }}
      />

      {/* Orb central — claridade atrás do logo */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,66,140,0.08) 0%, transparent 70%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: `opacity 1.2s ease`,
          pointerEvents: 'none',
        }}
      />

      {/* ── ZONA SUPERIOR ─ marca discreta ── */}
      <div
        style={{
          paddingTop: 64,
          paddingLeft: 28,
          paddingRight: 28,
          opacity: phase >= 3 ? 1 : 0,
          transition: `opacity 0.7s ease`,
        }}
      >
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(224,66,140,0.55)',
          display: 'block',
          textAlign: 'center',
        }}>
          Portal da Família
        </span>
      </div>

      {/* ── ZONA CENTRAL — logo + identidade ── */}
      <div
        className="flex flex-col items-center justify-center flex-1"
        style={{ paddingBottom: 60, gap: 0 }}
      >
        {/* Logo — grande, solto, SEM caixa */}
        <div
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1) translateY(0px)' : 'scale(0.88) translateY(20px)',
            transition: `opacity 0.85s ${ease}, transform 0.85s ${ease}`,
            marginBottom: 40,
          }}
        >
          <img
            src="/logo01.svg"
            alt="Cuida e Amor"
            style={{
              width: 180,
              height: 180,
              objectFit: 'contain',
              // Sombra suave difusa — eleva sem encaixotar
              filter: 'drop-shadow(0px 12px 32px rgba(224,66,140,0.18)) drop-shadow(0px 2px 8px rgba(0,0,0,0.06))',
            }}
          />
        </div>

        {/* Nome da marca */}
        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(14px)',
            transition: `opacity 0.7s ${ease}, transform 0.7s ${ease}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Traço decorativo mínimo */}
          <div style={{
            width: 28,
            height: 2,
            borderRadius: 2,
            background: 'linear-gradient(90deg, #E0428C, #2DA3B8)',
            marginBottom: 10,
          }} />

          <span style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: '#E0428C',
          }}>
            Home Care
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 20,
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s`,
          }}
        >
          <span style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#94A3B8',
            letterSpacing: '0.01em',
            display: 'block',
            textAlign: 'center',
          }}>
            Cuidado que conecta famílias
          </span>
        </div>
      </div>

      {/* ── ZONA INFERIOR — progresso ── */}
      <div
        style={{
          paddingBottom: 48,
          paddingLeft: 40,
          paddingRight: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          opacity: phase >= 3 ? 1 : 0,
          transition: 'opacity 0.5s ease 0.2s',
        }}
      >
        {/* Trilha de progresso */}
        <div style={{
          width: '100%',
          maxWidth: 120,
          height: 2,
          borderRadius: 2,
          background: '#F1F5F9',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            borderRadius: 2,
            background: 'linear-gradient(90deg, #E0428C, #2DA3B8)',
            animation: phase >= 3 ? 'progressFill 2.8s cubic-bezier(0.4,0,0.2,1) forwards' : undefined,
          }} />
        </div>
      </div>

      <style>{`
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
