
import { Link } from 'wouter';
import { Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export function ProfileView() {
  const { user, profile, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <section className="container mx-auto px-6 pt-28 pb-16">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-4 w-64 animate-pulse rounded bg-white/5" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="container mx-auto px-6 pt-28 pb-16 text-center">
        <p className="text-gray-400">Please sign in to view your profile.</p>
        <Link href="/login" className="mt-4 inline-block text-gold hover:text-white">
          Sign in
        </Link>
      </section>
    );
  }

  const displayName = profile?.fullName ?? user.email?.split('@')[0] ?? 'Member';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <section className="container mx-auto max-w-2xl px-6 pt-28 pb-16">
      <header className="mb-10 animate-fadeUp">
        <h1 className="font-cinzel text-4xl text-white">My Profile</h1>
        <p className="mt-2 text-gray-400">Your In For Christ Media account</p>
      </header>

      <article className="glass animate-fadeUp rounded-2xl p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/20 font-cinzel text-2xl text-gold">
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={displayName}
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="font-cinzel text-xl text-white">{displayName}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {profile?.role && (
              <span className="mt-2 inline-block rounded-full border border-gold/20 bg-gold/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold">
                {profile.role}
              </span>
            )}
          </div>
        </div>

        {profile?.bio && (
          <p className="mt-6 text-sm leading-relaxed text-gray-400">{profile.bio}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-3 border-t border-white/5 pt-6">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Shield size={16} /> Admin Dashboard
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="sm" className="gap-2 text-gray-400" disabled>
            <User size={16} /> Edit Profile (soon)
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-red-400"
            onClick={() => logout()}
          >
            <LogOut size={16} /> Log Out
          </Button>
        </div>
      </article>
    </section>
  );
}
