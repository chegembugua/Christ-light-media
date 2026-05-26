
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { NewsForm, type News } from '@/components/admin/NewsForm';

type StatusFilter = 'all' | 'published' | 'draft';

const categoryColors: Record<string, string> = {
  Theology: 'bg-purple-500/10 text-purple-300',
  Ministry: 'bg-gold/10 text-gold',
  Events: 'bg-blue-500/10 text-blue-300',
  Global: 'bg-emerald-500/10 text-emerald-300',
  Education: 'bg-cyan-500/10 text-cyan-300',
  Community: 'bg-pink-500/10 text-pink-300',
};

function formatDate(article: News) {
  const date = article.publishedAt ?? article.updatedAt ?? article.createdAt;
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-white/10">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 p-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_96px]"
        >
          {Array.from({ length: 6 }).map((__, cell) => (
            <div key={cell} className="h-5 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<News[]>([]);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/news?status=${status}`);
      const result = (await response.json()) as { news?: News[]; error?: string };

      if (!response.ok || !result.news) {
        throw new Error(result.error ?? 'Unable to load articles.');
      }

      setArticles(result.news);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load articles.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void fetchArticles();
  }, [fetchArticles]);

  const filteredArticles = useMemo(() => {
    if (category === 'all') return articles;
    return articles.filter((article) => article.category === category);
  }, [articles, category]);

  const handleDelete = async (article: News) => {
    if (!confirm(`Delete "${article.title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/news/${article.slug}`, { method: 'DELETE' });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Unable to delete article.');
      }

      setArticles((current) => current.filter((item) => item.slug !== article.slug));
      toast.success('Article deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete article.');
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-cinzel text-3xl text-white">News</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage Christian news and ministry updates
          </p>
        </div>
        <Link href="/admin/news/new">
          <Button>
            <span className="inline-flex items-center gap-2">
              <Plus size={16} /> New Article
            </span>
          </Button>
        </Link>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <NewsForm mode="create" onSubmit={() => void fetchArticles()} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="font-cinzel text-2xl text-white">Articles</h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex rounded-lg border border-white/10 bg-card p-1">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Published', value: 'published' },
                  { label: 'Drafts', value: 'draft' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatus(tab.value as StatusFilter)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                      status === tab.value
                        ? 'bg-gold text-black'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-lg border border-white/10 bg-card px-3 py-2 text-xs font-semibold text-gray-300 outline-none focus:border-gold/50"
              >
                <option value="all">All Categories</option>
                {Object.keys(categoryColors).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_96px] gap-4 border-b border-white/10 bg-card px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 md:grid">
              <span>Title</span>
              <span>Category</span>
              <span>Author</span>
              <span>Status</span>
              <span>Date</span>
              <span className="text-right">Actions</span>
            </div>

            {loading ? (
              <SkeletonRows />
            ) : filteredArticles.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">
                No articles yet. Create one to get started!
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="grid gap-3 p-4 transition hover:bg-white/5 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_96px] md:items-center md:gap-4"
                  >
                    <Link
                      href={`/admin/news/${article.slug}/edit`}
                      className="font-medium text-white transition hover:text-gold"
                    >
                      {article.title}
                    </Link>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        categoryColors[article.category] ?? 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-400">{article.author ?? 'Staff Writer'}</span>
                    <span
                      className={
                        article.isPublished
                          ? 'w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400'
                          : 'w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300'
                      }
                    >
                      {article.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-sm text-gray-400">{formatDate(article)}</span>
                    <div className="flex justify-start gap-2 md:justify-end">
                      <Link href={`/admin/news/${article.slug}/edit`}>
                        <Button variant="ghost" size="sm" aria-label={`Edit ${article.title}`}>
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => void handleDelete(article)}
                        aria-label={`Delete ${article.title}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
