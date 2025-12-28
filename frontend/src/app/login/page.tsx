'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { TasklyLogo } from '@/components/ui/TasklyLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const session = await api.login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Store token and user
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('auth_user', JSON.stringify(session.user));
      localStorage.setItem('is_demo_user', 'false'); // Mark as real user, not demo

      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({
        form: error instanceof Error ? error.message : 'Login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Back Link */}
      <div className="px-6 py-6 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to home</span>
        </Link>
      </div>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <TasklyLogo size="lg" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-taskly bg-clip-text text-transparent mb-3">
              Taskly
            </h1>
            <p className="text-neutral-400 text-sm">Welcome back! Sign in to continue.</p>
          </div>

          {/* Form Card */}
          <div className="bg-dark-surface rounded-2xl border border-dark-border p-8 backdrop-blur-sm">
            {errors.form && (
              <div className="mb-6 p-4 bg-red-950/50 border border-red-500/30 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-red-200 font-medium">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-dark-elevated border rounded-lg text-neutral-100 placeholder-neutral-500 outline-none transition-all ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                      : 'border-primary-600/30 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {errors.email && (
                  <p className="mt-2 text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-200 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-dark-elevated border rounded-lg text-neutral-100 placeholder-neutral-500 outline-none transition-all pr-12 ${
                      errors.password
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                        : 'border-primary-600/30 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 1.657-.672 3.157-1.757 4.243A6 6 0 0121 12a6 6 0 00-6-6 6 6 0 00-4.243 1.757M9 3l.894 2.682m4.612 0l.894-2.682M9 21l.894-2.682m4.612 0l.894 2.682" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 mt-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-[0.98] shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-neutral-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Login Option */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-500 mb-3">Just want to try it out?</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Try Demo Mode
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
