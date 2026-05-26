'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import ScrollReveal from '@/components/animations/ScrollReveal'; // Added import

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  preferences: Record<string, unknown> | null;
  createdAt: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [devotionEmail, setDevotionEmail] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.ok ? r.json() : Promise.resolve({} as { user?: UserProfile }))
      .then((j) => {
        const u = j.user as UserProfile | undefined;
        if (!u) return;
        setProfile(u);
        setFullName(u.fullName ?? '');
        setBio(u.bio ?? '');
        setLocation(u.location ?? '');
        const prefs = (u.preferences ?? {}) as Record<string, unknown>;
        setNotifications(Boolean(prefs.prayerNotifications));
        setShowProfile(Boolean(prefs.publicProfile));
        setDevotionEmail(Boolean(prefs.devotionEmail));
        setNewsletter(Boolean(prefs.weeklyNewsletter));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: fd });
      const json = (await res.json()) as { user: UserProfile; error?: string };
      if (res.ok && json.user) {
        setProfile(json.user);
        toast.success('Profile photo updated');
      } else {
        toast.error(json.error ?? 'Failed to upload photo');
      }
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await fetch('/api/profile/avatar', { method: 'DELETE' });
      const json = (await res.json()) as { user: UserProfile; error?: string };
      if (res.ok && json.user) {
        setProfile(json.user);
        toast.success('Profile photo removed');
      } else {
        toast.error(json.error ?? 'Failed to remove photo');
      }
    } catch {
      toast.error('Failed to remove photo');
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          bio: bio.trim() || null,
          location: location.trim() || null,
          preferences: {
            prayerNotifications: notifications,
            publicProfile: showProfile,
            devotionEmail: devotionEmail,
            weeklyNewsletter: newsletter,
          },
        }),
      });
      const json = (await res.json()) as { user: UserProfile; error?: string };
      if (res.ok && json.user) {
        toast.success('Profile updated successfully');
        router.push('/profile');
      } else {
        toast.error(json.error ?? 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#C8A24A]" size={32} />
      </div>
    );
  }

  const initial = (profile?.fullName ?? profile?.email ?? 'U')[0]?.toUpperCase() ?? 'U';

  return (
    <div className="min-h-screen bg-bg-primary pt-28 pb-20">
      <div className="container mx-auto max-w-2xl px-6">
        
        <ScrollReveal>
          <div className="mb-8">
            <Link href="/profile" className="text-gold text-sm hover:underline flex items-center gap-1">
              ← Back to Profile
            </Link>
            <h1 className="text-4xl font-bold mt-4">Edit Profile</h1>
            <p className="text-text-secondary mt-2">Update your personal information</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <form onSubmit={handleSave} className="bg-bg-tertiary border border-white/10 rounded-2xl p-8 space-y-8">
            
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium mb-4 text-text-secondary">Profile Photo</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0">
                  {profile?.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={profile.avatarUrl} alt={profile.fullName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gold/20 flex items-center justify-center text-2xl font-bold text-gold">
                      {initial}
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-white/10 hover:border-gold rounded-lg cursor-pointer transition-colors">
                    {uploading ? (
                      <Loader2 className="animate-spin text-gold" size={18} />
                    ) : (
                      <Camera size={18} className="text-gold" />
                    )}
                    <span className="text-sm font-medium text-white">{uploading ? 'Uploading...' : 'Change Photo'}</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {profile?.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleDeleteAvatar}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete Photo
                    </button>
                  )}
                  <p className="text-text-tertiary text-xs mt-2">Max 5MB, JPG/PNG/WebP</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-text-tertiary focus:border-gold outline-none transition-colors"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Bio (max 300 chars)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 300))}
                placeholder="Tell us about your faith journey..."
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-text-tertiary focus:border-gold outline-none transition-colors resize-none h-24"
              />
              <p className={`text-xs mt-1 text-right ${bio.length > 300 ? 'text-red-500' : 'text-text-tertiary'}`}>
                {bio.length} / 300
              </p>
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Email</label>
              <input
                type="email"
                value={profile?.email ?? ''}
                disabled
                className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2.5 text-text-secondary cursor-not-allowed"
              />
              <p className="text-xs text-text-tertiary mt-1">
                Email changes coming soon.{' '}
                <Link href="/profile/settings" className="text-gold cursor-pointer hover:underline">
                  Manage email →
                </Link>
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2 text-text-secondary">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full bg-bg-secondary border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder:text-text-tertiary focus:border-gold outline-none transition-colors"
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-lg font-semibold text-white mb-2">Notification Preferences</h4>
              <Checkbox
                checked={notifications}
                onChange={setNotifications}
                label="Receive prayer notifications"
              />
              <Checkbox
                checked={showProfile}
                onChange={setShowProfile}
                label="Show profile to community"
              />
              <Checkbox
                checked={devotionEmail}
                onChange={setDevotionEmail}
                label="Receive daily devotion email"
              />
              <Checkbox
                checked={newsletter}
                onChange={setNewsletter}
                label="Receive weekly newsletter"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                onClick={handleSave}
                disabled={saving}
                variant="gold"
                size="lg"
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/profile')}
                variant="outline"
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

          </form>
        </ScrollReveal>
      </div>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-text-secondary w-full hover:text-white transition-colors"
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
          checked
            ? 'bg-[#C8A24A] border-[#C8A24A]'
            : 'bg-bg-tertiary border-white/20'
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 6L5 9L10 3"
              stroke="black"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {label}
    </button>
  );
}
