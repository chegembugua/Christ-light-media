'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ExternalLink,
  Plus,
  Trophy,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle,
  Heart,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileCard from '@/components/profile/ProfileCard';
import ActivityFeed from '@/components/profile/ActivityFeed';
import ProfileTabs from '@/components/profile/ProfileTabs';

/* ──────────────────────────────────────────────────
   Types
────────────────────────────────────────────────── */
type PrayerItem = {
  id: string;
  title: string;
  isAnswered: boolean;
  prayerCount: number;
  createdAt: string;
};

type ActiveChallenge = {
  id: string;
  daysCompleted: number[];
  isCompleted: boolean;
  challenge: {
    title: string;
    slug: string;
    duration: number;
    imageUrl: string | null;
  };
};

type TestimonyItem = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
};

type MovementMember = {
  joinedAt: string;
  challengeDay: number;
  totalChallengesCompleted: number;
};

type Stats = {
  prayersShared: number;
  prayersAnswered: number;
  challengeDays: number;
};

type ProfileUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
  location: string | null;
  createdAt: string;
  movement: MovementMember | null;
  stats: Stats;
  recentPrayers: PrayerItem[];
  activeEnrollment: ActiveChallenge | null;
  challengeEnrollments: ActiveChallenge[];
  recentTestimonies: TestimonyItem[];
};

type ActivityItem = {
  id: string;
  type: 'prayer_shared' | 'prayer_answered' | 'challenge_enrolled' | 'challenge_completed' | 'testimony_shared';
  description: string;
  timestamp: string;
};

/* ──────────────────────────────────────────────────
   Constants
────────────────────────────────────────────────── */
const SAMPLE_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'prayer_shared',
    description: 'You shared a prayer request',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-2',
    type: 'prayer_answered',
    description: 'Your prayer was marked answered — breakthrough!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-3',
    type: 'challenge_enrolled',
    description: 'Started 21 Days of Prayer challenge',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-4',
    type: 'testimony_shared',
    description: 'You shared a testimony',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const SCRIPTURES = [
  { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.' },
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ who strengthens me.' },
  { reference: 'Psalm 23:1', text: 'The Lord is my shepherd; I shall not want.' },
  { reference: 'Proverbs 3:5–6', text: 'Trust in the Lord with all your heart and lean not on your own understanding.' },
  { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.' },
  { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God.' },
];

/* ──────────────────────────────────────────────────
   Page
────────────────────────────────────────────────── */
export default function ProfilePage() {
  const searchParams = useSearchParams();
  const defaultTab =
    (searchParams.get('tab') as 'overview' | 'prayers' | 'challenges' | 'saved' | 'activity') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileUser | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/profile');
      const json = (await res.json().catch(() => ({}))) as { user?: ProfileUser };
      setProfile(json.user ?? null);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#C8A24A]" size={32} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-6 pt-28 pb-16">
      {/* Breadcrumb */}
      <p className="text-xs text-gray-600 tracking-widest uppercase mb-6">
        <Link href="/" className="hover:text-[#C8A24A]">Home</Link>
        {' / '}
        <span className="text-gray-400">Profile</span>
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── LEFT SIDEBAR ────────────────────────────────────────────── */}
        <aside className="lg:w-80 xl:w-88 shrink-0 lg:sticky lg:top-24 self-start">
          <ProfileCard
            user={profile}
            movementMember={profile.movement}
            prayersShared={profile.stats.prayersShared}
            prayersAnswered={profile.stats.prayersAnswered}
            challengeDays={profile.stats.challengeDays}
            onEditClick={() => { window.location.href = '/profile/edit'; }}
          />
        </aside>

        {/* ── RIGHT CONTENT ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Tab bar */}
          <div className="sticky top-[88px] z-20 bg-bg/80 backdrop-blur-lg py-4 -mx-4 md:-mx-6 px-4 md:px-6">
            <ProfileTabs activeTab={activeTab} />
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && <OverviewTab user={profile} />}
          {activeTab === 'prayers' && <PrayersTab />}
          {activeTab === 'challenges' && <ChallengesTab profile={profile} />}
          {activeTab === 'saved' && <SavedTab />}
          {activeTab === 'activity' && (
            <section className="space-y-4">
              <h3 className="text-lg font-cinzel font-semibold text-white">
                Activity Feed
              </h3>
              <ActivityFeed activities={SAMPLE_ACTIVITIES} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════════ */
function OverviewTab({ user }: { user: ProfileUser }) {
  const firstName = user.fullName
    ? user.fullName.split(' ')[0]
    : 'Believer';

  const today = new Date();
  const hours = today.getHours();
  const greeting = hours < 12 ? 'Good morning' : hours < 17 ? 'Good afternoon' : 'Good evening';
  const scripture = SCRIPTURES[today.getDate() % SCRIPTURES.length];

  const achievements = [
    { label: 'Prayers Shared', value: user.stats.prayersShared },
    { label: 'Answered Prayers', value: user.stats.prayersAnswered },
    { label: 'Challenge Days', value: user.stats.challengeDays },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white">
          {greeting}, {firstName}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Every step you take for Christ matters. Keep pressing forward in
          faith — your journey has purpose.
        </p>
      </div>

      {/* Daily Scripture */}
      <div className="bg-gradient-to-r from-[#C8A24A]/[0.07] via-[#C8A24A]/[0.04] to-transparent border border-[#C8A24A]/20 rounded-2xl p-6">
        <p className="text-[#C8A24A] text-sm font-semibold font-cinzel mb-2">
          {scripture.reference}
        </p>
        <p className="text-gray-300 text-sm leading-relaxed italic">
          &ldquo;{scripture.text}&rdquo;
        </p>
      </div>

      {/* Active Challenge */}
      {user.activeEnrollment && !user.activeEnrollment.isCompleted && (
        <ActiveChallengeCard enrollment={user.activeEnrollment} />
      )}

      {(!user.activeEnrollment || user.activeEnrollment.isCompleted) && (
        <NoActiveChallenge />
      )}

      {/* Recent Prayers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-cinzel font-semibold text-white">
            Recent Prayers
          </h3>
          <Link
            href="/profile?tab=prayers"
            className="flex items-center gap-1 text-xs text-[#C8A24A] hover:text-[#C8A24A]/80"
          >
            View All <ChevronRight size={12} />
          </Link>
        </div>

        {user.recentPrayers.length === 0 ? (
          <p className="text-gray-500 text-sm">No prayers submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {user.recentPrayers.map((p) => (
              <div
                key={p.id}
                className="bg-card border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                    p.isAnswered
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-[#C8A24A]/15 text-[#C8A24A]'
                  }`}
                >
                  {p.isAnswered ? 'Answered' : 'Open'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activity Feed */}
      <section className="space-y-4">
        <h3 className="text-lg font-cinzel font-semibold text-white">
          Recent Activity
        </h3>
        <ActivityFeed activities={SAMPLE_ACTIVITIES} />
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRAYERS TAB
═══════════════════════════════════════════════════════════════════ */
function PrayersTab() {
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'answered'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.ok ? r.json() : { user: null })
      .then((j) => {
        if (j.user?.recentPrayers) setPrayers(j.user.recentPrayers);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === 'all' ? prayers : filter === 'open' ? prayers.filter((p) => !p.isAnswered) : prayers.filter((p) => p.isAnswered);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-cinzel font-semibold text-white">
          My Prayer Requests
        </h3>
        <Link
          href="/community/prayer"
          className="flex items-center gap-2 text-xs text-[#C8A24A] hover:underline"
        >
          <Plus size={14} /> Share a Prayer
        </Link>
      </div>

      <div className="flex gap-2">
        {(['all', 'open', 'answered'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-[#C8A24A] text-black'
                : 'bg-surface text-gray-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#C8A24A]" size={28} />
        </div>
      ) : prayers.length === 0 ? (
        <EmptyState label="No prayers submitted yet." linkLabel="Share a Prayer Request" linkHref="/community/prayer" />
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="bg-card border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(p.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                    p.isAnswered
                      ? 'bg-green-500/15 text-green-400'
                      : 'bg-[#C8A24A]/15 text-[#C8A24A]'
                  }`}
                >
                  {p.isAnswered ? 'Answered ✓' : 'Open'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <p className="text-xs text-gray-500">
                  <span className="text-[#C8A24A]">♥</span>{' '}
                  {p.prayerCount} people prayed
                </p>
                <Link href={`/community/prayer`} className="text-xs text-gray-400 hover:text-[#C8A24A]">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/community/prayer"
        className="flex items-center justify-center gap-2 border border-[#C8A24A]/40 text-[#C8A24A] hover:bg-[#C8A24A]/10 rounded-xl py-3 font-semibold text-sm transition-colors"
      >
        <Plus size={16} />
        Share a Prayer Request
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHALLENGES TAB
═══════════════════════════════════════════════════════════════════ */
function ChallengesTab({ profile }: { profile: ProfileUser }) {
  const activeBlock = profile.activeEnrollment && !profile.activeEnrollment.isCompleted;
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-cinzel font-semibold text-white">
        My Challenges
      </h3>

      {activeBlock ? (
        <ActiveChallengeCard enrollment={profile.activeEnrollment!} />
      ) : (
        <NoActiveChallenge />
      )}

      {profile.movement && profile.movement.totalChallengesCompleted > 0 && (
        <div className="bg-surface/50 border border-white/5 rounded-xl p-4 text-sm text-gray-400">
          You&apos;ve completed{' '}
          <span className="text-[#C8A24A] font-semibold">
            {profile.movement.totalChallengesCompleted}
          </span>{' '}
          challenge{profile.movement.totalChallengesCompleted !== 1 ? 's' : ''}.
        </div>
      )}

      <Link
        href="/movement"
        className="flex items-center gap-2 justify-center border border-white/10 text-gray-300 hover:text-white hover:border-[#C8A24A]/40 rounded-xl py-3 font-semibold text-sm transition-colors"
      >
        Browse All Challenges <ChevronRight size={16} />
      </Link>
    </div>
  );
}

function ActiveChallengeCard({
  enrollment,
}: {
  enrollment: ActiveChallenge;
}) {
  const progress = enrollment.daysCompleted.length;
  const total = enrollment.challenge.duration;
  const pct = Math.round((progress / total) * 100);

  return (
    <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
      {enrollment.challenge.imageUrl && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={enrollment.challenge.imageUrl}
          alt={enrollment.challenge.title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-cinzel font-semibold text-white">
              {enrollment.challenge.title}
            </h3>
            <p className="text-sm text-gray-400 mt-0.5">
              Day {progress} / {total}
            </p>
          </div>
          <Trophy className="text-[#C8A24A]" size={24} />
        </div>

        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C8A24A] to-amber-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">{pct}% complete</p>

        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-7 rounded-md text-[10px] flex items-center justify-center font-semibold ${
                enrollment.daysCompleted.includes(i + 1)
                  ? 'bg-[#C8A24A]/20 text-[#C8A24A] border border-[#C8A24A]/30'
                  : 'bg-surface text-gray-600 border border-white/5'
              }`}
            >
              {enrollment.daysCompleted.includes(i + 1) ? <CheckCircle size={10} /> : i + 1}
            </div>
          ))}
        </div>

        <Link
          href={`/movement/challenges/${enrollment.challenge.slug}`}
          className="block text-center bg-gradient-to-r from-[#C8A24A] to-amber-600 text-black font-semibold py-2.5 rounded-xl transition-all hover:opacity-90 text-sm"
        >
          Mark Today as Complete
        </Link>
      </div>
    </div>
  );
}

function NoActiveChallenge() {
  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-8 text-center">
      <BookOpen className="mx-auto text-gray-600 mb-3" size={32} />
      <p className="text-gray-400 text-sm">No active challenges.</p>
      <Link
        href="/movement"
        className="inline-flex items-center gap-1 mt-3 text-[#C8A24A] text-sm hover:underline"
      >
        View all challenges <ChevronRight size={14} />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SAVED TAB
═══════════════════════════════════════════════════════════════════ */
function SavedTab() {
  const [savedType, setSavedType] = useState<
    'devotions' | 'sermons' | 'music' | 'articles'
  >('devotions');
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/profile/saved-content?type=${savedType}&limit=20`)
      .then((r) => r.ok ? r.json() : { items: [] })
      .then((j) => setItems((j.items ?? []).map((it: Record<string, unknown>) => {
        if (savedType === 'devotions') return { ...it, _typeId: (it.devotion as Record<string, unknown>)?.id };
        if (savedType === 'sermons') return { ...it, _typeId: (it.media as Record<string, unknown>)?.id };
        if (savedType === 'music') return { ...it, _typeId: (it.media as Record<string, unknown>)?.id };
        return { ...it, _typeId: (it.news as Record<string, unknown>)?.id };
      })))
      .finally(() => setLoading(false));
  }, [savedType]);

  const removeSaved = async (contentId: string) => {
    await fetch('/api/profile/saved-content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: savedType, contentId }),
    });
    setItems((prev) =>
      prev.filter((it) => {
        const record = it as Record<string, unknown>;
        const section = record[savedType] as Record<string, unknown> | undefined;
        return section?.id !== contentId;
      })
    );
  };

  const typeLabel = savedType === 'devotions' ? 'Devotions' : savedType.charAt(0).toUpperCase() + savedType.slice(1);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-cinzel font-semibold text-white">
        Saved Content
      </h3>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['devotions', 'sermons', 'music', 'articles'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSavedType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              savedType === t
                ? 'bg-gradient-to-r from-[#C8A24A] to-amber-600 text-black'
                : 'bg-surface text-gray-400 hover:text-white'
            }`}
          >
            {t === 'devotions'
              ? 'Devotions'
              : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-[#C8A24A]" size={28} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          label={`No saved ${typeLabel.toLowerCase()} yet.`}
          linkLabel={`Discover ${typeLabel}`}
          linkHref={savedType === 'devotions' ? '/devotions' : savedType === 'music' ? '/music' : savedType === 'sermons' ? '/sermons' : '/news'}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const record = item as Record<string, unknown>;
            const devotion = record.devotion as Record<string, unknown> | undefined;
            const media = record.media as Record<string, unknown> | undefined;
            const news = record.news as Record<string, unknown> | undefined;
            const title = devotion?.title ?? media?.title ?? news?.title ?? 'Untitled';
            const image = devotion?.imageUrl ?? media?.coverImage ?? news?.coverImage ?? '';
            const contentId = devotion?.id ?? media?.id ?? news?.id;
            return (
              <div key={String(record.id)} className="bg-card border border-white/10 rounded-xl p-4 flex items-center gap-4">
                {image ? (
                  <div className="w-14 h-14 rounded-lg bg-surface overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={String(image)} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-surface shrink-0 flex items-center justify-center">
                    <BookOpen size={16} className="text-gray-600" />
                  </div>
                )}
                <p className="flex-1 text-sm font-medium text-white truncate">
                  {String(title)}
                </p>
                <button
                  onClick={() => removeSaved(String(contentId))}
                  className="shrink-0 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────
   SHARED COMPONENTS
────────────────────────────────────────────────── */
function EmptyState({
  label,
  linkLabel,
  linkHref,
}: {
  label: string;
  linkLabel: string;
  linkHref: string;
}) {
  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-8 text-center">
      <BookOpen className="mx-auto text-gray-600 mb-3" size={32} />
      <p className="text-gray-400 text-sm">{label}</p>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-1 mt-3 text-[#C8A24A] text-sm hover:underline"
      >
        {linkLabel} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
