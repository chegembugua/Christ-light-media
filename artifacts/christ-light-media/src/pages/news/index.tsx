
import { useEffect, useState, useCallback, useMemo } from 'react';
;
import { Link } from 'wouter';
import { 
  Search, 
  X, 
  Calendar, 
  Menu, 
  Loader2, 
  TrendingUp,
  RefreshCw,
  User
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { useDebounce } from '@/hooks/useDebounce';

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string | null;
  publishedAt: string | null;
  viewCount?: number;
  createdAt: string;
};

type Filters = {
  category: string;
  search: string;
  dateRange: string;
  sort: string;
};

const DEFAULT_LIMIT = 9;

export default function NewsPage() {
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    search: '',
    dateRange: 'all',
    sort: 'newest'
  });
  
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [categories, setCategories] = useState<Array<{name: string, count: number}>>([]);
  const [total, setTotal] = useState(0);

  // Debounced search for API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch categories for filter
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`/api/news?limit=1`);
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch articles based on filters
  const fetchArticles = useCallback(async (reset = false) => {
    if (reset) {
      setOffset(0);
      setArticles([]);
      setHasMore(true);
    }

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        category: filters.category,
        search: debouncedSearch,
        dateRange: filters.dateRange,
        sort: filters.sort,
        limit: String(DEFAULT_LIMIT),
        offset: String(offset)
      }).toString();

      const response = await fetch(`/api/news?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load news');
      }

      setArticles(prev => reset ? data.news : [...prev, ...data.news]);
      setTotal(data.total || 0);
      setHasMore(data.news.length === DEFAULT_LIMIT);
      
      // Update category counts if we got them
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters.category, debouncedSearch, filters.dateRange, filters.sort, offset]);

  // Reset pagination when filters change
  useEffect(() => {
    fetchArticles(true);
  }, [filters.category, filters.search, filters.dateRange, filters.sort, fetchArticles]);

  // Load more articles
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setOffset(prev => prev + DEFAULT_LIMIT);
      fetchArticles(false);
    }
  }, [loading, hasMore, fetchArticles]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  // Handle clear search
  const handleClearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
  };

  // Format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Theology: 'bg-purple-500/90 text-white',
      Ministry: 'bg-gold text-black',
      Events: 'bg-blue-500/90 text-white',
      Global: 'bg-emerald-500/90 text-white',
      Education: 'bg-cyan-500/90 text-black',
      Community: 'bg-pink-500/90 text-white',
      Featured: 'bg-gradient-to-r from-purple-500 via-red-500 to-yellow-500 text-white'
    };
    return colors[category] || 'bg-gray-600/50 text-white';
  };

  if (loading && articles.length === 0 && offset === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <PageHeader
          label="UPDATES"
          title="Christian News"
          description="Global ministry updates and Christian news"
        />
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader
        label="UPDATES"
        title="Christian News"
        description="Global ministry updates and Christian news"
      />
      
      <section className="pb-20">
        <div className="container mx-auto px-6">
          {/* Filters Bar */}
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Box */}
            <div className="w-full lg:w-1/2">
              <label className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search news..."
                  className="w-full rounded-xl border border-white/10 bg-card py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold/60"
                />
                {filters.search && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
            </div>

            {/* Category Filter */}
            <div className="flex-1 lg:w-auto min-w-[200px]">
              <div className="relative">
                <Menu className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <button
                  onClick={(e) => {
                    // Toggle dropdown - we'll use a simple state for now
                    const el = e.currentTarget.nextElementSibling as HTMLElement | null;
                    el?.classList.toggle('hidden');
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-card py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold/60"
                >
                  <span>
                    {filters.category === 'all' 
                      ? 'All Categories' 
                      : filters.category === 'featured'
                        ? 'Featured'
                        : filters.category}
                  </span>
                  <span className="ml-2 text-xs">
                    ▾
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 rounded-md bg-card border border-white/10 py-2 z-20 hidden">
                  {/* All Categories */}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.category === 'all' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    All Categories
                  </button>
                  {/* Featured */}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: 'featured' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.category === 'featured' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Featured
                  </button>
                  {/* Dynamic Categories */}
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setFilters(prev => ({ ...prev, category: cat.name }))}
                      className={`flex w-full items-center px-4 py-2 text-sm ${filters.category === cat.name ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex-1 lg:w-auto min-w-[200px]">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <button
                  onClick={(e) => {
                    const el = e.currentTarget.nextElementSibling as HTMLElement | null;
                    el?.classList.toggle('hidden');
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-card py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold/60"
                >
                  <span>
                    {filters.dateRange === 'all' 
                      ? 'All Time' 
                      : filters.dateRange === '7d'
                        ? 'Last 7 Days'
                        : filters.dateRange === '30d'
                          ? 'Last 30 Days'
                          : 'This Year'}
                  </span>
                  <span className="ml-2 text-xs">
                    ▾
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 rounded-md bg-card border border-white/10 py-2 z-20 hidden">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.dateRange === 'all' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: '7d' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.dateRange === '7d' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: '30d' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.dateRange === '30d' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, dateRange: '365d' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.dateRange === '365d' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    This Year
                  </button>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex-1 lg:w-auto min-w-[200px] text-right">
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <button
                  onClick={(e) => {
                    const el = e.currentTarget.nextElementSibling as HTMLElement | null;
                    el?.classList.toggle('hidden');
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-card py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-gold/60"
                >
                  <span>
                    {filters.sort === 'newest' 
                      ? 'Newest' 
                      : filters.sort === 'popular'
                        ? 'Most Popular'
                        : 'Trending'}
                  </span>
                  <span className="ml-2 text-xs">
                    ▾
                  </span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 rounded-md bg-card border border-white/10 py-2 z-20 hidden">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'newest' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.sort === 'newest' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'popular' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.sort === 'popular' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Most Popular
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, sort: 'trending' }))}
                    className={`flex w-full items-center px-4 py-2 text-sm ${filters.sort === 'trending' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'}`}
                  >
                    Trending
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State for Articles */}
          {loading && articles.length === 0 && offset === 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && articles.length === 0 && offset === 0 && (
            <p className="py-20 text-center text-red-400">{error}</p>
          )}

          {/* Empty State */}
          {!loading && articles.length === 0 && offset === 0 && (
            <div className="text-center py-20">
              <p className="mb-4 text-gray-500">No articles match your search. Try different keywords.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, search: '', category: 'all' }))}
                  className="px-6 py-3 bg-gold text-black rounded-xl hover:bg-gold/90 transition"
                >
                  Clear Filters
                </button>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, sort: 'newest' }))}
                  className="px-6 py-3 border border-white/10 text-white rounded-xl hover:bg-white/10 transition"
                >
                  Show Recent
                </button>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`}>
                  <Card className="flex h-full flex-col overflow-hidden p-0 hover:border-gold/20 transition">
                    <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span
                        className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getCategoryColor(article.category)}`}
                      >
                        {article.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 font-cinzel text-lg font-semibold leading-tight text-white transition group-hover:text-gold">
                        {article.title}
                      </h3>
                      <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-400">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          {article.author ? (
                            <>
                              <User size={12} /> {article.author}
                            </>
                          ) : (
                            <>
                              <User size={12} /> Staff Writer
                            </>
                          )}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} /> {formatDate(article.publishedAt)}
                        </span>
                        {article.viewCount !== undefined && (
                          <span className="flex items-center gap-1.5">
                            <RefreshCw size={12} /> {article.viewCount.toLocaleString()} views
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && articles.length > 0 && (
            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-4 bg-gold text-black rounded-xl hover:bg-gold/90 flex items-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load more articles
                    <RefreshCw className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}