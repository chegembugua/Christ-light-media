import { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { portfolioService, PortfolioItem } from '../services/portfolioService';
import MediaViewer from '../components/portfolio/MediaViewer';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Weddings', 'Church Events', 'Worship Sessions', 'Commercial', 'Ministry'];

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      const res = await portfolioService.getAllItems();
      if (res.success && res.data) {
        // Sort items by creation date
        setItems(res.data.sort((a, b) => b.createdAt - a.createdAt));
      }
      setLoading(false);
    }
    loadPortfolio();
  }, []);

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary-base px-4 sm:px-6 lg:px-8 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md tracking-tight">Portfolio</h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto tracking-wide">
              Capturing the Light of Christ through Visual Excellence
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

        {/* Grid Area */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-gold" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block p-6 rounded-full bg-surface/50 border border-white/5 mb-6">
               <p className="text-gray-400 font-serif italic text-lg">No Items Found</p>
            </div>
            <p className="text-gray-500">There are no {activeCategory !== 'All' ? activeCategory : ''} items in the portfolio yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={item.id} 
                  className="relative group overflow-hidden border border-white/5 bg-surface/30 rounded-xl cursor-pointer shadow-lg break-inside-avoid"
                  onClick={() => setSelectedItem(item)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-auto">
                    <img 
                      src={item.thumbnailUrl || (item.mediaUrls && item.mediaUrls[0]) || '/placeholder.jpg'} 
                      alt={item.title} 
                      className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 block"
                      loading="lazy"
                    />
                    {/* Overlay for interaction */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-base/90 via-primary-base/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Video Icon Badge */}
                    {item.type === 'video' && (
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 group-hover:bg-gold transition-colors">
                        <Play className="w-4 h-4 text-white group-hover:text-primary-base ml-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="inline-block px-3 py-1 bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase font-bold tracking-widest rounded-full mb-3 backdrop-blur-sm">
                      {item.category}
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1 tracking-wide">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Media Viewer Modal */}
      {selectedItem && (
        <MediaViewer 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
