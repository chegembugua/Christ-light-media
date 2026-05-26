import { useState, useEffect } from 'react';
import { Newspaper, Filter, Clock, Eye } from 'lucide-react';
import { newsService, NewsItem } from '../services/newsService';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATEGORIES = ["All", "Church", "Ministry", "Persecution", "Testimonies", "Global Faith", "Bible Insight", "Christian Culture"];

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const res = await newsService.getAllItems();
      if (res.success && res.data) {
        setNews(res.data);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(n => {
    const matchesCategory = activeCategory === 'All' || n.category === activeCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featured = filteredNews.find(n => n.isFeatured) || (filteredNews.length > 0 && activeCategory === 'All' && !searchQuery ? filteredNews[0] : null);
  const gridNews = featured ? filteredNews.filter(n => n.id !== featured.id) : filteredNews;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md flex items-center justify-center gap-4">
             Christian News
          </h1>
          <p className="text-gray-400 text-xl font-light max-w-3xl mx-auto tracking-wide mb-10">
             Inspiring stories, global faith updates, and biblical insights.
          </p>
          
          <div className="max-w-2xl mx-auto relative mb-12 flex items-center">
             <input 
                type="text" 
                placeholder="Search headlines, authors, or topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface/80 border border-white/10 rounded-full py-4 px-6 text-white focus:outline-none focus:border-gold/50 shadow-lg backdrop-blur-md"
             />
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto hide-scrollbar justify-start md:justify-center gap-3 mb-16 relative z-10 px-4 max-w-7xl mx-auto pb-4">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2.5 rounded-full text-[11px] whitespace-nowrap uppercase tracking-widest font-bold transition-all shrink-0 ${
              activeCategory === category
                ? 'bg-white text-primary-base shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                : 'bg-surface border border-white/5 text-gray-400 hover:text-white hover:border-white/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20 relative z-10">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : news.length === 0 ? (
         <div className="text-center py-24 relative z-10">
            <p className="text-gray-500">No news articles available at the moment.</p>
         </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Featured News */}
          {featured && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="mb-20"
            >
              <Link to={`/news/${featured.id}`} className="block group rounded-3xl overflow-hidden shadow-2xl relative bg-surface border border-white/5 hover:border-gold/30 transition-all duration-500">
                  <div className="absolute inset-0 aspect-[2/1] md:aspect-[3/1]">
                    <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-primary-base/80 to-transparent" />
                  </div>
                  
                  <div className="relative pt-[40%] md:pt-[25%] p-8 md:p-12 lg:p-16 flex flex-col justify-end">
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest rounded-full border border-gold/20 mb-4 max-w-fit">
                      {featured.category}
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-4 leading-tight group-hover:text-gold transition-colors">{featured.title}</h2>
                    <p className="text-gray-300 md:text-xl max-w-4xl line-clamp-2 md:line-clamp-3 leading-relaxed font-light mb-6">{featured.subtitle}</p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                       <span>By {featured.author}</span>
                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {featured.readTime} min read</span>
                       <span>{new Date(featured.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
              </Link>
            </motion.div>
          )}

          {gridNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {gridNews.map((article, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={article.id}
                  >
                    <Link to={`/news/${article.id}`} className="block bg-surface/40 rounded-2xl border border-white/5 hover:border-white/20 transition-all overflow-hidden h-full flex flex-col group shadow-lg">
                        <div className="relative aspect-[3/2] overflow-hidden">
                          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                            {article.category}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <h4 className="text-white font-serif text-2xl mb-3 line-clamp-2 leading-snug group-hover:text-gold transition-colors">{article.title}</h4>
                          <p className="text-gray-400 text-sm mb-6 line-clamp-3 font-light leading-relaxed">
                             {article.subtitle}
                          </p>
                          <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-5 border-t border-white/5">
                            <span className="font-medium text-white/80">{article.author}</span>
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {article.readTime}m</span>
                          </div>
                        </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
