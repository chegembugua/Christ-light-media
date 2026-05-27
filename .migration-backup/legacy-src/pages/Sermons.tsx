import { useState, useEffect } from 'react';
import { Play, Filter, BookOpen } from 'lucide-react';
import { sermonService, SermonItem } from '../services/sermonService';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Faith', 'Prayer', 'Healing', 'Marriage', 'End Times', 'Leadership', 'Testimonies', 'Praise'];

export default function Sermons() {
  const [sermons, setSermons] = useState<SermonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSpeaker, setActiveSpeaker] = useState('All');
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSermons = async () => {
      setLoading(true);
      const res = await sermonService.getAllItems();
      if (res.success && res.data) {
        setSermons(res.data);
      }
      setLoading(false);
    };
    fetchSermons();
  }, []);

  const uniqueSpeakers = ['All', ...Array.from(new Set(sermons.map(s => s.speaker).filter(Boolean)))];
  const uniqueTags = ['All', ...Array.from(new Set(sermons.flatMap(s => s.tags || [])))];

  const filteredSermons = sermons.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    const matchesSpeaker = activeSpeaker === 'All' || s.speaker === activeSpeaker;
    const matchesTag = activeTag === 'All' || (s.tags && s.tags.includes(activeTag));
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.scriptureReference?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSpeaker && matchesTag && matchesSearch;
  });

  const featured = filteredSermons.find(s => s.isFeatured) || (filteredSermons.length > 0 && activeCategory === 'All' && !searchQuery ? filteredSermons[0] : null);
  const gridSermons = featured ? filteredSermons.filter(s => s.id !== featured.id) : filteredSermons;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gold/5 to-transparent blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md flex items-center justify-center gap-4">
             Sermon Library
          </h1>
          <p className="text-gray-400 text-xl font-light max-w-3xl mx-auto tracking-wide mb-10">
             Powerful teachings and uncompromised Word to build your faith and equip you for ministry.
          </p>
          
          <div className="max-w-2xl mx-auto relative mb-12">
             <input 
                type="text" 
                placeholder="Search by title, speaker, or scripture..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface/80 border border-white/10 rounded-full py-4 px-6 pl-12 text-white focus:outline-none focus:border-gold/50 shadow-lg backdrop-blur-md"
             />
             <Filter className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </motion.div>
      </div>

      {/* Filters (Categories, Speaker, Tags) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16 relative z-10 px-4 max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 flex-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all ${
                activeCategory === category
                  ? 'bg-gold text-primary-base shadow-[0_0_15px_rgba(200,162,74,0.4)]'
                  : 'bg-surface border border-white/5 text-gray-400 hover:text-white hover:border-gold/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
            {uniqueSpeakers.length > 1 && (
                <select
                    value={activeSpeaker}
                    onChange={(e) => setActiveSpeaker(e.target.value)}
                    className="bg-surface border border-white/10 rounded-full py-2.5 px-6 text-sm text-gray-300 focus:outline-none focus:border-gold/50 appearance-none min-w-[140px]"
                >
                    {uniqueSpeakers.map((speaker, idx) => (
                        <option key={idx} value={speaker}>{speaker === 'All' ? 'All Speakers' : speaker}</option>
                    ))}
                </select>
            )}

            {uniqueTags.length > 1 && (
                <select
                    value={activeTag}
                    onChange={(e) => setActiveTag(e.target.value)}
                    className="bg-surface border border-white/10 rounded-full py-2.5 px-6 text-sm text-gray-300 focus:outline-none focus:border-gold/50 appearance-none min-w-[140px]"
                >
                    {uniqueTags.map((tag, idx) => (
                        <option key={idx} value={tag}>{tag === 'All' ? 'All Tags' : tag}</option>
                    ))}
                </select>
            )}
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12 animate-pulse">
           {/* Featured Skeleton */}
           <div className="bg-surface/30 border border-white/5 rounded-3xl h-[400px] w-full flex flex-col lg:flex-row overflow-hidden">
               <div className="w-full lg:w-1/2 h-full bg-white/5"></div>
               <div className="p-8 lg:p-12 flex flex-col justify-center w-full lg:w-1/2 space-y-4">
                  <div className="w-32 h-6 bg-white/5 rounded-full"></div>
                  <div className="w-3/4 h-12 bg-white/5 rounded"></div>
                  <div className="w-full h-4 bg-white/5 rounded mt-4"></div>
                  <div className="w-full h-4 bg-white/5 rounded"></div>
                  <div className="w-2/3 h-4 bg-white/5 rounded"></div>
                  <div className="w-48 h-12 bg-white/10 rounded-full mt-6"></div>
               </div>
           </div>
           
           {/* Grid Skeleton */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="bg-surface/20 rounded-2xl border border-white/5 h-[340px] flex flex-col overflow-hidden">
                    <div className="w-full aspect-video bg-white/5"></div>
                    <div className="p-6 flex flex-col flex-1 space-y-3">
                       <div className="w-20 h-4 bg-white/5 rounded-full"></div>
                       <div className="w-full h-6 bg-white/5 rounded"></div>
                       <div className="w-3/4 h-6 bg-white/5 rounded"></div>
                       <div className="w-full h-4 bg-white/5 rounded mt-auto"></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      ) : sermons.length === 0 ? (
         <div className="text-center py-24 relative z-10">
            <p className="text-gray-500">No sermons available at the moment.</p>
         </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Featured Sermon */}
          {featured && (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="bg-surface/30 backdrop-blur-md border border-gold/20 rounded-3xl p-1 mb-20 shadow-[0_0_40px_rgba(200,162,74,0.05)] overflow-hidden"
            >
              <div className="bg-primary-base rounded-[22px] overflow-hidden flex flex-col lg:flex-row relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
                  
                  <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto relative group shrink-0">
                    <img src={featured.coverImageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-primary-base/50 to-transparent lg:bg-gradient-to-r" />
                    
                    <Link to={`/sermons/${featured.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(200,162,74,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-10 h-10 text-primary-base ml-2" fill="currentColor" />
                      </div>
                    </Link>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest rounded-full border border-gold/20">
                      Featured Teaching
                    </div>
                    <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4 leading-tight">{featured.title}</h2>
                    <p className="text-gray-300 mb-8 max-w-xl line-clamp-3 leading-relaxed font-light text-lg">{featured.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm">
                       <span className="text-gray-400 flex items-center">
                         <span className="text-gold font-medium mr-2">{featured.speakerTitle || 'Speaker'}</span> {featured.speaker}
                       </span>
                       {featured.scriptureReference && (
                         <span className="text-gray-400 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-gold/70" /> {featured.scriptureReference}
                         </span>
                       )}
                    </div>
                    
                    <div className="flex gap-4">
                        <Link 
                          to={`/sermons/${featured.id}`}
                          className="bg-gold text-primary-base hover:bg-gold-light border border-gold hover:border-white/20 transition-all duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm inline-flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(200,162,74,0.2)] hover:shadow-[0_0_25px_rgba(200,162,74,0.4)] flex-1 sm:flex-none"
                        >
                          <Play className="w-4 h-4" fill="currentColor"/> Watch / Listen
                        </Link>
                    </div>
                  </div>
              </div>
            </motion.div>
          )}

          {gridSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {gridSermons.map((sermon, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    key={sermon.id}
                    className="group flex flex-col"
                  >
                    <Link to={`/sermons/${sermon.id}`} className="block bg-surface/20 rounded-2xl border border-white/5 hover:border-gold/30 hover:bg-surface/40 transition-all overflow-hidden h-full flex flex-col shadow-lg">
                        <div className="relative aspect-video overflow-hidden">
                          <img src={sermon.coverImageUrl} alt={sermon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                             <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(200,162,74,0.5)] transform scale-90 group-hover:scale-100 transition-all duration-300">
                              <Play className="w-6 h-6 text-primary-base ml-1" fill="currentColor" />
                             </div>
                          </div>
                          
                          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-white">
                            {Math.floor(sermon.duration / 60)}:{String(sermon.duration % 60).padStart(2, '0')}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-1">
                          <span className="text-[10px] text-gold/80 px-2 py-0.5 bg-gold/10 rounded-full uppercase tracking-wider font-bold mb-3 self-start">
                            {sermon.category}
                          </span>
                          <h4 className="text-white font-serif text-xl mb-2 line-clamp-2 leading-snug">{sermon.title}</h4>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2 font-light">
                             {sermon.description}
                          </p>
                          <div className="mt-auto flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-white/5">
                            <span className="font-medium text-white/70">{sermon.speaker}</span>
                            <span>{new Date(sermon.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            !featured && (
              <div className="text-center py-12">
                <p className="text-gray-500">No sermons found matching your criteria.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
