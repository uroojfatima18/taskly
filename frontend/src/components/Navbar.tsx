'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  variant?: 'light' | 'dark';
  withBorder?: boolean;
}

export function Navbar({ variant = 'dark', withBorder = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 transition-all duration-300 bg-dark-surface border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center shadow-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">Taskly</span>
              <span className="text-xs text-neutral-400 hidden sm:block">Task Management</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/dashboard" className="px-4 py-2 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300">
              Dashboard
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300">
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-6 bg-current transform transition-all duration-300 origin-center ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0 scale-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transform transition-all duration-300 origin-center ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2 bg-dark-elevated border-t border-dark-border">
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 active:scale-[0.98]"
          >
            Dashboard
          </Link>
          <div className="h-px bg-dark-border my-2" />
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 active:scale-[0.98]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-lg font-medium text-center bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:opacity-90 transition-all duration-300 active:scale-[0.98]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
