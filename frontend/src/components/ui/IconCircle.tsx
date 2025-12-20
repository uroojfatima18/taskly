'use client';

import { ReactNode } from 'react';

interface IconCircleProps {
  icon: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'accent' | 'success' | 'error';
  badge?: string | number;
  className?: string;
}

export function IconCircle({
  icon,
  size = 'md',
  color = 'primary',
  badge,
  className = '',
}: IconCircleProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'bg-primary-600/20 text-primary-400',
    accent: 'bg-accent-600/20 text-accent-400',
    success: 'bg-success-600/20 text-success-400',
    error: 'bg-red-600/20 text-red-400',
  };

  const sizeIconClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
  };

  return (
    <div className={`relative inline-flex ${className}`}>
      <div
        className={`flex items-center justify-center rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      >
        <div className={sizeIconClasses[size]}>{icon}</div>
      </div>

      {/* Badge in top-right corner */}
      {badge !== undefined && (
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {badge}
        </div>
      )}
    </div>
  );
}
