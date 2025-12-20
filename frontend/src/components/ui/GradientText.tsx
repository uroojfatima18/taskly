'use client';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'accent';
  className?: string;
}

export function GradientText({
  children,
  variant = 'primary',
  className = '',
}: GradientTextProps) {
  const variants = {
    primary:
      'bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent',
    cyan: 'bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent',
    accent:
      'bg-gradient-to-r from-accent-400 via-accent-500 to-cyan-400 bg-clip-text text-transparent',
  };

  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
