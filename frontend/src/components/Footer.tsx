import Link from 'next/link';
import { TasklyLogo } from '@/components/ui/TasklyLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'X',
      href: 'https://x.com/UroojFatim38290',
      label: 'Follow on X',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/uroojfatima18',
      label: 'View GitHub profile',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/urooj-fatima-b2698431a/',
      label: 'Connect on LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-dark-elevated border-t border-dark-border/30 overflow-hidden">
      {/* Subtle gradient orbs */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-600/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Brand Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <TasklyLogo size="md" className="transition-transform duration-300 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">Taskly</span>
              <span className="text-xs text-neutral-500">Simplify Your Day</span>
            </div>
          </Link>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-dark-surface/50 border border-dark-border/50 text-neutral-400 transition-all duration-300 hover:text-white hover:border-primary-500/50 hover:bg-dark-surface hover:shadow-glow-purple focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-elevated"
                aria-label={social.label}
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  {social.icon}
                </span>
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-600/0 to-accent-600/0 group-hover:from-primary-600/10 group-hover:to-accent-600/10 transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-neutral-500 text-center">
            {currentYear} Taskly. Built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}
