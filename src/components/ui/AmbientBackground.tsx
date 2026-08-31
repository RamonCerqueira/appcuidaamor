'use client';

import React from 'react';

/**
 * AmbientBackground — Fundo orgânico em tons de rosa pastel, aquarela e curvas suaves de seda
 * com filamentos dourados delicados. Inspirado na identidade "Care Premium" da marca Cuida e Amor.
 * Fica estritamente na camada de fundo, sem afetar o contraste e legibilidade dos cards.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none -z-0 overflow-hidden select-none"
    >
      {/* 1. Manchas suaves de aquarela / auroras em rosa pastel */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-pink-200/50 via-rose-100/40 to-transparent blur-3xl opacity-70" />
      <div className="absolute top-48 -left-20 w-72 h-72 rounded-full bg-gradient-to-tr from-pink-100/60 via-pink-50/40 to-transparent blur-3xl opacity-60" />
      <div className="absolute top-[600px] -right-24 w-80 h-80 rounded-full bg-gradient-to-bl from-rose-100/50 via-pink-100/30 to-transparent blur-3xl opacity-55" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-t from-pink-200/45 via-pink-50/30 to-transparent blur-3xl opacity-60" />

      {/* 2. SVG Vetorial de Alta Resolução com Ondas de Seda & Filamentos Dourados/Rosa */}
      <svg
        className="absolute inset-0 w-full h-full opacity-65"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 480 1200"
      >
        <defs>
          {/* Gradiente Dourado Orgânico */}
          <linearGradient id="goldFilament" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0428C" stopOpacity="0.4" />
            <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#FBBF24" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E0428C" stopOpacity="0.35" />
          </linearGradient>

          {/* Gradiente Seda Rosa Topo */}
          <linearGradient id="silkWaveTop" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FDF2F8" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#FCE7F3" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Gradiente Seda Rosa Base */}
          <linearGradient id="silkWaveBottom" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#FDF2F8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Gradiente de Linhas Secundárias */}
          <linearGradient id="roseLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0428C" stopOpacity="0" />
            <stop offset="40%" stopColor="#E0428C" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#F472B6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E0428C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- ONDAS DE SEDA SUPERIORES --- */}
        <path
          d="M0,0 L480,0 L480,180 C360,220 280,140 160,200 C80,240 20,210 0,230 Z"
          fill="url(#silkWaveTop)"
        />
        <path
          d="M0,0 L480,0 L480,110 C340,160 260,80 140,140 C60,180 10,150 0,160 Z"
          fill="#FDF2F8"
          fillOpacity="0.5"
        />

        {/* --- FILAMENTOS FLUIDOS DOURADOS E ROSA NO TOPO --- */}
        <path
          d="M-20,130 Q120,60 240,160 T490,140"
          fill="none"
          stroke="url(#goldFilament)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M-10,170 Q140,120 280,210 T500,180"
          fill="none"
          stroke="url(#roseLine)"
          strokeWidth="1"
          strokeDasharray="4 3"
        />
        <path
          d="M-30,220 Q160,190 320,260 T510,240"
          fill="none"
          stroke="url(#goldFilament)"
          strokeWidth="0.8"
        />

        {/* --- FILAMENTOS FLUIDOS NO MEIO DA TELA --- */}
        <path
          d="M-20,580 Q100,520 260,610 T500,570"
          fill="none"
          stroke="url(#roseLine)"
          strokeWidth="0.9"
          strokeDasharray="6 4"
        />
        <path
          d="M-10,640 Q150,590 300,680 T510,630"
          fill="none"
          stroke="url(#goldFilament)"
          strokeWidth="0.75"
        />

        {/* --- ONDAS DE SEDA INFERIORES --- */}
        <path
          d="M0,980 C120,940 220,1030 340,970 C420,930 460,950 480,960 L480,1200 L0,1200 Z"
          fill="url(#silkWaveBottom)"
        />
        <path
          d="M0,1050 C140,1000 240,1080 360,1030 C430,1000 460,1010 480,1020 L480,1200 L0,1200 Z"
          fill="#FDF2F8"
          fillOpacity="0.45"
        />

        {/* --- FILAMENTOS FLUIDOS DOURADOS NA BASE --- */}
        <path
          d="M-20,990 Q140,920 280,1010 T500,970"
          fill="none"
          stroke="url(#goldFilament)"
          strokeWidth="1.2"
        />
        <path
          d="M-10,1040 Q180,980 340,1060 T510,1020"
          fill="none"
          stroke="url(#roseLine)"
          strokeWidth="0.85"
        />

        {/* Pontos sutis de brilho orgânico */}
        <circle cx="120" cy="110" r="1.5" fill="#F59E0B" fillOpacity="0.6" />
        <circle cx="280" cy="180" r="1.2" fill="#E0428C" fillOpacity="0.5" />
        <circle cx="390" cy="130" r="1.8" fill="#F59E0B" fillOpacity="0.55" />
        <circle cx="90" cy="620" r="1.3" fill="#E0428C" fillOpacity="0.45" />
        <circle cx="380" cy="650" r="1.5" fill="#F59E0B" fillOpacity="0.5" />
        <circle cx="160" cy="980" r="1.6" fill="#F59E0B" fillOpacity="0.6" />
        <circle cx="320" cy="1030" r="1.2" fill="#E0428C" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
