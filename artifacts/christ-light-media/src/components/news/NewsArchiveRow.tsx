
;
import { Link } from 'wouter';

type NewsArchiveRowProps = {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  publishedDate: Date | string | null;
  viewCount: number;
  slug: string;
};

export default function NewsArchiveRow({
  title,
  excerpt,
  coverImage,
  category,
  publishedDate,
  viewCount,
  slug
}: NewsArchiveRowProps) {
  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
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
    <Link href={`/news/${slug}`} passHref className="block">
      <div className="p-4 border-b border-white/10 hover:bg-white/5 transition">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative w-20 h-20 rounded flex-shrink-0 overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover rounded"
              unoptimized
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="mb-2 font-semibold text-white line-clamp-2">
              {title}
            </h3>
            <p className="mb-2 text-gray-400 line-clamp-1">
              {excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className={`rounded-full px-2 py-0.5 text-xs ${getCategoryColor(category)}`}>
                {category}
              </span>
              <span>
                <span className="mr-1">•</span> {formatDate(publishedDate)}
              </span>
              <span>
                <span className="mr-1">•</span> {viewCount.toLocaleString()} views
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition">
            <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}