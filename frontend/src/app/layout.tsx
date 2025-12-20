// T015: Root layout with AuthProvider wrapper
// T040: Add error boundary and fallback UI

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundary';
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
        <ErrorBoundaryWrapper>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
