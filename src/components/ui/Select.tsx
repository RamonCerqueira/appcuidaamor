'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Avatar } from './Avatar';

export interface SelectOption {
  value: string | number;
  label: string;
  sublabel?: string;
  avatarSrc?: string | null;
  icon?: React.ReactNode;
  badge?: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string | number | null;
  onChange: (value: any) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Select({
  label,
  error,
  placeholder = 'Selecione uma opção...',
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  id: externalId,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const selectId = externalId || generatedId;
  const errorId = `${selectId}-error`;

  const selectedOption = options.find((opt) => opt.value === value);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        if (currentIndex < options.length - 1) {
          onChange(options[currentIndex + 1].value);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        if (currentIndex > 0) {
          onChange(options[currentIndex - 1].value);
        }
      }
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 ml-1 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <button
          type="button"
          id={selectId}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-white text-left text-sm font-medium rounded-2xl border transition-all duration-200 outline-none select-none cursor-pointer ${
            disabled
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              : error
              ? 'border-rose-300 ring-2 ring-rose-100'
              : isOpen
              ? 'border-[var(--color-brand-primary)] ring-3 ring-[var(--color-brand-primary)]/10 shadow-sm'
              : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {selectedOption ? (
              <>
                {selectedOption.avatarSrc !== undefined && (
                  <Avatar
                    src={selectedOption.avatarSrc}
                    name={selectedOption.label}
                    size="sm"
                    variant="pink"
                  />
                )}
                {selectedOption.icon && (
                  <div className="text-[var(--color-brand-primary)] shrink-0">
                    {selectedOption.icon}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-slate-800 font-semibold truncate text-sm">
                    {selectedOption.label}
                  </span>
                  {selectedOption.sublabel && (
                    <span className="text-[11px] text-slate-400 font-medium truncate">
                      {selectedOption.sublabel}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <span className="text-slate-400 text-sm font-normal">{placeholder}</span>
            )}
          </div>

          <ChevronDown
            size={18}
            className={`text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[var(--color-brand-primary)]' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
          >
            {options.length === 0 ? (
              <li className="px-4 py-3 text-center text-xs font-semibold text-slate-400">
                Nenhuma opção disponível
              </li>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-sm ${
                      isSelected
                        ? 'bg-pink-50/80 text-[var(--color-brand-primary)] font-semibold'
                        : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {option.avatarSrc !== undefined && (
                        <Avatar
                          src={option.avatarSrc}
                          name={option.label}
                          size="sm"
                          variant={isSelected ? 'pink' : 'slate'}
                        />
                      )}
                      {option.icon && (
                        <div
                          className={`shrink-0 ${
                            isSelected ? 'text-[var(--color-brand-primary)]' : 'text-slate-400'
                          }`}
                        >
                          {option.icon}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-[11px] text-slate-400 font-medium truncate">
                            {option.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {option.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {option.badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check size={16} className="text-[var(--color-brand-primary)] stroke-[2.5]" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
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
