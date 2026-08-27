'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const sizeClasses = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-3 text-sm gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-base gap-2.5 min-h-[52px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-dark)] text-white shadow-md shadow-[var(--color-brand-primary)]/20 border border-transparent',
    secondary:
      'bg-[var(--color-brand-secondary-soft)] hover:bg-cyan-100/60 text-[var(--color-brand-secondary)] border border-cyan-100',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs',
    ghost:
      'bg-transparent hover:bg-slate-100/80 text-slate-600 border border-transparent',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
