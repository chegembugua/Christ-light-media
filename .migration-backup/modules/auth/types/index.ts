/**
 * Auth module types — Supabase session merged with Prisma profile.
 */
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import type { Role } from '@prisma/client';

/** Prisma User profile (subset exposed to client). */
export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Authenticated user = Supabase auth + platform profile. */
export type AuthUser = Omit<SupabaseUser, 'role'> & {
  fullName?: string | null;
  role?: Role;
  avatarUrl?: string | null;
  bio?: string | null;
};

export interface AuthResult {
  error?: string;
  /** True when Supabase requires email confirmation before sign-in. */
  needsEmailConfirmation?: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  login: (input: LoginInput) => Promise<AuthResult>;
  register: (input: RegisterInput) => Promise<AuthResult>;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
