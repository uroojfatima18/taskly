import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GradientText } from '@/components/ui/GradientText';
import { IconCircle } from '@/components/ui/IconCircle';
import { GlassCard } from '@/components/ui/GlassCard';
import { ListChecks, Eye, ShieldCheck, Zap } from 'lucide-react';

export const metadata = {
  title: 'Taskly - Modern Task Management',
  description: 'A sophisticated task management tool to keep you organized and productive.',
};

export default function HomePage() {
  const features = [
    {
      title: 'Create & Manage Tasks',
      description: 'Effortlessly add, organize, and prioritize your tasks with intuitive controls.',
      icon: ListChecks,
    },
    {
      title: 'Stay Focused',
      description: 'A clean, distraction-free interface designed to keep you in the zone.',
      icon: Eye,
    },
    {
      title: 'Secure & Private',
      description: 'Your data is protected with JWT-based authentication and encryption.',
      icon: ShieldCheck,
    },
    {
      title: 'Fast & Responsive',
      description: 'Lightning-fast performance on any device, anywhere you work.',
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navbar variant="light" withBorder={true} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Gradient Background - Dark theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-elevated"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
            <div className="text-center">
              {/* Badge */}
              <div className="mb-6 flex justify-center">
                <div className="badge-primary animate-fade-in">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Crafted for Productivity
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
                <span className="text-neutral-100">Get Things </span>
                <span className="gradient-text">Done</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-neutral-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
                A sleek task manager for staying focused, organized, and productive.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-300">
                <Link
                  href="/dashboard"
                  className="btn-primary text-center hover-lift"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Try Demo Now
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 bg-dark-surface text-primary-600 font-semibold rounded-xl border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 shadow-sm-elevated transition-all duration-300 text-center"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                <span className="text-neutral-100">Everything you need to </span>
                <GradientText variant="primary">get things done</GradientText>
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                Simple yet powerful features designed for maximum productivity.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                const delayClass = [
                  '',
                  'animation-delay-100',
                  'animation-delay-200',
                  'animation-delay-300',
                ][index] || '';
                return (
                  <GlassCard
                    key={index}
                    variant="gradient"
                    className={`group p-6 flex flex-col items-center text-center hover:shadow-lifted transition-all duration-300 animate-slide-up ${delayClass}`}
                  >
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                      <IconCircle
                        icon={<IconComponent className="w-6 h-6" />}
                        size="lg"
                        color="primary"
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-400 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* Simple as 1, 2, 3 Section */}
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-neutral-100">Simple as </span>
                <GradientText variant="primary">1, 2, 3</GradientText>
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                Get started in minutes, not hours.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 - Sign In */}
              <div className="flex flex-col items-center text-center animate-slide-up">
                <div className="mb-6">
                  <IconCircle
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h12.5A2.5 2.5 0 0121 16.5v3m0-6V7.5A2.5 2.5 0 0018.5 5H3"
                        />
                      </svg>
                    }
                    size="lg"
                    color="primary"
                    badge="01"
                  />
                </div>
                <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                  Sign In
                </h3>
                <p className="text-neutral-400">
                  Create your account in seconds
                </p>
              </div>

              {/* Step 2 - Add Tasks */}
              <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="mb-6">
                  <IconCircle
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
                <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                  Add Tasks
                </h3>
                <p className="text-neutral-400">
                  Capture everything on your mind
                </p>
              </div>

              {/* Step 3 - Stay Organized */}
              <div className="flex flex-col items-center text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="mb-6">
                  <IconCircle
                    icon={
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
                <h3 className="text-xl font-semibold text-neutral-100 mb-3">
                  Stay Organized
                </h3>
                <p className="text-neutral-400">
                  Focus, complete, and repeat
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* From Chaos to Clarity Section */}
        <section className="py-20 sm:py-28 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-neutral-100">From chaos to </span>
                <GradientText variant="accent">clarity</GradientText>
              </h2>
              <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
                We understand the struggle. That&apos;s why we built something different.
              </p>
            </div>

            {/* Problem & Solution Grid */}
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* The Problem Column */}
              <div className="card-gradient group hover-lift backdrop-blur-xl bg-red-950/10 border border-red-500/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                    <p className="text-neutral-300">Overwhelmed by endless to-do lists</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                    <p className="text-neutral-300">Tasks scattered across apps and notes</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                    <p className="text-neutral-300">No clarity on what matters most</p>
                  </div>
                </div>
              </div>

              {/* The Solution Column */}
              <div className="card-gradient group hover-lift backdrop-blur-xl bg-purple-950/10 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <p className="text-neutral-300">Crystal-clear task organization</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <p className="text-neutral-300">Focus on what moves the needle</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 15l-3.5-3.5a1 1 0 10-1.4 1.4l4.2 4.2 9.8-9.8a1 1 0 00-1.4-1.4L10 15z" />
                    </svg>
                    <p className="text-neutral-300">Flow state, not chaos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-600/20"></div>
          <div className="absolute inset-0 border-t border-b border-primary-600/30"></div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users who are already managing their tasks with Taskly.
              Start free today.
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-dark-surface text-primary-600 font-semibold rounded-xl shadow-lifted hover:shadow-lifted hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
