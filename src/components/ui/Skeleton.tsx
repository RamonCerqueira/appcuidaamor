'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const variantClasses = {
    rect: 'rounded-2xl',
    circle: 'rounded-full',
    text: 'rounded-md h-4',
  }[variant];

  return (
    <div
      className={`bg-slate-200/70 animate-pulse ${variantClasses} ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14" variant="circle" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="w-3/4 h-5" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  );
}
