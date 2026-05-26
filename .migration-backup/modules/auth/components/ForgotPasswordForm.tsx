'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { validateForgotPassword } from '../lib/validators';
import { AuthCard } from './AuthCard';
import { FormError } from './FormError';

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const validationError = validateForgotPassword(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await resetPassword(email);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSent(true);
    toast.success('Check your email for the reset link.');
    setLoading(false);
  };

  return (
    <AuthCard
      verse='"The Lord is near to all who call on Him" — Psalm 145:18'
      subtitle="Reset your password"
    >
      {error && <FormError message={error} />}

      {sent ? (
        <div className="space-y-6 text-center">
          <p className="text-sm text-gray-400">
            We sent a reset link to <span className="text-gold">{email}</span>. Check your inbox
            and follow the link to set a new password.
          </p>
          <Link
            href="/login"
            className="inline-block text-[10px] font-bold uppercase tracking-widest text-gold hover:text-white"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>
          <Input
            label="Email Address"
            placeholder="grace@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <Button className="w-full py-4 text-xs" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <Link href="/login" className="text-gold hover:text-white">
              Back to sign in
            </Link>
          </p>
        </div>
      )}
    </AuthCard>
  );
}
