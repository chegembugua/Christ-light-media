import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next') || '/';

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate(next);
      } else {
        supabase.auth.exchangeCodeForSession(window.location.href)
          .then(() => navigate(next))
          .catch(() => navigate('/login'));
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Signing you in…</p>
      </div>
    </div>
  );
}
