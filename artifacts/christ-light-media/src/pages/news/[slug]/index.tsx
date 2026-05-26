
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'wouter';
import { 
  Calendar, 
  Clock, 
  User,
  Copy,
  Mail,
  Facebook,
  MessageCircleHeart, // Using MessageCircleHeart as WhatsApp alternative
  Eye,
  RefreshCw
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import RelatedArticles from '@/components/news/RelatedArticles';

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string | null;
  publishedAt: string | null;
  viewCount: number;
  createdAt: string;
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200)); // 200 words per minute
}

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch article
  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/news/${params.slug}`);
      const result = await response.json();

      if (response.status === 404) {
        setMissing(true);
        return;
      }

      if (!response.ok || !result.article) {
        throw new Error(result.error || 'Unable to load article.');
      }

      setArticle(result.article);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading the article.');
      setMissing(true);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  // Fetch related articles
  const fetchRelatedArticles = useCallback(async () => {
    if (!article) return;
    setRelatedLoading(true);
    try {
      const response = await fetch(`/api/news/${article.slug}/related?limit=3`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load related articles');
      }
      setRelatedArticles(result.articles || []);
    } catch (err) {
      console.error('Failed to fetch related articles:', err);
    } finally {
      setRelatedLoading(false);
    }
  }, [article]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    if (article) {
      fetchRelatedArticles();
    }
  }, [article, fetchRelatedArticles]);

  

  // Handle share actions
  const handleShare = (platform: string) => {
    if (!article) return;
    const url = `${window.location.origin}/news/${article.slug}`;
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this article: ${article.title} ${url}`)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'facebook':
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        break;
      case 'email':
        const emailUrl = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`Check out this article: ${article.title}\n\n${url}`)}`;
        window.location.href = emailUrl;
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen px-6 pt-32">
        <div className="mx-auto h-[420px] max-w-4xl animate-pulse rounded-2xl bg-white/10" />
      </div>
    );
  }

  

  return (
    <article className="min-h-screen bg-[#0A0A0A] px-6 pb-20 pt-32">
      {/* Share Buttons (sticky on desktop) */}
      <div className="fixed right-6 top-[20%] hidden lg:flex lg:flex-col lg:space-y-3 z-50">
        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition" aria-label="Copy link">
          <Copy className="h-5 w-5" onClick={() => handleShare('copy')} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition" aria-label="Share on Facebook">
          <Facebook className="h-5 w-5" onClick={() => handleShare('facebook')} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition" aria-label="Share on WhatsApp">
          <MessageCircleHeart className="h-5 w-5" onClick={() => handleShare('whatsapp')} />
        </div>
        <div className="flex items-center gap-2 text-gray-400 hover:text-white transition" aria-label="Share via Email">
          <Mail className="h-5 w-5" onClick={() => handleShare('email')} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Article Image */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-white/10">
          <div className="relative aspect-video w-full">
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Category Badge */}
        <div className="mb-4">
          <span className={`rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black`}>
            {article.category}
          </span>
        </div>

        {/* Article Title */}
        <h1 className="mb-4 font-cinzel text-4xl font-bold leading-tight text-white md:text-5xl">
          {article.title}
        </h1>

        {/* Article Stats */}
        <div className="mb-8 flex flex-wrap gap-6 border-b border-white/10 pb-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <User size={16} /> {article.author ?? 'Staff Writer'}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={16} /> {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} /> {estimateReadTime(article.content)} min read
          </span>
          <span className="flex items-center gap-2">
            <Eye size={16} /> {article.viewCount.toLocaleString()} views
          </span>
        </div>

        {/* Article Content */}
        <div className="space-y-8 text-lg leading-9 text-gray-300">
          {article.content
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
        </div>

        {/* Related Articles Section */}
        {relatedLoading ? (
          <div className="mt-12">
            <h3 className="mb-6 font-cinzel text-2xl font-semibold text-white">
              Related Articles
            </h3>
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        ) : (
          <RelatedArticles articles={relatedArticles} />
        )}

        {/* Comments Section Skeleton */}
        <div className="mt-16">
          <h3 className="mb-6 font-cinzel text-2xl font-semibold text-white">
            Discussion
          </h3>
          <p className="text-gray-500">Comments coming soon</p>
        </div>
      </div>
    </article>
  );
}