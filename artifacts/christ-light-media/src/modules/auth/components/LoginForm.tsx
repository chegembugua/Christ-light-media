
import { useState } from 'react';
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { validateLogin } from '../lib/validators';
import { AuthCard } from './AuthCard';
import { FormError } from './FormError';
import { GoogleAuthButton } from './GoogleAuthButton';

export function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectTo = searchParams.get('redirect') ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') ?? null
  );

  const handleLogin = async () => {
    const validationError = validateLogin(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login({ email, password });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    toast.success('Signed in successfully!');
    navigate(redirectTo);
  };

  return (
    <AuthCard
      verse='"I am the light of the world" — John 8:12'
      subtitle="Sign in to your account"
    >
      {error && <FormError message={error} />}

      <div className="space-y-6">
        <Input
          label="Email Address"
          placeholder="grace@example.com"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 transition-colors hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[10px] font-bold uppercase tracking-widest text-gold transition-colors hover:text-white"
          >
            Forgot password?
          </Link>
        </div>

        <Button className="w-full py-4 text-xs" onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <span className="relative bg-surface px-4 text-[9px] font-bold uppercase tracking-widest text-gray-600">
            or continue with
          </span>
        </div>

        <GoogleAuthButton label="Continue with Google" onClick={() => loginWithGoogle(redirectTo)} />

        <p className="pt-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-gold transition-colors hover:text-white">
            Join us
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
