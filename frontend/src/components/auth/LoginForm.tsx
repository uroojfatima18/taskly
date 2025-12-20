// T012: LoginForm component with email/password fields and validation

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { validateLoginForm } from '@/lib/validators';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email: string | null;
    password: string | null;
    form: string | null;
  }>({
    email: null,
    password: null,
    form: null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({ email: null, password: null, form: null });

    // Client-side validation
    const validation = validateLoginForm(email, password);

    if (!validation.isValid) {
      setErrors({
        email: validation.email.error,
        password: validation.password.error,
        form: null,
      });
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Use window.location for reliable redirect after auth state change
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({
        email: null,
        password: null,
        form: error instanceof Error ? error.message : 'Login failed. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div
          className="p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
        disabled={isLoading}
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
        disabled={isLoading}
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Sign in
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
