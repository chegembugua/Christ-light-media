'use client';

import Image from 'next/image';
import Link from 'next/link';

type NewsCardProps = {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedDate: Date | string | null;
  author?: string;
  slug: string;
  viewCount?: number;
  onClick?: () => void;
};

export default function NewsCard({
  title,
  excerpt,
  coverImage,
  category,
  publishedDate,
  author,
  slug,
  viewCount,
  onClick
}: NewsCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  return (
    <div className="group">
      {onClick ? (
        <div
          onClick={onClick}
          className="cursor-pointer hover:border-gold/20 transition"
        >
          <Link href={`/news/${slug}`} passHref>
            <div className="flex h-full flex-col overflow-hidden p-0">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={coverImage}
                  alt={title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span
                  className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getCategoryColor(category)}`}
                >
                  {category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-3 font-cinzel text-lg font-semibold leading-tight text-white transition group-hover:text-gold">
                  {title}
                </h3>
                <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-400">
                  {excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    {author ? (
                      <>
                        <User size={12} /> {author}
                      </>
                    ) : (
                      <>
                        <User size={12} /> Staff Writer
                      </>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> {publishedDate ? formatDate(publishedDate) : ""}
                  </span>
                  {viewCount !== undefined && (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw size={12} /> {viewCount.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ) : (
        <Link href={`/news/${slug}`} passHref>
          <div className="flex h-full flex-col overflow-hidden p-0 hover:border-gold/20 transition">
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span
                className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getCategoryColor(category)}`}
              >
                {category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="mb-3 font-cinzel text-lg font-semibold leading-tight text-white transition group-hover:text-gold">
                {title}
              </h3>
              <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-400">
                {excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  {author ? (
                    <>
                      <User size={12} /> {author}
                    </>
                  ) : (
                    <>
                      <User size={12} /> Staff Writer
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} /> {publishedDate ? formatDate(publishedDate) : ""}
                </span>
                {viewCount !== undefined && (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw size={12} /> {viewCount.toLocaleString()} views
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

// Import the icons we need
import { User, Calendar, RefreshCw } from 'lucide-react';