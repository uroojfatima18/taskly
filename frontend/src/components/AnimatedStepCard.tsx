'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedStepCardProps {
  /** Icon component or JSX to display in circle */
  icon: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description: string;
  /** Badge number (e.g., "01", "02", "03") */
  badge?: string;
  /** Color variant: "primary" or "accent" */
  variant?: 'primary' | 'accent';
  /** Stagger delay in milliseconds */
  delayMs?: number;
  /** Icon circular container color */
  iconColor?: string;
}

export function AnimatedStepCard({
  icon,
  title,
  description,
  badge,
  variant = 'primary',
  delayMs = 0,
  iconColor = 'primary',
}: AnimatedStepCardProps) {
  const glowColor = variant === 'accent' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(124, 58, 237, 0.15)';
  const shadowColor = variant === 'accent' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(124, 58, 237, 0.15)';
  const borderHoverColor = variant === 'accent' ? 'border-accent-500/50' : 'border-primary-500/50';
  const glowClass = variant === 'accent' ? 'hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'hover:shadow-[0_0_40px_rgba(124,58,237,0.15)]';
  const textHoverColor = variant === 'accent' ? 'group-hover:text-accent-300' : 'group-hover:text-primary-300';

  // Container animation with slide up + fade in
  const containerVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    inView: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: delayMs / 1000,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Icon scale animation on hover
  const iconVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Card hover with scale 1.03
  const cardVariants = {
    initial: {
      scale: 1,
    },
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      whileInView="inView"
      viewport={{ once: true, amount: 0.3 }}
      className="group"
    >
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        initial="initial"
        className="relative p-8 rounded-2xl backdrop-blur-sm bg-dark-elevated/40 border border-dark-border/50 transition-all duration-500 hover:border-primary-500/50 overflow-hidden"
      >
        {/* Radial gradient glow background - very subtle */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          }}
        ></div>

        {/* Gradient border effect on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600/0 via-transparent to-accent-600/0 group-hover:from-primary-600/10 group-hover:via-transparent group-hover:to-accent-600/10 transition-all duration-500 pointer-events-none ${
            variant === 'accent'
              ? 'group-hover:from-accent-600/10 group-hover:to-primary-600/10'
              : ''
          }`}
        ></div>

        <div className="relative flex flex-col items-center text-center">
          {/* Icon with hover animation */}
          <motion.div
            variants={iconVariants}
            whileHover="hover"
            initial="initial"
            className={`mb-8 transition-all duration-500 ${textHoverColor}`}
          >
            {icon}
          </motion.div>

          {/* Title with increased bottom margin for breathing room */}
          <h3 className="text-xl font-semibold text-neutral-100 mb-4 group-hover:text-primary-300 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300 leading-relaxed text-sm">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
