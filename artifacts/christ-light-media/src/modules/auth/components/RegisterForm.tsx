
import { useState } from 'react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  hasValidationErrors,
  validateRegister,
  type ValidationErrors,
} from '../lib/validators';
import { AuthCard } from './AuthCard';
import { FormError } from './FormError';
import { GoogleAuthButton } from './GoogleAuthButton';

export function RegisterForm() {
  const { register, loginWithGoogle } = useAuth();
  const [, navigate] = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleRegister = async () => {
    const validationErrors = validateRegister(
      fullName,
      email,
      password,
      confirmPassword,
      agreeTerms
    );
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;

    setLoading(true);
    setFormError(null);

    const result = await register({ email, password, fullName });

    if (result.error) {
      setFormError(result.error);
      setLoading(false);
      return;
    }

    if (result.needsEmailConfirmation) {
      toast.success('Check your email to confirm your account.');
      navigate('/login');
    } else {
      toast.success('Welcome to In For Christ Media!');
      navigate('/');
    }
  };

  return (
    <AuthCard
      verse='"You are the light of the world" — Matthew 5:14'
      subtitle="Join the global movement"
      accent="left"
    >
      {formError && <FormError message={formError} />}

      <div className="space-y-5">
        <Input
          label="Full Name"
          placeholder="Grace Thompson"
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
          error={errors.fullName}
        />
        <Input
          label="Email Address"
          placeholder="grace@example.com"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          error={errors.password}
          rightElement={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 transition-colors hover:text-white"
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
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-3 px-1">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e: any) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/10 bg-card text-gold focus:ring-gold/30"
          />
          <span className="text-[10px] font-medium text-gray-500">
            I agree to the{' '}
            <Link href="/terms" className="text-gold hover:text-white">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-gold hover:text-white">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.terms && (
          <p className="ml-1 text-[10px] font-bold uppercase text-red-500">{errors.terms}</p>
        )}

        <Button className="mt-2 w-full py-4 text-xs" onClick={handleRegister} disabled={loading}>
          {loading ? 'Creating Account...' : 'Create My Account'}
        </Button>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative bg-surface px-4 text-[9px] font-bold uppercase tracking-widest text-gray-600">
            or
          </span>
        </div>

        <GoogleAuthButton label="Join with Google" onClick={() => loginWithGoogle('/')} />

        <p className="pt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-gold transition-colors hover:text-white">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
