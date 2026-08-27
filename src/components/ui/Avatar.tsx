'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'pink' | 'teal' | 'slate';
  active?: boolean;
}

export function Avatar({
  src,
  name = 'Cuida Amor',
  size = 'md',
  variant = 'pink',
  active = false,
}: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CA';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
  }[size];

  const variantClasses = {
    pink: 'bg-gradient-to-br from-pink-50 to-pink-100/80 text-[var(--color-brand-primary)] border-pink-100',
    teal: 'bg-gradient-to-br from-cyan-50 to-cyan-100/80 text-[var(--color-brand-secondary)] border-cyan-100',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[variant];

  return (
    <div className="relative shrink-0 inline-block">
      <div
        className={`${sizeClasses} ${variantClasses} rounded-full border flex items-center justify-center font-bold overflow-hidden select-none shadow-sm`}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {active && (
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/20" />
      )}
    </div>
  );
}
