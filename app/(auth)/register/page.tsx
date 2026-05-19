'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (fullName.length < 2) newErrors.fullName = 'Name is too short.';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email address.';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!agreeTerms) newErrors.terms = 'You must agree to the terms.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setFormError(null);
    
    const { error: registerError } = await register(email, password, fullName);
    
    if (registerError) {
      setFormError(registerError);
      setLoading(false);
    } else {
      toast.success('Welcome to the movement!');
      router.push('/');
    }
  };

  return (
    <div className="w-full max-w-md animate-fadeUp">
      <div className="bg-[#121212] border border-[#C8A24A]/20 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gold/5 blur-3xl -ml-12 -mt-12" />
        
        <div className="text-center mb-10">
          <p className="text-[10px] text-gold font-bold uppercase tracking-[0.3em] mb-4">
            &quot;You are the light of the world&quot; — Matthew 5:14
          </p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-gold text-3xl font-cinzel leading-none">✦</span>
            <h1 className="text-3xl font-bold font-cinzel tracking-tighter text-white">
              Christ Light
            </h1>
          </div>
          <p className="text-gray-500 text-xs font-inter uppercase tracking-widest">Join the global movement</p>
        </div>

        {formError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold mb-6">
            {formError}
          </div>
        )}

        <div className="space-y-5">
          <Input 
            label="Full Name"
            placeholder="Grace Thompson"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          <Input 
            label="Email Address"
            placeholder="grace@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input 
            label="Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            rightElement={
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Input 
            label="Confirm Password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <div className="flex items-start gap-3 px-1">
            <div className="relative flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-gold focus:ring-gold/30"
              />
            </div>
            <label htmlFor="terms" className="text-[10px] text-gray-500 font-medium">
              I agree to the <Link href="/terms" virtual-link="true" className="text-gold">Terms of Service</Link> and <Link href="/privacy" virtual-link="true" className="text-gold">Privacy Policy</Link>.
            </label>
          </div>
          {errors.terms && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase">{errors.terms}</p>}

          <Button 
            className="w-full py-4 text-xs mt-2" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
          </Button>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-4 text-[9px] font-bold uppercase tracking-widest text-gray-600 bg-[#121212]">
              or
            </span>
          </div>

          <button 
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full py-3.5 transition-all group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Join with Google</span>
          </button>

          <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest pt-4">
            Already have an account? <Link href="/login" className="text-gold hover:text-white transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
