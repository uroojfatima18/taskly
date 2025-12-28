import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GradientText } from '@/components/ui/GradientText';
import { IconCircle } from '@/components/ui/IconCircle';
import { GlassCard } from '@/components/ui/GlassCard';
import { AnimatedStepCard } from '@/components/AnimatedStepCard';
import { ListChecks, Eye, ShieldCheck, Zap } from 'lucide-react';
import { AnimatedChaosSection } from '@/components/animations/AnimatedChaosSection';

export const metadata = {
  title: 'Taskly - Modern Task Management',
  description: 'A sophisticated task management tool to keep you organized and productive.',
};

export default function HomePage() {
  const features = [
    {
      title: 'Create & Manage',
      description: 'Add, organize, and prioritize with ease.',
      icon: ListChecks,
    },
    {
      title: 'Stay Focused',
      description: 'Clean interface. Zero distractions.',
      icon: Eye,
    },
    {
      title: 'Secure & Private',
      description: 'Your data stays yours. Always.',
      icon: ShieldCheck,
    },
    {
      title: 'Fast & Responsive',
      description: 'Instant. On any device.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar variant="light" withBorder={true} />

      {/* Main Content */}
      <main className="flex-1" id="main-content" role="main">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Gradient Background - Clean dark theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg"></div>

          {/* Subtle background orbs - reduced opacity and blur */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-600/5 rounded-full blur-2xl -translate-y-1/2 animate-float-orb"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent-600/5 rounded-full blur-2xl translate-y-1/2 animate-float-orb animation-delay-300"></div>

          {/* Soft glow - only behind primary button */}
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-primary-500/8 rounded-full blur-2xl -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
            <div className="text-center">
              {/* Main Heading - Typography Hierarchy Improved */}
              <h1 className="font-bold mb-4 sm:mb-6 animate-bounce-in-hero">
                <span className="text-neutral-100 block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-2">Task management, simplified with</span>
                <span className="gradient-text animate-shimmer-shine bg-gradient-to-r from-primary-600 via-accent-400 to-primary-600 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">Taskly</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-neutral-300 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
                Manage every task with clarity — all in one dashboard.
              </p>

              {/* CTA Buttons - Balanced Design */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-4 sm:px-0 animate-slide-up animation-delay-300">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 min-h-[48px] bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg"
                  aria-label="Create your free Taskly account - no credit card required"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Start Here
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 min-h-[48px] bg-transparent text-neutral-100 font-semibold rounded-xl border-2 border-primary-500/50 hover:border-primary-400 hover:bg-primary-500/10 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg"
                  aria-label="Try interactive demo without signing up"
                >
                  View Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* From Chaos to Clarity Section */}
        <AnimatedChaosSection />

        {/* Features Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
                <span className="text-neutral-100">Everything you need to </span>
                <GradientText variant="primary">get things done</GradientText>
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto animate-slide-up animation-delay-100">
                Simple yet powerful features designed for maximum productivity.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const delayClass = [
                  'animation-delay-100',
                  'animation-delay-200',
                  'animation-delay-300',
                  'animation-delay-400',
                ][index] || '';
                return (
                  <GlassCard
                    key={index}
                    variant="gradient"
                    className={`group p-6 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] hover:border-primary-500/50 hover:-translate-y-2 hover-tilt-3d transition-all duration-500 animate-slide-up ${delayClass}`}
                  >
                    <div className="mb-6 transition-all duration-500 group-hover:scale-125">
                      <IconCircle
                        icon={<IconComponent className="w-6 h-6 group-hover-spin" />}
                        size="lg"
                        color="primary"
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-100 mb-3 group-hover:text-primary-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed text-sm group-hover:text-neutral-300 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Simple as 1, 2, 3 Section */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          {/* Animated gradient background elements */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent-600/5 rounded-full blur-3xl animate-pulse-glow animation-delay-400"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl animate-float-slow"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 animate-slide-up">
                <span className="text-neutral-100">Simple as </span>
                <GradientText variant="primary">1, 2, 3</GradientText>
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto animate-slide-up animation-delay-100">
                Get started in minutes, not hours.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 - Sign Up */}
              <AnimatedStepCard
                icon={
                  <IconCircle
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {/* User icon - clear account creation representation */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                        {/* Plus icon overlay */}
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 8v3m0 0v3m0-3h3m-3 0h-3"
                        />
                      </svg>
                    }
                    size="lg"
                    color="primary"
                    badge="01"
                  />
                }
                title="Sign Up"
                description="Create your free account in seconds"
                variant="primary"
                delayMs={100}
              />

              {/* Step 2 - Add Tasks */}
              <AnimatedStepCard
                icon={
                  <IconCircle
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    }
                    size="lg"
                    color="primary"
                    badge="02"
                  />
                }
                title="Add Tasks"
                description="Capture everything on your mind"
                variant="primary"
                delayMs={200}
              />

              {/* Step 3 - Stay Organized */}
              <AnimatedStepCard
                icon={
                  <IconCircle
                    icon={
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                    size="lg"
                    color="accent"
                    badge="03"
                  />
                }
                title="Stay Organized"
                description="Focus, complete, and repeat"
                variant="accent"
                delayMs={300}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-20 overflow-hidden">
          {/* Gradient background - more visible */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-dark-surface to-accent-900/30"></div>

          {/* Top and bottom accent lines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent"></div>

          {/* Background orbs - more visible */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl -translate-y-1/2 animate-float-orb"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-600/15 rounded-full blur-3xl translate-y-1/2 animate-float-orb animation-delay-300"></div>

          {/* Centered glow behind content - more visible */}
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 animate-slide-up">
              Your Productive Day Starts Here
            </h2>
            <p className="text-xl text-neutral-300 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-100 leading-relaxed">
              Take the first step toward clarity and focus.
              <span className="block mt-2 text-primary-300">No credit card required.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0 animate-slide-up animation-delay-200">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center px-8 py-4 min-h-[48px] bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] transform hover:scale-105 transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 animate-breathe"
                aria-label="Create your free Taskly account"
              >
                Start Free Today
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 min-h-[48px] bg-dark-surface/80 text-neutral-100 font-semibold rounded-xl border-2 border-primary-500/30 hover:border-primary-500/80 hover:bg-dark-surface shadow-md transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Try Taskly demo without creating an account"
              >
                View Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
