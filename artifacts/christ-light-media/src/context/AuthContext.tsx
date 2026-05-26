
/**
 * Global auth provider — wires Supabase session to platform profile (Prisma).
 * Implementation delegates to modules/auth services.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'wouter';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase/client';
import {
  signInWithPassword,
  signUp,
  signInWithGoogle,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
} from '@/modules/auth/services/auth.client';
import {
  fetchUserProfile,
  syncPlatformProfile,
} from '@/modules/auth/services/profile.client';
import type {
  AuthContextValue,
  AuthUser,
  LoginInput,
  RegisterInput,
  UserProfile,
} from '@/modules/auth/types';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mergeUser(supabaseUser: AuthUser, profile: UserProfile | null): AuthUser {
  if (!profile) return supabaseUser;
  return {
    ...supabaseUser,
    fullName: profile.fullName,
    role: profile.role,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [, navigate] = useLocation();

  const loadProfile = useCallback(async (userId: string) => {
    const data = await fetchUserProfile(userId);
    setProfile(data);
    return data;
  }, []);

  const hydrateUser = useCallback(
    async (supabaseUser: AuthUser | null) => {
      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        return;
      }
      let data = await loadProfile(supabaseUser.id);

      if (!data && supabaseUser.email) {
        const fullName =
          typeof supabaseUser.user_metadata?.full_name === 'string'
            ? supabaseUser.user_metadata.full_name
            : null;
        await syncPlatformProfile({
          id: supabaseUser.id,
          email: supabaseUser.email,
          fullName,
        });
        data = await loadProfile(supabaseUser.id);
      }

      setUser(mergeUser(supabaseUser, data));
    },
    [loadProfile]
  );

  useEffect(() => {
    const init = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
      await hydrateUser((currentSession?.user as AuthUser | undefined) ?? null);
      setLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, nextSession: Session | null) => {
        setSession(nextSession);
        await hydrateUser((nextSession?.user as AuthUser | undefined) ?? null);
        setLoading(false);

        if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [hydrateUser, navigate]);

  const login = useCallback(async (input: LoginInput) => signInWithPassword(input), []);

  const register = useCallback(async (input: RegisterInput) => signUp(input), []);

  const loginWithGoogle = useCallback(
    async (redirectTo = '/') => signInWithGoogle(redirectTo),
    []
  );

  const resetPassword = useCallback(
    async (email: string) => sendPasswordResetEmail(email),
    []
  );

  const updatePasswordHandler = useCallback(
    async (password: string) => updatePassword(password),
    []
  );

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
    navigate('/login');
    toast.success('Logged out successfully');
  }, [navigate]);

  const refreshProfile = useCallback(async () => {
    if (!session?.user) return;
    await hydrateUser(session.user as AuthUser);
  }, [session?.user, hydrateUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      session,
      loading,
      isAdmin: profile?.role === 'ADMIN',
      login,
      register,
      loginWithGoogle,
      resetPassword,
      updatePassword: updatePasswordHandler,
      logout,
      refreshProfile,
    }),
    [
      user,
      profile,
      session,
      loading,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      updatePasswordHandler,
      logout,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
