'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { validateNewPassword } from '../lib/validators';
import { AuthCard } from './AuthCard';
import { FormError } from './FormError';

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const validationError = validateNewPassword(password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await updatePassword(password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    toast.success('Password updated successfully!');
    router.push('/login');
  };

  return (
    <AuthCard
      verse='"Be strong and courageous" — Joshua 1:9'
      subtitle="Set a new password"
    >
      {error && <FormError message={error} />}

      <div className="space-y-6">
        <Input
          label="New Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        <Input
          label="Confirm Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button className="w-full py-4 text-xs" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <Link href="/login" className="text-gold hover:text-white">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
