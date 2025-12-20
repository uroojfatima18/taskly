'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'elevated' | 'gradient' | 'subtle';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = '',
  variant = 'gradient',
  hover = true,
  onClick,
}: GlassCardProps) {
  const variants = {
    elevated:
      'bg-dark-surface rounded-2xl shadow-elevated border border-dark-border',
    gradient:
      'bg-dark-elevated rounded-2xl shadow-sm-elevated border border-dark-border/50 bg-gradient-card',
    subtle:
      'backdrop-blur-md bg-dark-elevated/40 rounded-2xl border border-dark-border/20',
  };

  const hoverClass = hover ? 'hover:shadow-lifted transition-all duration-300' : '';

  return (
    <div
      className={`${variants[variant]} ${hoverClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
