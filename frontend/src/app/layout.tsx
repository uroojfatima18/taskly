// T015: Root layout with AuthProvider wrapper
// T040: Add error boundary and fallback UI

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
import ChatWidget from '@/components/chat/ChatWidget';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Taskly',
  description: 'Manage your tasks efficiently with Taskly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-bg text-neutral-100`}>
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          Skip to main content
        </a>
        <ErrorBoundaryWrapper>
          <AuthProvider>
            {children}
            <ChatWidget />
          </AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
