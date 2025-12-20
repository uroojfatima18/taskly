// T008: Reusable Button component with variants (primary, secondary, danger)
// UI-ENHANCED: Added size variants, micro-interactions, improved visual feedback

'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md shadow-primary-600/20 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-600/30 focus:ring-primary-500 disabled:from-primary-400 disabled:to-primary-500 disabled:shadow-none',
  secondary:
    'bg-dark-elevated text-neutral-100 border border-dark-border hover:bg-dark-hover hover:border-primary-500/50 focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-600/20 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-600/30 focus:ring-red-500 disabled:from-red-400 disabled:to-red-500 disabled:shadow-none',
  ghost:
    'bg-transparent text-neutral-400 hover:bg-dark-elevated hover:text-neutral-100 focus:ring-primary-600 transition-all duration-200',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
