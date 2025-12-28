'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TasklyLogo } from '@/components/ui/TasklyLogo';

interface NavbarProps {
  variant?: 'light' | 'dark';
  withBorder?: boolean;
}

export function Navbar({ variant = 'dark', withBorder = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on ESC key press
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isMenuOpen, handleEscapeKey]);

  return (
    <nav
      className="sticky top-0 z-40 transition-all duration-300 bg-dark-surface border-b border-dark-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <TasklyLogo size="md" className="transition-transform duration-300 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text">Taskly</span>
              <span className="text-xs text-neutral-400 hidden sm:block">Task Management</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-4 py-3 min-h-[44px] rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface flex items-center"
            >
              Dashboard
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-3 min-h-[44px] rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface flex items-center"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-primary text-sm min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 min-w-[44px] min-h-[44px] rounded-lg text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-surface flex items-center justify-center"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
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
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
        role="menu"
        aria-hidden={!isMenuOpen}
      >
        <div className="px-4 py-4 space-y-2 bg-dark-elevated border-t border-dark-border">
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 min-h-[44px] rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-500"
            role="menuitem"
          >
            Dashboard
          </Link>
          <div className="h-px bg-dark-border my-2" aria-hidden="true" />
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 min-h-[44px] rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-dark-hover transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-500"
            role="menuitem"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 min-h-[44px] rounded-lg font-medium text-center bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:opacity-90 transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-300"
            role="menuitem"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
