'use client';

import React, { useId } from 'react';

/**
 * Componente Input acessível.
 *
 * CORREÇÕES DE ACESSIBILIDADE (P2.4):
 * - label associada ao input via htmlFor + id (WCAG 1.3.1)
 * - aria-describedby para mensagens de erro
 * - aria-invalid quando há erro
 * - id gerado automaticamente via useId() se não fornecido
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', id: externalId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = externalId || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center group w-full">
          {leftIcon && (
            <div
              className="absolute left-4 flex items-center justify-center text-slate-400 group-focus-within:text-[var(--color-brand-primary)] transition-colors pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`w-full ${leftIcon ? 'pl-11' : 'pl-4'} ${
              rightIcon ? 'pr-12' : 'pr-4'
            } py-3.5 bg-white text-slate-800 text-sm font-medium rounded-2xl border ${
              error
                ? 'border-rose-300 ring-2 ring-rose-100'
                : 'border-slate-200/90 focus:border-[var(--color-brand-primary)] focus:ring-3 focus:ring-[var(--color-brand-primary)]/10'
            } transition-all duration-200 placeholder:text-slate-400 outline-none shadow-xs ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-xs font-semibold text-rose-500 ml-1 mt-0.5">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
