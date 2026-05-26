import { useState, useEffect } from 'react';
import { Play, Mic, Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react';
import { podcastService, PodcastItem } from '../services/podcastService';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'react-hot-toast';

const CATEGORIES = ['All', 'Faith', 'Leadership', 'Prayer', 'Teaching', 'Testimonies', 'Bible Study', 'Christian Living'];

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      const res = await podcastService.getAllItems();
      if (res.success && res.data) {
        setPodcasts(res.data);
      }
      setLoading(false);
    };
    fetchPodcasts();
  }, []);

  const filteredPodcasts = activeCategory === 'All' 
    ? podcasts 
    : podcasts.filter(p => p.category === activeCategory);

  const featured = filteredPodcasts.find(p => p.isFeatured) || (filteredPodcasts.length > 0 && activeCategory === 'All' ? filteredPodcasts[0] : null);
  const gridPodcasts = featured ? filteredPodcasts.filter(p => p.id !== featured.id) : filteredPodcasts;

  const handleShare = (platform: 'twitter' | 'facebook' | 'copy', podcast: PodcastItem) => {
    const url = `${window.location.origin}/podcasts/${podcast.id}`;
    const text = `Check out this podcast: ${podcast.title}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md flex items-center justify-center gap-4">
             <Mic className="w-12 h-12 text-gold hidden sm:block" /> Podcasts
          </h1>
          <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto tracking-wide">
             Faith-building conversations, teachings, and stories
          </p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 relative z-10 px-4">
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
        <div className="flex justify-center py-20 relative z-10">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : podcasts.length === 0 ? (
         <div className="text-center py-24 relative z-10">
            <p className="text-gray-500">No podcasts available at the moment.</p>
         </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Featured Player Top */}
          {featured && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="bg-surface/30 backdrop-blur-md border border-gold/20 rounded-2xl p-6 sm:p-10 mb-16 flex flex-col md:flex-row items-center gap-10 shadow-[0_0_30px_rgba(200,162,74,0.05)]"
            >
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl overflow-hidden shadow-2xl flex-shrink-0 relative group">
                <img src={featured.coverImageUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <Link to={`/podcasts/${featured.id}`}>
                  <div className="absolute inset-0 bg-primary-base/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(200,162,74,0.5)]">
                      <Play className="w-8 h-8 text-primary-base ml-1" fill="currentColor" />
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest rounded-full">
                  Featured Episode
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4 leading-tight line-clamp-2">{featured.title}</h2>
                <p className="text-gray-400 mb-8 max-w-2xl line-clamp-3 leading-relaxed font-light">{featured.description}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <Link 
                      to={`/podcasts/${featured.id}`}
                      className="bg-gold text-primary-base hover:bg-gold-light border border-gold hover:border-white/20 transition-all duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm inline-flex items-center gap-2 shadow-[0_0_15px_rgba(200,162,74,0.2)] hover:shadow-[0_0_25px_rgba(200,162,74,0.4)]"
                    >
                      <Play className="w-4 h-4" fill="currentColor"/> Listen to Episode
                    </Link>
                    <span className="text-gray-500 font-medium tracking-wide">
                        Hosted by <span className="text-white">{featured.speaker}</span>
                    </span>
                </div>
              </div>
            </motion.div>
          )}

          {gridPodcasts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {gridPodcasts.map((podcast, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={podcast.id}
                    className="group"
                  >
                    <Link to={`/podcasts/${podcast.id}`} className="block bg-surface/20 p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-surface/40 transition-all h-full relative">
                        <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg group-2">
                          <img src={podcast.coverImageUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-primary-base/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(200,162,74,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                              <Play className="w-6 h-6 text-primary-base ml-1" fill="currentColor" />
                             </div>
                          </div>
                        </div>

                        {/* Share Button */}
                        <div className="absolute top-6 right-6 z-20">
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                              <button 
                                onClick={(e) => e.preventDefault()}
                                className="p-2 bg-black/40 hover:bg-gold/20 text-white hover:text-gold rounded-full backdrop-blur-sm transition-colors border border-white/10"
                              >
                                <Share2 size={16} />
                              </button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.Content className="z-[100] min-w-[150px] bg-surface/95 border border-white/10 rounded-xl p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                                <DropdownMenu.Item 
                                  onClick={(e) => { e.preventDefault(); handleShare('twitter', podcast); }}
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer outline-none transition-colors"
                                >
                                  <Twitter size={14} /> Twitter
                                </DropdownMenu.Item>
                                <DropdownMenu.Item 
                                  onClick={(e) => { e.preventDefault(); handleShare('facebook', podcast); }}
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer outline-none transition-colors"
                                >
                                  <Facebook size={14} /> Facebook
                                </DropdownMenu.Item>
                                <DropdownMenu.Item 
                                  onClick={(e) => { e.preventDefault(); handleShare('copy', podcast); }}
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gold/10 hover:text-gold rounded-lg cursor-pointer outline-none transition-colors"
                                >
                                  <LinkIcon size={14} /> Copy Link
                                </DropdownMenu.Item>
                              </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Root>
                        </div>

                        <span className="text-[10px] text-gold/80 px-2 py-0.5 bg-gold/10 rounded-full uppercase tracking-wider font-bold mb-3 inline-block">
                          {podcast.category}
                        </span>
                        <h4 className="text-white font-medium text-lg mb-1 line-clamp-2 leading-snug">{podcast.title}</h4>
                        <p className="text-gray-500 text-sm truncate mt-1">Speaker: {podcast.speaker}</p>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            !featured && (
              <div className="text-center py-12">
                <p className="text-gray-500">No episodes found in this category.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
