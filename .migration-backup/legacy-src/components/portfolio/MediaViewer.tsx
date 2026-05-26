import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { PortfolioItem } from '../../services/portfolioService';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaViewerProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export default function MediaViewer({ item, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!item) return null;

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % item.mediaUrls.length);
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + item.mediaUrls.length) % item.mediaUrls.length);
  };

  const hasMultiple = item.mediaUrls.length > 1;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-primary-base/95 backdrop-blur-sm p-4 md:p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 text-gray-400 hover:text-white transition-colors p-2 z-10 bg-black/20 rounded-full"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative w-full max-w-6xl max-h-full flex flex-col items-center">
          
          <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden min-h-[50vh] xl:min-h-[70vh]">
            {item.type === 'video' ? (
              <video 
                src={item.mediaUrls[currentIndex]} 
                controls 
                autoPlay 
                className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain drop-shadow-[0_0_30px_rgba(200,162,74,0.15)]"
              />
            ) : (
              <img 
                src={item.mediaUrls[currentIndex] || item.thumbnailUrl} 
                alt={item.title}
                className="max-w-full max-h-[75vh] rounded-lg shadow-2xl object-contain drop-shadow-[0_0_30px_rgba(200,162,74,0.15)]"
              />
            )}
            
            {hasMultiple && (
              <>
                <button 
                  onClick={prevMedia}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold/80 text-white rounded-full p-3 transition-colors backdrop-blur-md border border-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextMedia}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-gold/80 text-white rounded-full p-3 transition-colors backdrop-blur-md border border-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl mt-6 md:mt-8 text-center bg-surface/50 border border-white/5 rounded-2xl p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-xs uppercase tracking-widest text-gold font-medium">
              <span>{item.category}</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="flex items-center gap-1">
                {item.type === 'video' && <Play className="w-3 h-3" />} 
                {item.type}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">{item.title}</h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">
              {item.description}
            </p>
            
            {hasMultiple && (
              <div className="flex justify-center gap-2 mt-6">
                {item.mediaUrls.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-gold' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
