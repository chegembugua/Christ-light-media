import { useState, useEffect } from 'react';
import { BookOpen, Loader2, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { devotionService, DevotionItem } from '../services/devotionService';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateReadTime } from '../lib/utils';

const CATEGORIES = ['All', 'Faith', 'Prayer', 'Growth', 'Leadership', 'Worship'];

export default function Devotions() {
  const [items, setItems] = useState<DevotionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    setFeaturedIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    async function loadDevotions() {
      const res = await devotionService.getAllItems();
      if (res.success && res.data) {
        const sorted = res.data.sort((a, b) => b.createdAt - a.createdAt);
        setItems(sorted);
        
        // Find initial featured index or default to 0
        const initialFeatured = sorted.findIndex(item => item.isFeatured);
        if (initialFeatured !== -1) setFeaturedIndex(initialFeatured);
      }
      setLoading(false);
    }
    loadDevotions();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const featured = filteredItems.length > 0 ? filteredItems[featuredIndex % filteredItems.length] : null;
  const standard = filteredItems.filter(item => item.id !== featured?.id);

  const nextFeatured = () => {
    if (filteredItems.length === 0) return;
    setFeaturedIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevFeatured = () => {
    if (filteredItems.length === 0) return;
    setFeaturedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary-base px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md tracking-tight">Daily Devotions</h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-wide">
              Feed your spirit with the Word of God
            </p>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm uppercase tracking-wider font-medium transition-all ${
                activeCategory === category
                  ? 'bg-gold text-primary-base shadow-[0_0_15px_rgba(200,162,74,0.4)]'
                  : 'bg-surface border border-white/5 text-gray-400 hover:text-white hover:border-gold/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block p-6 rounded-full bg-surface/50 border border-white/5 mb-6">
               <p className="text-gray-400 font-serif italic text-lg">No Devotions Found</p>
            </div>
            <p className="text-gray-500">There are no devotions available at the moment.</p>
          </div>
        ) : (
          <>
            {/* Featured Section */}
            {featured && (
              <motion.div 
                key={featured.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-16 relative group"
              >
                {/* Navigation Buttons */}
                <div className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevFeatured(); }}
                    className="w-10 h-10 md:w-12 md:h-12 bg-surface/80 backdrop-blur-md border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-primary-base transition-all shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextFeatured(); }}
                    className="w-10 h-10 md:w-12 md:h-12 bg-surface/80 backdrop-blur-md border border-gold/30 rounded-full flex items-center justify-center text-gold hover:bg-gold hover:text-primary-base transition-all shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <Link to={`/devotions/${featured.id}`} className="block group/card">
                  <div className="bg-surface/30 border border-gold/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(200,162,74,0.05)] grid md:grid-cols-2 relative backdrop-blur-sm transition-all duration-700 group-hover/card:border-gold/50 group-hover/card:shadow-[0_0_50px_rgba(200,162,74,0.15)] group-hover/card:-translate-y-1">
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold text-primary-base text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                          {featured.isFeatured ? 'Featured' : 'Daily'} {featured.category}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{new Date(featured.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight group-hover/card:text-gold transition-colors">{featured.title}</h2>
                      <p className="text-gold font-serif italic text-xl mb-6">{featured.scriptureReference}</p>
                      {featured.scriptureText && (
                        <p className="text-gray-300 italic mb-8 border-l-2 border-gold/50 pl-4">{featured.scriptureText}</p>
                      )}
                      <p className="text-gray-400 mb-8 line-clamp-3 leading-relaxed font-light">{featured.content}</p>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <div className="flex items-center gap-6 text-xs text-gray-500 font-medium tracking-wider">
                          <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gold/60" /> By {featured.author || 'Member'}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold/60" /> {featured.readTime || calculateReadTime(featured.content)} min read</span>
                        </div>
                        <div className="flex items-center text-gold font-black uppercase tracking-[0.2em] text-[10px] group-hover/card:translate-x-2 transition-transform duration-300">
                          Read More <span className="ml-2 text-base">→</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:flex bg-black/40 items-center justify-center p-12 border-l border-white/5 relative overflow-hidden group-hover/card:bg-black/20 transition-colors">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity" />
                      <BookOpen className="w-48 h-48 text-gold/10 relative z-10" strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            {standard.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {standard.map((devotion, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      key={devotion.id} 
                    >
                      <Link 
                        to={`/devotions/${devotion.id}`}
                        className="bg-surface/30 border border-white/5 rounded-2xl overflow-hidden hover:border-gold/30 hover:shadow-[0_0_30px_rgba(200,162,74,0.15)] transition-all duration-500 group backdrop-blur-md flex flex-col h-full hover:-translate-y-1"
                      >
                        <div className="p-8 flex-1 flex flex-col relative overflow-hidden">
                          {/* Accent line */}
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="flex justify-between items-start mb-6">
                             <div className="inline-block px-3 py-1 bg-gold/10 text-gold text-[10px] uppercase font-black tracking-[0.2em] rounded-full border border-gold/10">{devotion.category}</div>
                             <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{new Date(devotion.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors line-clamp-2 leading-tight">{devotion.title}</h3>
                          <p className="text-gold/80 font-serif italic text-sm mb-5 flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 opacity-60" />
                            {devotion.scriptureReference}
                          </p>
                          <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3 mb-8 flex-1">
                            {devotion.content}
                          </p>
                          
                          <div className="pt-6 border-t border-white/5 mt-auto flex flex-col gap-4">
                            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><User className="w-3 h-3 text-gold/50" /> {devotion.author || 'Missionary'}</span>
                               <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-gold/50" /> {devotion.readTime || calculateReadTime(devotion.content)} min</span>
                            </div>
                            <div className="text-gold text-[10px] font-black uppercase tracking-[0.3em] transition-all group-hover:translate-x-2 flex items-center">
                              Read Devotion <span className="ml-2 text-base">→</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {standard.length === 0 && !featured && activeCategory !== 'All' && (
              <div className="text-center py-12">
                <p className="text-gray-500">No devotions found in this category.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
