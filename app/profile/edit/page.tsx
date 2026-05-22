'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

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
    <div className="container mx-auto max-w-2xl px-4 md:px-6 pt-28 pb-16">
      <p className="text-xs text-gray-600 tracking-widest uppercase mb-4">
        Profile / Edit
      </p>
      <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-1">
        Edit Profile
      </h1>
      <p className="text-sm text-gray-500 mb-8">Update your personal information</p>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
          <label className="text-sm text-gray-400 block">Profile Photo</label>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#C8A24A]/20 border-2 border-[#C8A24A]/40 flex items-center justify-center overflow-hidden shrink-0">
              {profile?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-[#C8A24A] font-cinzel">
                  {initial}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-surface border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <Camera size={14} />
                )}
                {uploading ? 'Uploading…' : 'Change Photo'}
              </button>
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
              <p className="text-[10px] text-gray-600">
                Max 5 MB · JPG, PNG, WebP
              </p>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400 flex items-center justify-between">
            Full Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C8A24A]/50 focus:border-[#C8A24A]/40 transition-all"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400 flex items-center justify-between">
            Bio
            <span className={`${bio.length > 300 ? 'text-red-500' : 'text-gray-600'}`}>
              {bio.length} / 300
            </span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            placeholder="Share a bit about yourself…"
            rows={3}
            className="w-full bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C8A24A]/50 focus:border-[#C8A24A]/40 transition-all resize-none"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={profile?.email ?? ''}
            disabled
            className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-600">
            Email changes coming soon.{' '}
            <span className="text-[#C8A24A] cursor-pointer hover:underline">
              Manage email →
            </span>
          </p>
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm text-gray-400">Location</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="w-full bg-card border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#C8A24A]/50 focus:border-[#C8A24A]/40 transition-all"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-surface border border-white/10 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-semibold text-white">Preferences</h4>
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
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} variant="gold" className="flex-1 py-3">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
          <Button onClick={() => router.push('/profile')} variant="ghost" className="py-3">
            Cancel
          </Button>
        </div>
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
      className="flex items-center gap-3 text-sm text-gray-300 w-full"
    >
      <div
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors shrink-0 ${
          checked
            ? 'bg-[#C8A24A] border-[#C8A24A]'
            : 'bg-surface border-white/20'
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
