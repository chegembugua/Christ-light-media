'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Clock, Disc3, Heart, Headphones, Loader2, Play, Pause, Shuffle } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { EncounterBadge } from '@/components/worship/EncounterBadge';
import { LiveWorshipCountdown } from '@/components/worship/LiveWorshipCountdown';
import { WorshipCard } from '@/components/worship/WorshipCard';

const CATEGORIES = [
  'All',
  'Praise',
  'Intercession',
  'Soaking',
  'Prophetic',
  'Healing',
  'Warfare',
  'Instrumental',
];

const PAGE_SIZE = 20;

type WorshipTrack = {
  id: string;
  title: string;
  description: string | null;
  speaker: string;
  coverImage: string;
  audioUrl: string;
  type: string;
  category: string;
  duration: string | null;
  playCount: number;
  publishedAt: string | null;
  createdAt: string;
};

type MediaResponse = {
  media?: WorshipTrack[];
  total?: number;
  error?: string;
};

type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  coverImage: string;
  audioUrl: string;
  leaders: string[];
};

export default function WorshipPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [tracks, setTracks] = useState<WorshipTrack[]>([]);
  const [leaders, setLeaders] = useState<string[]>([]);
  const [event, setEvent] = useState<UpcomingEvent | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLeader, setActiveLeader] = useState('All Leaders');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const buildMediaUrl = useCallback(
    (nextOffset: number) => {
      const params = new URLSearchParams({
        type: 'WORSHIP',
        published: 'true',
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });

      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (activeLeader !== 'All Leaders') params.set('speaker', activeLeader);

      return `/api/media?${params.toString()}`;
    },
    [activeCategory, activeLeader]
  );

  const fetchTracks = useCallback(
    async (nextOffset = 0, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError('');

      try {
        const response = await fetch(buildMediaUrl(nextOffset));
        const result = (await response.json()) as MediaResponse;

        if (!response.ok || !result.media) {
          throw new Error(result.error ?? 'Unable to load worship sessions.');
        }

        setTracks((current) => (append ? [...current, ...result.media!] : result.media!));
        setTotal(result.total ?? result.media.length);
        setOffset(nextOffset + result.media.length);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : 'Unable to load worship sessions.';
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildMediaUrl]
  );

  useEffect(() => {
    void fetchTracks(0, false);
  }, [fetchTracks]);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const response = await fetch('/api/media/leaders?type=WORSHIP');
        const result = (await response.json()) as { leaders?: string[] };
        setLeaders(result.leaders ?? []);
      } catch {
        setLeaders([]);
      }
    }

    async function fetchEvent() {
      try {
        const response = await fetch('/api/worship/upcoming');
        const result = (await response.json()) as { event: UpcomingEvent | null; error?: string };
        setEvent(result.event);
      } catch {
        setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    }

    void fetchLeaders();
    void fetchEvent();
  }, []);

  const handlePlay = (track: WorshipTrack) => {
    if (isCurrentlyPlaying(track.id)) {
      pause();
      return;
    }

    playTrack({
      id: track.id,
      title: track.title,
      artist: track.speaker,
      coverImage: track.coverImage,
      audioUrl: track.audioUrl,
      type: 'worship',
      duration: track.duration ?? undefined,
    });
    toast.success(`Now playing: ${track.title}`);
  };

  const handlePlayLive = () => {
    if (!event) return;
    if (isCurrentlyPlaying(event.id)) {
      pause();
      return;
    }

    playTrack({
      id: event.id,
      title: event.title,
      artist: event.leaders.join(', ') || 'Worship Team',
      coverImage: event.coverImage,
      audioUrl: event.audioUrl,
      type: 'worship',
      isLive: true,
      duration: String(event.durationMinutes),
    });
    toast.success(`Now live: ${event.title}`);
  };

  const shuffleAll = () => {
    if (tracks.length === 0) return;
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    handlePlay(randomTrack);
  };

  const hasMore = tracks.length < total;

  const formatEventDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatEventTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <header className="mb-14">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
              Spirit-Led Worship
            </p>
            <h1 className="text-shine mb-4 font-cinzel text-5xl font-bold tracking-tighter md:text-6xl">
              Worship Moments
            </h1>
            <p className="max-w-2xl font-inter text-gray-400">
              Join us in spirit-led worship, live and on-demand
            </p>
            <blockquote className="mt-6 max-w-3xl border-l-2 border-gold/50 pl-5 text-sm leading-7 text-gray-500">
              &ldquo;Worship the LORD in the splendor of his holiness; tremble before him, all the earth.&rdquo; — Psalm 29:2
            </blockquote>
          </header>
        </ScrollReveal>

        {/* ── Live Worship ─────────────────────────────────────────────── */}
        <section className="mb-20">
          <ScrollReveal>
            <div className="mb-8 flex items-center gap-3">
              <Disc3 size={22} className="text-gold" />
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">Live</p>
                <h2 className="font-cinzel text-3xl font-medium">Live Worship</h2>
              </div>
            </div>
          </ScrollReveal>

          {loadingEvent ? (
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card animate-pulse">
              <div className="aspect-video w-full bg-white/5" />
              <div className="space-y-4 p-8">
                <div className="h-6 w-48 rounded bg-white/10" />
                <div className="h-14 w-80 rounded bg-white/10" />
                <div className="h-5 w-72 rounded bg-white/10" />
                <div className="h-12 w-40 rounded-full bg-gold/20" />
              </div>
            </div>
          ) : event ? (
            <ScrollReveal>
              <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gold/20 shadow-[0_0_50px_rgba(200,162,74,0.1)]">
                <div className="relative aspect-video">
                  <Image
                    src={event.coverImage || 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070'}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  <div className="absolute left-6 top-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-red-600/30">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                      Live Worship
                    </span>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-16 pt-20">
                    <LiveWorshipCountdown
                      event={event}
                      onEventStarted={() => {
                        toast.success('Worship has started!');
                      }}
                    />
                  </div>

                  <div className="absolute right-6 bottom-6">
                    <button
                      type="button"
                      onClick={handlePlayLive}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold uppercase tracking-widest text-black shadow-lg shadow-gold/30 transition hover:scale-105 active:scale-95"
                    >
                      <Play size={18} fill="currentColor" />
                      Join Now
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 bg-card/80 p-6 backdrop-blur-sm">
                  <h3 className="mb-2 font-cinzel text-2xl font-semibold text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {formatEventDate(event.scheduledAt)} &middot; {formatEventTime(event.scheduledAt)} &middot;{' '}
                    {event.durationMinutes} min
                  </p>
                  {event.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{event.description}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-card p-12 text-center">
              <Disc3 size={40} className="mb-4 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">
                No live worship scheduled today.
              </p>
              <p className="mt-1 text-sm text-gray-600">Check back soon for our next session!</p>
            </div>
          )}
        </section>

        {/* ── Recorded Worship ─────────────────────────────────────────── */}
        <section>
          <ScrollReveal>
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">Library</p>
                <h2 className="font-cinzel text-3xl font-medium">Worship Sessions</h2>
                <p className="mt-2 max-w-xl text-sm text-gray-500">
                  Beautiful recorded moments for prayer, meditation, and encounter
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={shuffleAll}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-card px-4 py-2 text-sm text-gray-400 transition hover:border-gold/30 hover:text-gold"
                >
                  <Shuffle size={16} /> Shuffle
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      activeCategory === category
                        ? 'bg-gold text-black shadow-lg shadow-gold/20'
                        : 'border border-white/5 bg-card text-gray-400 hover:border-gold/30 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <select
                value={activeLeader}
                onChange={(event) => setActiveLeader(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-gold/60 lg:max-w-xs"
              >
                <option>All Leaders</option>
                {leaders.map((leader) => (
                  <option key={leader} value={leader}>
                    {leader}
                  </option>
                ))}
              </select>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-card p-3">
                  <div className="aspect-video animate-pulse rounded-2xl bg-white/10" />
                  <div className="h-5 animate-pulse rounded bg-white/10" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
              {error}
            </p>
          ) : tracks.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-card p-8 text-center text-gray-500">
              No recorded worship sessions yet.
            </p>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {tracks.map((track) => (
                  <WorshipCard
                    key={track.id}
                    title={track.title}
                    leaders={track.speaker}
                    coverImage={track.coverImage}
                    category={track.category}
                    duration={track.duration ?? 'Audio'}
                    encounterType={track.category}
                    playCount={track.playCount}
                    isPlaying={isCurrentlyPlaying(track.id)}
                    onPlay={() => handlePlay(track)}
                  />
                ))}
              </StaggerContainer>

              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void fetchTracks(offset, true)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-card px-6 py-3 text-sm font-semibold text-white transition hover:border-gold/40 hover:text-gold disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 size={16} className="animate-spin" />}
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* ── Statistics ──────────────────────────────────────────────── */}
        <section className="mt-20 py-12">
          <ScrollReveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { label: 'Worship Sessions', value: `${total}+`, icon: Disc3 },
                { label: 'Hours of Content', value: `${Math.max(1, Math.round(total * 0.75))} hrs`, icon: Clock },
                { label: 'Prayer Encounters', value: '∞', icon: Heart },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/5 bg-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                    <stat.icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-cinzel text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}
