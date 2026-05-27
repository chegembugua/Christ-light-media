'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { SermonCard } from '@/components/media/SermonCard';
import { SermonRow } from '@/components/media/SermonRow';

const CATEGORIES = [
  'All',
  'Teaching',
  'Prayer',
  'Prophecy',
  'Healing',
  'Worship',
  'Revival',
  'Leadership',
];

const PAGE_SIZE = 20;

type Sermon = {
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
  media?: Sermon[];
  total?: number;
  error?: string;
};

function sermonDate(sermon: Sermon) {
  return new Date(sermon.publishedAt ?? sermon.createdAt);
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }

  const years = Math.floor(diffDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export default function SermonsPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [featuredSermons, setFeaturedSermons] = useState<Sermon[]>([]);
  const [speakers, setSpeakers] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSpeaker, setActiveSpeaker] = useState('All Speakers');
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const buildMediaUrl = useCallback(
    (nextOffset: number) => {
      const params = new URLSearchParams({
        type: 'SERMON',
        published: 'true',
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });

      if (activeCategory !== 'All') params.set('category', activeCategory);
      if (activeSpeaker !== 'All Speakers') params.set('speaker', activeSpeaker);

      return `/api/media?${params.toString()}`;
    },
    [activeCategory, activeSpeaker]
  );

  const fetchSermons = useCallback(
    async (nextOffset = 0, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError('');

      try {
        const response = await fetch(buildMediaUrl(nextOffset));
        const result = (await response.json()) as MediaResponse;

        if (!response.ok || !result.media) {
          throw new Error(result.error ?? 'Unable to load sermons.');
        }

        setSermons((current) => (append ? [...current, ...result.media!] : result.media!));
        setTotal(result.total ?? result.media.length);
        setOffset(nextOffset + result.media.length);
      } catch (fetchError) {
        const message = fetchError instanceof Error ? fetchError.message : 'Unable to load sermons.';
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildMediaUrl]
  );

  useEffect(() => {
    void fetchSermons(0, false);
  }, [fetchSermons]);

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        const response = await fetch('/api/media/speakers?type=SERMON');
        const result = (await response.json()) as { speakers?: string[] };
        setSpeakers(result.speakers ?? []);
      } catch {
        setSpeakers([]);
      }
    }

    async function fetchFeatured() {
      try {
        const response = await fetch('/api/media?type=SERMON&published=true&limit=60');
        const result = (await response.json()) as MediaResponse;
        const top = [...(result.media ?? [])]
          .sort((left, right) => right.playCount - left.playCount)
          .slice(0, 3);
        setFeaturedSermons(top);
      } catch {
        setFeaturedSermons([]);
      }
    }

    void fetchSpeakers();
    void fetchFeatured();
  }, []);

  const handlePlay = (sermon: Sermon) => {
    if (isCurrentlyPlaying(sermon.id)) {
      pause();
      return;
    }

    playTrack({
      id: sermon.id,
      title: sermon.title,
      artist: sermon.speaker,
      coverImage: sermon.coverImage,
      audioUrl: sermon.audioUrl,
      type: 'sermon',
      duration: sermon.duration ?? undefined,
    });
    toast.success(`Now playing: ${sermon.title}`);
  };

  const hasMore = sermons.length < total;

  const resultLabel = useMemo(() => {
    if (loading) return 'Loading sermons';
    if (total === 1) return '1 sermon';
    return `${total} sermons`;
  }, [loading, total]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <header className="mb-14">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
              Biblical Teaching
            </p>
            <h1 className="text-shine mb-4 font-cinzel text-5xl font-bold tracking-tighter md:text-6xl">
              Sermons
            </h1>
            <p className="max-w-2xl font-inter text-gray-400">
              Powerful biblical teaching to equip and encourage your faith
            </p>
            <blockquote className="mt-6 max-w-3xl border-l-2 border-gold/50 pl-5 text-sm leading-7 text-gray-500">
              &ldquo;All Scripture is God-breathed and is useful for teaching, rebuking,
              correcting and training in righteousness.&rdquo; - 2 Timothy 3:16
            </blockquote>
          </header>
        </ScrollReveal>

        {featuredSermons.length > 0 && (
          <section className="mb-20">
            <ScrollReveal>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
                    Featured
                  </p>
                  <h2 className="font-cinzel text-3xl font-medium">Most Played Sermons</h2>
                </div>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredSermons.map((sermon) => (
                <SermonCard
                  key={sermon.id}
                  title={sermon.title}
                  speaker={sermon.speaker}
                  coverImage={sermon.coverImage}
                  category={sermon.category}
                  duration={sermon.duration ?? 'Audio'}
                  playCount={sermon.playCount}
                  date={sermonDate(sermon)}
                  isPlaying={isCurrentlyPlaying(sermon.id)}
                  onPlay={() => handlePlay(sermon)}
                />
              ))}
            </StaggerContainer>
          </section>
        )}

        <section>
          <ScrollReveal>
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
                  Archive
                </p>
                <h2 className="font-cinzel text-3xl font-medium">All Sermons</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Filter size={14} /> {resultLabel}
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
                value={activeSpeaker}
                onChange={(event) => setActiveSpeaker(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-gold/60 lg:max-w-xs"
              >
                <option>All Speakers</option>
                {speakers.map((speaker) => (
                  <option key={speaker} value={speaker}>
                    {speaker}
                  </option>
                ))}
              </select>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-xl bg-white/10" />
              ))}
            </div>
          ) : error ? (
            <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">
              {error}
            </p>
          ) : sermons.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-card p-8 text-center text-gray-500">
              No sermons yet. Check back soon!
            </p>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sermons.map((sermon) => (
                  <SermonRow
                    key={sermon.id}
                    title={sermon.title}
                    speaker={sermon.speaker}
                    category={sermon.category}
                    duration={sermon.duration ?? 'Audio'}
                    playCount={sermon.playCount}
                    date={sermonDate(sermon)}
                    coverImage={sermon.coverImage}
                    isPlaying={isCurrentlyPlaying(sermon.id)}
                    onPlay={() => handlePlay(sermon)}
                  />
                ))}
              </StaggerContainer>

              <div className="mt-10 flex flex-col items-center gap-3">
                {sermons[0] && (
                  <p className="text-xs text-gray-600">
                    Latest sermon added {formatRelativeTime(sermonDate(sermons[0]))}
                  </p>
                )}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => void fetchSermons(offset, true)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-card px-6 py-3 text-sm font-semibold text-white transition hover:border-gold/40 hover:text-gold disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 size={16} className="animate-spin" />}
                    Load more
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
