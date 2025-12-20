'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { validateSignupForm } from '@/lib/validators';

export function SignupForm() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name: string | null;
    email: string | null;
    password: string | null;
    form: string | null;
  }>({
    name: null,
    email: null,
    password: null,
    form: null,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({ name: null, email: null, password: null, form: null });

    // Client-side validation
    const validation = validateSignupForm(name, email, password);

    if (!validation.isValid) {
      setErrors({
        name: validation.name.error,
        email: validation.email.error,
        password: validation.password.error,
        form: null,
      });
      return;
    }

    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      // Use window.location for reliable redirect after auth state change
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({
        name: null,
        email: null,
        password: null,
        form: error instanceof Error ? error.message : 'Signup failed. Please try again.',
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
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Your name"
        autoComplete="name"
        disabled={isLoading}
        required
      />

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
        placeholder="At least 6 characters"
        autoComplete="new-password"
        disabled={isLoading}
        required
      />

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        className="w-full"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
