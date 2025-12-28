interface TasklyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TasklyLogo({ size = 'md', className = '' }: TasklyLogoProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} ${className} relative`}>
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="taskly-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="taskly-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer Circle with Glow */}
        <circle cx="20" cy="20" r="18" fill="url(#taskly-glow)" opacity="0.2" />

        {/* Main Circle Border */}
        <circle
          cx="20"
          cy="20"
          r="16"
          stroke="url(#taskly-gradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Checkmark */}
        <path
          d="M12 20 L17.5 25.5 L28 15"
          stroke="url(#taskly-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Small Sparkle Top Right */}
        <path
          d="M28 8 L28 10 M29 9 L27 9"
          stroke="url(#taskly-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Small Sparkle Bottom Left */}
        <path
          d="M10 30 L10 32 M11 31 L9 31"
          stroke="url(#taskly-gradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
