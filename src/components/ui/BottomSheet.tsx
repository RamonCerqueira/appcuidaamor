'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-t-[2.5rem] p-6 pb-12 shadow-2xl border-t border-slate-100 flex flex-col gap-5 animate-in slide-in-from-bottom-8 duration-300 max-h-[85vh] overflow-y-auto">
        {/* Handle visual */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto -mt-2 mb-1" />

        <div className="flex items-center justify-between">
          {title ? (
            <h3 className="text-lg font-black text-slate-800 tracking-tight">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
