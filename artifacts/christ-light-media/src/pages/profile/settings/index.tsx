
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { Link } from 'wouter';
import {
  Bell,
  Shield,
  Download,
  Trash2,
  Key,
  LogOut,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Settings2,
  Info,
  FileJson,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { authFetch } from '@/lib/api/authFetch';

type SettingsState = {
  prayerNotifications: boolean;
  chatNotifications: boolean;
  challengeReminders: boolean;
  devotionEmail: boolean;
  publicProfile: boolean;
  showPrayers: boolean;
  includeInTestimonies: boolean;
};

const INITIAL_SETTINGS: SettingsState = {
  prayerNotifications: true,
  chatNotifications: true,
  challengeReminders: true,
  devotionEmail: false,
  publicProfile: true,
  showPrayers: true,
  includeInTestimonies: true,
};

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading]);

   useEffect(() => {
    authFetch('/api/profile')
      .then((r) => r.ok ? r.json() : Promise.resolve({} as { user?: UserProfile }))
      .then((j) => {
        const u = j.user;
        if (!u) return;
        setProfile(u);
        if (u.preferences) {
          const p = u.preferences as Record<string, unknown>;
          setSettings((prev) => ({
            ...prev,
            prayerNotifications: Boolean(p.prayerNotifications ?? prev.prayerNotifications),
            chatNotifications: Boolean(p.chatNotifications ?? prev.chatNotifications),
            challengeReminders: Boolean(p.challengeReminders ?? prev.challengeReminders),
            devotionEmail: Boolean(p.devotionEmail ?? prev.devotionEmail),
            publicProfile: Boolean(p.publicProfile ?? prev.publicProfile),
            showPrayers: Boolean(p.showPrayers ?? prev.showPrayers),
            includeInTestimonies: Boolean(p.includeInTestimonies ?? prev.includeInTestimonies),
          }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const combinedPrefs = {
        prayerNotifications: settings.prayerNotifications,
        chatNotifications: settings.chatNotifications,
        challengeReminders: settings.challengeReminders,
        devotionEmail: settings.devotionEmail,
        publicProfile: settings.publicProfile,
        showPrayers: settings.showPrayers,
        includeInTestimonies: settings.includeInTestimonies,
      };
      const res = await authFetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: combinedPrefs }),
      });
      const json = (await res.json()) as { user: UserProfile; error?: string };
      if (res.ok && json.user) {
        toast.success('Settings saved');
        setProfile(json.user);
      } else {
        toast.error(json.error ?? 'Failed to save settings');
      }
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
      navigate('/');
    }
  };

  const handleDownloadData = async () => {
    setDownloading(true);
    try {
      const res = await authFetch('/api/profile');
      const json = (await res.json()) as { user: UserProfile };
      const blob = new Blob([JSON.stringify(json.user ?? {}, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `christ-light-profile-${profile?.id ?? 'export'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Your data has been downloaded');
    } catch {
      toast.error('Failed to download data');
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletePending(true);
    try {
      // Client-side account deletion requires Supabase admin — stub for MVP
      toast('Account deletion requires admin approval. Please contact support.', { icon: 'ℹ️' });
    } catch {
      toast.error('Failed to process account deletion');
    } finally {
      setDeletePending(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#C8A24A]" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 md:px-6 pt-28 pb-16">
      <p className="text-xs text-gray-600 tracking-widest uppercase mb-4">
        Profile / Settings
      </p>
      <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-1">
        Settings
      </h1>
      <p className="text-sm text-gray-500 mb-8">Manage your account and preferences</p>

      <div className="space-y-8">
        {/* ─── NOTIFICATIONS ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Bell size={18} className="text-[#C8A24A]" />
            <h2 className="text-lg font-cinzel font-semibold">Notifications</h2>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-4">
            {[
              { key: 'prayerNotifications' as const, label: 'Prayer notifications', sub: 'Get notified when someone prays for your requests' },
              { key: 'chatNotifications' as const, label: 'Community chat notifications', sub: 'New messages in your chat rooms' },
              { key: 'challengeReminders' as const, label: 'Challenge reminders', sub: 'Daily reminders for your active challenges' },
              { key: 'devotionEmail' as const, label: 'Daily devotion email', sub: 'Receive your daily devotion in your inbox' },
            ].map((item) => (
              <SettingToggle
                key={item.key}
                label={item.label}
                sub={item.sub}
                checked={settings[item.key]}
                onChange={(v) => updateSetting(item.key, v)}
              />
            ))}
          </div>
        </div>

        {/* ─── PRIVACY ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Shield size={18} className="text-[#C8A24A]" />
            <h2 className="text-lg font-cinzel font-semibold">Privacy</h2>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-4">
            {[
              { key: 'publicProfile' as const, label: 'Public profile', sub: 'Let others view your Christian community profile' },
              { key: 'showPrayers' as const, label: 'Show prayers on prayer wall', sub: 'Allow your prayer requests to be visible publicly' },
              { key: 'includeInTestimonies' as const, label: 'Include in testimonies', sub: 'Allow featured testimonial content with your name' },
            ].map((item) => (
              <SettingToggle
                key={item.key}
                label={item.label}
                sub={item.sub}
                checked={settings[item.key]}
                onChange={(v) => updateSetting(item.key, v)}
              />
            ))}
            <a
              href="#"
              className="block text-sm text-[#C8A24A] hover:underline mt-2 pt-3 border-t border-white/5"
            >
              Manage blocked users →
            </a>
          </div>
        </div>

        {/* ─── DATA ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Download size={18} className="text-[#C8A24A]" />
            <h2 className="text-lg font-cinzel font-semibold">Data</h2>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3">
            <button
              type="button"
              onClick={handleDownloadData}
              disabled={downloading}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-sm text-white hover:border-[#C8A24A]/40 transition-colors disabled:opacity-50"
            >
              {downloading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <FileJson size={14} />
              )}
              {downloading ? 'Exporting…' : 'Download My Data'}
            </button>
            <p className="text-[10px] text-gray-600">
              Exports all your data as a JSON file (GDPR).
            </p>
          </div>
        </div>

        {/* ─── SECURITY ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Key size={18} className="text-[#C8A24A]" />
            <h2 className="text-lg font-cinzel font-semibold">Security</h2>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-white/10 rounded-xl text-sm text-white hover:border-[#C8A24A]/40 transition-colors"
            >
              <Key size={14} />
              Change Password
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-white/10 rounded-xl text-sm text-white hover:border-[#C8A24A]/40 transition-colors"
            >
              <LogOut size={14} />
              Sign Out All Other Devices
            </button>
          </div>
        </div>

        {/* ─── DANGER ────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <Trash2 size={18} />
            <h2 className="text-lg font-cinzel font-semibold">Danger Zone</h2>
          </div>
          <div className="bg-red-500/[0.04] border border-red-500/20 rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-4">
              Permanently delete your account and all associated data. This action
              cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/25 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* ─── ABOUT ─────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <Info size={18} className="text-[#C8A24A]" />
            <h2 className="text-lg font-cinzel font-semibold">About</h2>
          </div>
          <div className="bg-card border border-white/10 rounded-2xl p-5 space-y-3 text-sm text-gray-400">
            <p>Christ Light Media v1.0.0</p>
            <div className="flex flex-wrap gap-4">
              <a href="/privacy" className="text-[#C8A24A] hover:underline inline-flex items-center gap-1">
                Privacy Policy <ExternalLink size={12} />
              </a>
              <a href="/terms" className="text-[#C8A24A] hover:underline inline-flex items-center gap-1">
                Terms of Service <ExternalLink size={12} />
              </a>
              <a href="#support" className="text-[#C8A24A] hover:underline inline-flex items-center gap-1">
                Contact Support <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} variant="gold">
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-cinzel font-bold text-white">
              Delete your account?
            </h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              This will permanently delete your account and all of your data.
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={deletePending}
                variant="surface"
                className="flex-1 !text-red-400 border-red-500/30 hover:!bg-red-500/15"
              >
                {deletePending ? 'Deleting…' : 'Delete Account'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SettingToggle({
  label,
  sub,
  checked,
  onChange,
}: {
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${
          checked ? 'bg-gold shadow-[0_0_10px_rgba(200,162,74,0.4)]' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? 'left-7 scale-110' : 'left-1 scale-100'
          }`}
        />
      </button>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      {/* Card */}
      <div className="relative bg-card border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="relative bg-bg-tertiary border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
          {children}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

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
