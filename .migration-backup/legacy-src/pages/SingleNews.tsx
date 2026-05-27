import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsService, NewsItem } from '../services/newsService';
import { ArrowLeft, Clock, Share2, Eye, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import LikeButton from '../components/engagement/LikeButton';
import CommentSection from '../components/engagement/CommentSection';

export default function SingleNews() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      if (id) {
        const res = await newsService.getItemById(id);
        if (res.success && res.data) {
          setArticle(res.data);
          document.title = `${res.data.title} | Christ Light News`;
          // Increment view count in background
          newsService.incrementViews(id);
          
          // Fetch related (same category)
          const allRes = await newsService.getAllItems();
          if (allRes.success && allRes.data) {
             setRelated(allRes.data.filter(n => n.category === res.data!.category && n.id !== id).slice(0, 3));
          }
        }
      }
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article?.title;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  if (!article) {
      return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">News article not found.</p>
          <Link to="/news" className="text-gold hover:underline">Back to News</Link>
       </div>
     );
  }

  return (
    <div className="bg-primary-base min-h-screen pb-32 relative">
      {/* Hero Image Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh]">
         <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-primary-base/60 to-black/20" />
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:px-24">
            <div className="max-w-4xl mx-auto">
               <Link to="/news" className="inline-flex items-center text-gold hover:text-white transition-colors mb-6 text-xs uppercase tracking-widest font-bold">
                 <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
               </Link>
               
               <div className="mb-4">
                 <span className="inline-block px-3 py-1 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 backdrop-blur-md">
                    {article.category}
                 </span>
               </div>
               
               <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight drop-shadow-lg">
                  {article.title}
               </h1>
               <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl leading-relaxed drop-shadow-md">
                 {article.subtitle}
               </p>
            </div>
         </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
        
        {/* Meta Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10 mb-12">
           <div className="flex items-center gap-6 text-sm text-gray-400 font-medium tracking-wide">
              <span className="text-white">By {article.author}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {article.readTime} min read</span>
              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center"><Eye className="w-4 h-4 mr-1.5" /> {article.views + 1} views</span>
              <div className="border-l border-white/10 pl-6 h-6 flex items-center">
                 <LikeButton contentType="news" contentId={article.id!} contentTitle={article.title} contentOwnerId={article.createdBy} />
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button onClick={() => handleShare('twitter')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors bg-surface">
                 <Twitter className="w-4 h-4" />
              </button>
              <button onClick={() => handleShare('facebook')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors bg-surface">
                 <Facebook className="w-4 h-4" />
              </button>
              <button onClick={() => handleShare('copy')} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors bg-surface">
                 <LinkIcon className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-gold prose-lg md:prose-xl max-w-none font-serif font-light leading-relaxed text-gray-300">
           <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
           <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-3">
              <span className="text-gray-500 text-sm font-medium uppercase tracking-widest mr-2 py-1">Tags:</span>
              {article.tags.map(tag => (
                 <Link key={tag} to={`/news?tag=${tag}`} className="px-4 py-1.5 bg-surface text-gray-400 hover:text-white hover:bg-white/10 rounded-full text-xs tracking-widest uppercase transition-colors border border-white/5">
                   {tag}
                 </Link>
              ))}
           </div>
        )}

        {/* Related News */}
        {related && related.length > 0 && (
           <div className="mt-16 pt-16 border-t border-white/10">
              <h3 className="font-serif text-3xl text-white mb-10">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {related.map(rel => (
                    <Link key={rel.id} to={`/news/${rel.id}`} className="group bg-surface/40 rounded-2xl border border-white/5 hover:border-white/20 transition-all overflow-hidden flex flex-col">
                        <div className="relative aspect-[3/2] overflow-hidden">
                           <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                           <h4 className="text-white font-serif text-xl mb-3 line-clamp-2 leading-snug group-hover:text-gold transition-colors">{rel.title}</h4>
                           <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-white/5">
                              <span>{new Date(rel.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {rel.readTime}m</span>
                           </div>
                        </div>
                    </Link>
                 ))}
              </div>
           </div>
        )}

        <CommentSection contentType="news" contentId={article.id!} contentTitle={article.title} contentOwnerId={article.createdBy} />
      </div>
    </div>
  );
}
