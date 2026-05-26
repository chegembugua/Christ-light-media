import { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

import { usePlayer } from '../contexts/PlayerContext';

const CATEGORIES = ['All', 'Worship', 'Gospel', 'Sermons', 'Instrumental'];

export default function Music() {
  const { playTrack } = usePlayer();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchMusic = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'music'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setTracks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'music');
      }
      setLoading(false);
    };
    fetchMusic();
  }, []);

  const filteredTracks = activeCategory === 'All' 
    ? tracks 
    : tracks.filter(t => t.category === activeCategory);

  const handlePlayMusic = (track: any) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      coverImage: track.coverImageUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070",
      audioUrl: track.audioUrl,
      type: 'music'
    });
  };

  const featured = filteredTracks.length > 0 && activeCategory === 'All' ? filteredTracks[0] : null;
  const gridTracks = featured ? filteredTracks.filter(t => t.id !== featured.id) : filteredTracks;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-md">Music of Christ Light</h1>
          <p className="text-gray-400 text-xl font-light max-w-2xl mx-auto tracking-wide">
            Worship, Gospel & Spirit-filled sound
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
      ) : tracks.length === 0 ? (
         <div className="text-center py-24 relative z-10">
            <p className="text-gray-500">No music tracks available at the moment.</p>
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
                <div 
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handlePlayMusic(featured)}
                >
                  <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(200,162,74,0.5)]">
                    <Play className="w-8 h-8 text-primary-base ml-1" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest rounded-full">
                  Featured Track
                </div>
                <h2 className="font-serif text-4xl lg:text-5xl text-white mb-2 leading-tight">{featured.title}</h2>
                <p className="text-xl text-gray-400 mb-8">{featured.artist}</p>
                
                <button 
                  onClick={() => handlePlayMusic(featured)}
                  className="bg-gold text-primary-base hover:bg-gold-light border border-gold hover:border-white/20 transition-all duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm inline-flex items-center gap-2 shadow-[0_0_15px_rgba(200,162,74,0.2)] hover:shadow-[0_0_25px_rgba(200,162,74,0.4)]"
                >
                  <Play className="w-4 h-4" fill="currentColor"/> Listen Now
                </button>
              </div>
            </motion.div>
          )}

          {gridTracks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <AnimatePresence>
                {gridTracks.map((track, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={track.id}
                    className="group cursor-pointer bg-surface/20 p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-surface/40 transition-all"
                    onClick={() => handlePlayMusic(track)}
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-lg">
                      <img src={track.coverImageUrl || "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070"} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-primary-base/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(200,162,74,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                          <Play className="w-5 h-5 text-primary-base ml-1" fill="currentColor" />
                         </div>
                      </div>
                    </div>
                    <h4 className="text-white font-medium text-sm truncate">{track.title}</h4>
                    <p className="text-gray-500 text-xs truncate mt-1 mb-2">{track.artist}</p>
                    <span className="text-[10px] text-gold/80 px-2 py-0.5 bg-gold/10 rounded-full uppercase tracking-wider font-bold">
                      {track.category}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            !featured && (
              <div className="text-center py-12">
                <p className="text-gray-500">No tracks found in this category.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
