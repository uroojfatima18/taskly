'use client';

import { motion, type Variants } from 'framer-motion';
import { GradientText } from '@/components/ui/GradientText';

export function AnimatedChaosSection() {
  const easeOutQuad: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const leftBoxVariants: Variants = {
    hidden: {
      opacity: 0,
      x: -50,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const rightBoxVariants: Variants = {
    hidden: {
      opacity: 0,
      x: 50,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const connectorVariants: Variants = {
    hidden: {
      opacity: 0,
      scaleX: 0,
    },
    visible: {
      opacity: 1,
      scaleX: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        delay: 0.35,
      },
    },
  };

  const arrowVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
        delay: 0.5,
      },
    },
  };

  return (
    <section className="py-16 sm:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-neutral-100 via-neutral-100 to-neutral-100 bg-clip-text text-transparent leading-tight"
            variants={itemVariants}
            style={{
              textShadow: '0 0 30px rgba(139, 92, 246, 0.15)',
              letterSpacing: '-0.02em',
            }}
          >
            <span className="text-neutral-100">From chaos to </span>
            <GradientText variant="accent">clarity</GradientText>
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-regular tracking-wide leading-relaxed"
            variants={itemVariants}
          >
            We understand the struggle. That&apos;s why we built something different.
          </motion.p>
        </motion.div>

        {/* Problem & Solution Grid with Connection */}
        <motion.div
          className="relative grid md:grid-cols-2 gap-12 lg:gap-16 overflow-visible"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Connecting Arrow (hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <motion.div className="flex items-center gap-2" initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div
                className="w-12 h-0.5 bg-gradient-to-r from-red-500/50 to-purple-500/50 hover:from-red-500/80 hover:to-purple-500/80 transition-all duration-300"
                variants={connectorVariants}
              />
              <motion.svg
                className="w-8 h-8 text-purple-400 animate-arrow-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                variants={arrowVariants}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
              <motion.div
                className="w-12 h-0.5 bg-gradient-to-r from-purple-500/50 to-purple-500/50 hover:from-purple-500/80 hover:to-purple-500/80 transition-all duration-300"
                variants={connectorVariants}
              />
            </motion.div>
          </div>

          {/* The Problem Column */}
          <motion.div
            className="group relative p-10 rounded-2xl backdrop-blur-xl bg-red-950/10 border border-red-500/20 transition-all duration-500 hover:border-red-500/60 hover:shadow-[0_0_50px_rgba(239,68,68,0.3)] hover:bg-red-950/20 hover:scale-[1.02] shadow-sm-elevated"
            variants={leftBoxVariants}
          >
            <div className="flex items-center gap-3 mb-12">
              <div
                className="relative w-12 h-12 rounded-xl bg-red-600/20 flex items-center justify-center transition-all duration-500 group-hover:bg-red-600/35 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(239,68,68,0.2), rgba(239,68,68,0.05))',
                }}
              >
                <svg className="w-7 h-7 text-red-400 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">The Problem</h3>
            </div>

            <div className="space-y-5">
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-red-950/20 hover:bg-red-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-300">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-all duration-300"></div>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">Endless to-do lists overwhelm you</p>
              </div>
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-red-950/20 hover:bg-red-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-450">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-all duration-300"></div>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">Tasks scattered across multiple tools</p>
              </div>
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-red-950/20 hover:bg-red-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-600">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-all duration-300"></div>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">You lose sight of what truly matters</p>
              </div>
            </div>
          </motion.div>

          {/* The Solution Column */}
          <motion.div
            className="group relative p-10 rounded-2xl backdrop-blur-xl bg-purple-950/10 border border-purple-500/20 transition-all duration-500 hover:border-purple-500/60 hover:shadow-[0_0_50px_rgba(124,58,237,0.4)] hover:bg-purple-950/20 hover:scale-[1.02] shadow-sm-elevated"
            variants={rightBoxVariants}
          >
            <div className="flex items-center gap-3 mb-12">
              <div
                className="relative w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center transition-all duration-500 group-hover:bg-purple-600/35 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(124,58,237,0.25), rgba(124,58,237,0.05))',
                }}
              >
                <svg className="w-7 h-7 text-purple-400 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-neutral-100">The Solution</h3>
            </div>

            <div className="space-y-5">
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-400">
                <svg className="w-6 h-6 text-purple-400 flex-shrink-0 group-hover/item:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">Organize all tasks in one place</p>
              </div>
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-550">
                <svg className="w-6 h-6 text-purple-400 flex-shrink-0 group-hover/item:scale-125 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">Prioritize what really matters</p>
              </div>
              <div className="group/item flex items-start gap-4 p-5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 transition-all duration-300 animate-fade-in-up-stagger animation-delay-700">
                <svg className="w-6 h-6 text-purple-400 flex-shrink-0 group-hover/item:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 15l-3.5-3.5a1 1 0 10-1.4 1.4l4.2 4.2 9.8-9.8a1 1 0 00-1.4-1.4L10 15z" />
                </svg>
                <p className="text-neutral-300 group-hover/item:text-neutral-100 transition-colors leading-relaxed text-sm">Find clarity and achieve your goals</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
