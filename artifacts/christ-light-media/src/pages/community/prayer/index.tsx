
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Clock, ArrowRight, Plus, Lock, Search, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import PrayerCard from '@/components/prayer/PrayerCard';
import PrayerStats from '@/components/prayer/PrayerStats';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'trending', label: 'Trending' },
  { value: 'answered', label: 'Answered' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'Health', label: 'Health' },
  { value: 'Family', label: 'Family' },
  { value: 'Ministry', label: 'Ministry' },
  { value: 'Finances', label: 'Finances' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Nation', label: 'Nation' },
  { value: 'Other', label: 'Other' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'most-prayed', label: 'Most Prayed' },
];

type PrayerItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  prayerCount: number;
  isAnswered: boolean;
  isAnonymous: boolean;
  createdAt: string;
  duration: string | null;
  viewCount: number;
};

export default function PrayerWallPage() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  // Hydrate filters from URL on mount
  const [status, setStatus] = useState(searchParams.get('status') ?? 'all');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'recent');
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [prayers, setPrayers] = useState<PrayerItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialMount = useRef(true);

  const fetchPrayers = useCallback(
    async (nextOffset: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError('');

      const params = new URLSearchParams({
        status,
        category,
        sort,
        limit: String(PAGE_SIZE),
        offset: String(nextOffset),
      });
      if (search.trim()) params.set('search', search.trim());

      try {
        const res = await fetch(`/api/community/prayers?${params.toString()}`);
        const data = await res.json();
        if (!res.ok || !data.prayers) throw new Error(data.error ?? 'Unable to load prayers');
        setPrayers((prev) => (append ? [...prev, ...data.prayers] : data.prayers));
        setTotal(data.total ?? data.prayers.length);
        setOffset(nextOffset + data.prayers.length);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unable to load prayers.';
        setError(msg);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [status, category, sort, search]
  );

  // Fetch on filter/sort change (not initial mount)
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    setOffset(0);
    void fetchPrayers(0, false);
  }, [fetchPrayers]);

  // Initial load
  useEffect(() => {
    void fetchPrayers(0, false);
  }, [fetchPrayers]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setOffset(0);
      void fetchPrayers(0, false);
    }, 400);
  };

  const hasMore = prayers.length < total;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-6">

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="mb-12">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-gold">Community</p>
          <h1 className="font-cinzel text-4xl font-bold tracking-tighter md:text-5xl text-white">
            Prayer Wall
          </h1>
          <p className="mt-3 max-w-2xl text-gray-400">
            Share your prayer requests. Stand with the body of Christ in intercession.
          </p>
          <blockquote className="mt-4 border-l-2 border-gold/40 pl-4 text-sm italic text-gray-500">
            &ldquo;Therefore confess your sins to each other and pray for each other so that you may be healed.&rdquo; — James 5:16
          </blockquote>
        </header>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <section className="mb-10">
          <PrayerStats
            activePrayers={247}
            answeredPrayers={1823}
            peoplePraying={4200}
          />
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section className="mb-10">
          <Card className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-gold/5 blur-[80px]" />
            <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-bold font-cinzel text-white">Need Prayer?</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Submit your request securely. The body of Christ is ready to stand with you.
                </p>
              </div>
              <Button onClick={() => navigate('/community/prayer/new')}>
                <Plus size={16} className="mr-2" /> Share a Prayer Request
              </Button>
            </div>
          </Card>
        </section>

        {/* ── Filters ─────────────────────────────────────────────── */}
        <section className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setStatus(opt.value);
                  setOffset(0);
                }}
                className={cn(
                  'rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all',
                  status === opt.value
                    ? 'bg-gold text-black shadow-lg shadow-gold/20'
                    : 'border border-white/10 bg-[#1A1A1A] text-gray-400 hover:border-gold/30 hover:text-white'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category select */}
            <Select
              options={CATEGORY_OPTIONS}
              className="!w-auto !min-w-[140px] !py-2"
              value={category}
              onChange={(e: any) => {
                setCategory(e.target.value);
                setOffset(0);
              }}
            />
            {/* Sort select */}
            <Select
              options={SORT_OPTIONS}
              className="!w-auto !min-w-[140px] !py-2"
              value={sort}
              onChange={(e: any) => {
                setSort(e.target.value);
                setOffset(0);
              }}
            />
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search prayers..."
                value={search}
                onChange={(e: any) => handleSearchChange(e.target.value)}
                className="!w-full !min-w-[200px] !pl-9 !py-2 text-sm"
              />
            </div>
          </div>
        </section>

        {/* ── Prayer list ─────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-[#1A1A1A] p-5">
                <div className="mb-3 h-4 w-20 rounded-full bg-white/10" />
                <div className="mb-2 h-5 w-3/4 rounded bg-white/5" />
                <div className="mb-1 h-3 w-full rounded bg-white/5" />
                <div className="mb-1 h-3 w-5/6 rounded bg-white/5" />
                <div className="mb-4 h-3 w-2/3 rounded bg-white/5" />
                <div className="border-t border-white/5 pt-4">
                  <div className="flex justify-between">
                    <div className="h-3 w-24 rounded bg-white/5" />
                    <div className="h-8 w-20 rounded-lg bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-300">{error}</p>
        ) : prayers.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-[#161616] p-8 text-center text-gray-500">
            No prayer requests yet. Be the first to share.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {prayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  id={prayer.id}
                  title={prayer.title}
                  content={prayer.content}
                  category={prayer.category}
                  author={prayer.author}
                  prayerCount={prayer.prayerCount}
                  isAnswered={prayer.isAnswered}
                  timePosted={new Date(prayer.createdAt)}
                  viewCount={prayer.viewCount}
                  onClick={() => navigate(`/community/prayer/${prayer.id}`)}
                />
              ))}
            </div>

            {/* ── Load more ───────────────────────────────────────── */}
            {hasMore && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => fetchPrayers(offset, true)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#1A1A1A] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#C8A24A]/40 hover:text-[#C8A24A] disabled:opacity-60"
                >
                  {loadingMore && <Loader2 size={16} className="animate-spin" />}
                  Load More
                </button>
                <p className="text-xs text-gray-600">
                  Showing {prayers.length} of {total.toLocaleString()} prayer requests
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
