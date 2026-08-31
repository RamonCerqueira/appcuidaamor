'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-500 shrink-0" />,
    info: <Info size={18} className="text-blue-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-100 bg-white/95 text-slate-800 shadow-emerald-500/10',
    error: 'border-rose-100 bg-white/95 text-slate-800 shadow-rose-500/10',
    info: 'border-blue-100 bg-white/95 text-slate-800 shadow-blue-500/10',
  }[type];

  return createPortal(
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-[360px] w-[90%] p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${borderStyles}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-xs font-bold leading-tight">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>,
    document.body
  );
}

