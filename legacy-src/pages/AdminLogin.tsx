import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  // If already logged in and loading is done, redirect based on role
  if (!loading && user) {
    if (userData?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await authService.login(email, password);
      // Determine direction after login based on role fetched
      const role = await authService.getUserRole(userCredential.user.uid);
      
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/invalid-credential') {
          setError('Invalid email or password.');
        } else if (err.code === 'auth/user-not-found') {
          setError('User not found.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-base flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[160px]"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-10 text-white animate-fade-in-up flex flex-col items-center">
          <img src="/logo.png" alt="Christ Light Media Logo" className="h-32 mb-6 object-contain drop-shadow-[0_0_15px_rgba(200,162,74,0.4)]" />
          <h1 className="sr-only">
            Christ Light Media
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            A Light of Christ Through Media & Ministry
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                placeholder="admin@christlightmedia.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold-light text-primary-base font-bold py-3.5 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-gold hover:border-white/20 hover:shadow-[0_0_20px_rgba(200,162,74,0.3)]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
