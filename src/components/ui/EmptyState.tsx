'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100/80 shadow-xs flex flex-col items-center justify-center text-center gap-3 my-2">
      <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[var(--color-brand-primary)] flex items-center justify-center border border-pink-100/60 mb-1">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <h4 className="text-base font-extrabold text-slate-800 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-500 font-medium max-w-[260px] leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
