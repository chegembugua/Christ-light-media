
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Disc3, Loader2, Shuffle } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlayer } from '@/context/PlayerContext';
import { authFetch } from '@/lib/api/authFetch';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { MusicCard } from '@/components/media/MusicCard';
import { MusicRow } from '@/components/media/MusicRow';
import { ViewToggle } from '@/components/media/ViewToggle';

const GENRES = [
  'All',
  'Worship',
  'Gospel',
  'Instrumental',
  'Prophetic Worship',
  'Prayer Music',
  'Contemporary',
];

const PAGE_SIZE = 20;

type MusicTrack = {
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
  media?: MusicTrack[];
  total?: number;
  error?: string;
};

export default function MusicPage() {
  const { playTrack, pause, currentTrack, isPlaying } = usePlayer();
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [featuredTracks, setFeaturedTracks] = useState<MusicTrack[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeArtist, setActiveArtist] = useState('All Artists');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const isCurrentlyPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const buildMediaUrl = useCallback(
    (nextOffset: number) => {
      const params = new URLSearchParams({
        type: 'MUSIC',
        published: 'true',
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });

      if (activeGenre !== 'All') params.set('category', activeGenre);
      if (activeArtist !== 'All Artists') params.set('speaker', activeArtist);

      return `/api/media?${params.toString()}`;
    },
    [activeGenre, activeArtist]
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
          throw new Error(result.error ?? 'Unable to load music.');
        }

        setTracks((current) => (append ? [...current, ...result.media!] : result.media!));
        setTotal(result.total ?? result.media.length);
        setOffset(nextOffset + result.media.length);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load music.');
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
    async function fetchArtists() {
      try {
        const response = await fetch('/api/media/artists?type=MUSIC');
        const result = (await response.json()) as { artists?: string[] };
        setArtists(result.artists ?? []);
      } catch {
        setArtists([]);
      }
    }

    async function fetchFeatured() {
      try {
        const response = await fetch('/api/media?type=MUSIC&published=true&limit=80');
        const result = (await response.json()) as MediaResponse;
        const top = [...(result.media ?? [])]
          .sort((left, right) => right.playCount - left.playCount)
          .slice(0, 4);
        setFeaturedTracks(top);
      } catch {
        setFeaturedTracks([]);
      }
    }

    void fetchArtists();
    void fetchFeatured();
  }, []);

  const handlePlay = (track: MusicTrack) => {
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
      type: 'music',
      duration: track.duration ?? undefined,
    });
    toast.success(`Now playing: ${track.title}`);
  };

  const toggleFavorite = async (track: MusicTrack) => {
    const isFavorite = favorites.has(track.id);
    setFavorites((current) => {
      const next = new Set(current);
      if (isFavorite) next.delete(track.id);
      else next.add(track.id);
      return next;
    });

    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');

    await authFetch('/api/media/favorites', {
      method: isFavorite ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mediaId: track.id }),
    }).catch(() => undefined);
  };

  const shuffleAll = () => {
    if (tracks.length === 0) return;
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    handlePlay(randomTrack);
  };

  const hasMore = tracks.length < total;

  const resultLabel = useMemo(() => {
    if (loading) return 'Loading tracks';
    if (total === 1) return '1 track';
    return `${total} tracks`;
  }, [loading, total]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <header className="mb-14">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">
              Worship Audio
            </p>
            <h1 className="text-shine mb-4 font-cinzel text-5xl font-bold tracking-tighter md:text-6xl">
              Music Library
            </h1>
            <p className="max-w-2xl font-inter text-gray-400">
              Worship, gospel, and instrumental music for prayer and meditation
            </p>
            <blockquote className="mt-6 max-w-3xl border-l-2 border-gold/50 pl-5 text-sm leading-7 text-gray-500">
              &ldquo;Let the Word of Christ dwell in you richly in all wisdom, singing psalms
              and hymns and spiritual songs.&rdquo; - Colossians 3:16
            </blockquote>
          </header>
        </ScrollReveal>

        {featuredTracks.length > 0 && (
          <section className="mb-20">
            <ScrollReveal>
              <div className="mb-8 flex items-center gap-3">
                <Disc3 size={22} className="text-gold" />
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gold">
                    Featured
                  </p>
                  <h2 className="font-cinzel text-3xl font-medium">Top Played Songs</h2>
                </div>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredTracks.map((track) => (
                <MusicCard
                  key={track.id}
                  title={track.title}
                  artist={track.speaker}
                  coverImage={track.coverImage}
                  genre={track.category}
                  duration={track.duration ?? 'Audio'}
                  playCount={track.playCount}
                  isPlaying={isCurrentlyPlaying(track.id)}
                  isFavorite={favorites.has(track.id)}
                  onPlay={() => handlePlay(track)}
                  onFavorite={() => void toggleFavorite(track)}
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
                  Library
                </p>
                <h2 className="font-cinzel text-3xl font-medium">All Tracks</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500">{resultLabel}</span>
                <button
                  type="button"
                  onClick={shuffleAll}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-card px-4 py-2 text-sm text-gray-400 transition hover:border-gold/30 hover:text-gold"
                >
                  <Shuffle size={16} /> Shuffle
                </button>
                <ViewToggle view={view} onChange={setView} />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => setActiveGenre(genre)}
                    className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      activeGenre === genre
                        ? 'bg-gold text-black shadow-lg shadow-gold/20'
                        : 'border border-white/5 bg-card text-gray-400 hover:border-gold/30 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>

              <select
                value={activeArtist}
                onChange={(event) => setActiveArtist(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-gold/60 lg:max-w-xs"
              >
                <option>All Artists</option>
                {artists.map((artist) => (
                  <option key={artist} value={artist}>
                    {artist}
                  </option>
                ))}
              </select>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-card p-3">
                  <div className="aspect-square animate-pulse rounded-2xl bg-white/10" />
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
              No music found. Check back soon!
            </p>
          ) : (
            <>
              {view === 'grid' ? (
                <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {tracks.map((track) => (
                    <MusicCard
                      key={track.id}
                      title={track.title}
                      artist={track.speaker}
                      coverImage={track.coverImage}
                      genre={track.category}
                      duration={track.duration ?? 'Audio'}
                      playCount={track.playCount}
                      isPlaying={isCurrentlyPlaying(track.id)}
                      isFavorite={favorites.has(track.id)}
                      onPlay={() => handlePlay(track)}
                      onFavorite={() => void toggleFavorite(track)}
                    />
                  ))}
                </StaggerContainer>
              ) : (
                <StaggerContainer className="space-y-3">
                  {tracks.map((track) => (
                    <MusicRow
                      key={track.id}
                      title={track.title}
                      artist={track.speaker}
                      coverImage={track.coverImage}
                      genre={track.category}
                      duration={track.duration ?? 'Audio'}
                      playCount={track.playCount}
                      isPlaying={isCurrentlyPlaying(track.id)}
                      isFavorite={favorites.has(track.id)}
                      onPlay={() => handlePlay(track)}
                      onFavorite={() => void toggleFavorite(track)}
                    />
                  ))}
                </StaggerContainer>
              )}

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
      </div>
    </div>
  );
}
