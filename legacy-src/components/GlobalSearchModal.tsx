import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Image as ImageIcon, BookOpen, Music as MusicIcon, Mic, Video, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { portfolioService, PortfolioItem } from '../services/portfolioService';
import { devotionService, DevotionItem } from '../services/devotionService';
import { musicService, MusicItem } from '../services/musicService';
import { podcastService, PodcastItem } from '../services/podcastService';
import { sermonService, SermonItem } from '../services/sermonService';
import { newsService, NewsItem } from '../services/newsService';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [categoryContext, setCategoryContext] = useState('All');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setCategoryContext('All');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
      
      const fuzzyMatch = (text?: string) => {
          if (!text) return false;
          const lowerText = text.toLowerCase();
          return searchTerms.every(term => lowerText.includes(term));
      };
      
      // Fetch all collections in parallel
      const [
        portfolioRes,
        devotionRes,
        musicRes,
        podcastRes,
        sermonRes,
        newsRes
      ] = await Promise.all([
        categoryContext === 'All' || categoryContext === 'Portfolio' ? portfolioService.getAllItems() : Promise.resolve({ success: true, data: [] }),
        categoryContext === 'All' || categoryContext === 'Devotion' ? devotionService.getAllItems() : Promise.resolve({ success: true, data: [] }),
        categoryContext === 'All' || categoryContext === 'Music' ? musicService.getAllItems() : Promise.resolve({ success: true, data: [] }),
        categoryContext === 'All' || categoryContext === 'Podcast' ? podcastService.getAllItems() : Promise.resolve({ success: true, data: [] }),
        categoryContext === 'All' || categoryContext === 'Sermon' ? sermonService.getAllItems() : Promise.resolve({ success: true, data: [] }),
        categoryContext === 'All' || categoryContext === 'News' ? newsService.getAllItems() : Promise.resolve({ success: true, data: [] })
      ]);

      let allResults: any[] = [];

      if (portfolioRes.success && portfolioRes.data) {
        const matches = portfolioRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.description) || fuzzyMatch(i.category))
          .map(i => ({ ...i, type: 'portfolio', link: '/portfolio' }));
        allResults = [...allResults, ...matches];
      }

      if (devotionRes.success && devotionRes.data) {
        const matches = devotionRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.content))
          .map(i => ({ ...i, type: 'devotion', link: `/devotions/${i.id}` }));
        allResults = [...allResults, ...matches];
      }

      if (musicRes.success && musicRes.data) {
        const matches = musicRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.artist))
          .map(i => ({ ...i, type: 'music', link: '/music' }));
        allResults = [...allResults, ...matches];
      }

      if (podcastRes.success && podcastRes.data) {
        const matches = podcastRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.speaker))
          .map(i => ({ ...i, type: 'podcast', link: `/podcasts/${i.id}` }));
        allResults = [...allResults, ...matches];
      }

      if (sermonRes.success && sermonRes.data) {
        const matches = sermonRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.speaker) || fuzzyMatch(i.scriptureReference))
          .map(i => ({ ...i, type: 'sermon', link: `/sermons/${i.id}` }));
        allResults = [...allResults, ...matches];
      }

      if (newsRes.success && newsRes.data) {
        const matches = newsRes.data.filter(i => fuzzyMatch(i.title) || fuzzyMatch(i.subtitle) || fuzzyMatch(i.author))
          .map(i => ({ ...i, type: 'news', link: `/news/${i.id}` }));
        allResults = [...allResults, ...matches];
      }

      setResults(allResults);
      setLoading(false);
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query, categoryContext]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch(type) {
      case 'portfolio': return <ImageIcon className="w-5 h-5 text-gray-400" />;
      case 'devotion': return <BookOpen className="w-5 h-5 text-gray-400" />;
      case 'music': return <MusicIcon className="w-5 h-5 text-gray-400" />;
      case 'podcast': return <Mic className="w-5 h-5 text-gray-400" />;
      case 'sermon': return <Video className="w-5 h-5 text-gray-400" />;
      case 'news': return <Newspaper className="w-5 h-5 text-gray-400" />;
      default: return <Search className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const getLabel = (type: string) => {
     switch(type) {
        case 'portfolio': return 'Media';
        case 'devotion': return 'Devotion';
        case 'music': return 'Music';
        case 'podcast': return 'Podcast';
        case 'sermon': return 'Sermon';
        case 'news': return 'News';
        default: return 'Item';
     }
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-3xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="relative border-b border-white/10 p-2">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input 
              ref={inputRef}
              type="text"
              placeholder="Search across all media, teachings, and music..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white text-lg py-4 pl-16 pr-12 focus:outline-none focus:ring-0 placeholder-gray-500"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
            {!query && (
               <button onClick={onClose} className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors text-xs font-medium uppercase tracking-widest">
                  ESC
               </button>
            )}
          </div>
          
          <div className="border-b border-white/10 p-3 flex overflow-x-auto hide-scrollbar gap-2">
              {['All', 'Portfolio', 'Devotion', 'Music', 'Podcast', 'Sermon', 'News'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryContext(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors border ${
                        categoryContext === cat 
                          ? 'bg-gold/20 text-gold border-gold/50' 
                          : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                     {cat === 'Portfolio' ? 'Media' : cat}
                  </button>
              ))}
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto min-h-[100px] max-h-[60vh] p-2">
             {loading ? (
                <div className="flex items-center justify-center py-12">
                   <Loader2 className="w-8 h-8 text-gold animate-spin" />
                </div>
             ) : query.length < 2 ? (
                <div className="py-12 text-center text-gray-500">
                   <p>Type at least 2 characters to search.</p>
                </div>
             ) : results.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                   <p>No results found for "<span className="text-white">{query}</span>".</p>
                </div>
             ) : (
                <div className="space-y-1">
                   {results.map((item, idx) => (
                      <Link 
                        key={`${item.type}-${item.id}-${idx}`} 
                        to={item.link}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                         <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center shrink-0">
                            {item.imageUrl || item.coverImageUrl ? (
                               <img src={item.imageUrl || item.coverImageUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                            ) : (
                               getIcon(item.type)
                            )}
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate group-hover:text-gold transition-colors">
                               {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                               <span className="px-2 py-0.5 bg-black/50 rounded text-gold border border-gold/20 uppercase tracking-widest text-[9px] font-bold">
                                  {getLabel(item.type)}
                               </span>
                               <span className="truncate">
                                  {item.speaker || item.artist || item.author || 'View Details'}
                               </span>
                            </div>
                         </div>
                      </Link>
                   ))}
                </div>
             )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
