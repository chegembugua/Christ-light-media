'use client';

import NewsCard from './NewsCard';

type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedAt: string | null;
  viewCount?: number;
};

type RelatedArticlesProps = {
  articles: NewsArticle[];
  loading?: boolean;
};

export default function RelatedArticles({ articles, loading = false }: RelatedArticlesProps) {
  if (loading) {
    return (
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
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="mb-6 font-cinzel text-2xl font-semibold text-white">
        Related Articles
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            title={article.title}
            excerpt={article.excerpt}
            coverImage={article.coverImage}
            category={article.category}
            publishedDate={article.publishedAt ? new Date(article.publishedAt) : null}
            viewCount={article.viewCount}
            slug={article.slug}
          />
        ))}
      </div>
    </div>
  );
}