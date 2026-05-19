import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../../services/portfolioService';
import { DevotionItem } from '../../services/devotionService';
import { MusicItem } from '../../services/musicService';
import { usePlayer } from '../../contexts/PlayerContext';

interface FeaturedRowProps {
  portfolio: PortfolioItem | null;
  devotion: DevotionItem | null;
  music: MusicItem | null;
  allMusic: MusicItem[];
  loading: boolean;
}

export default function FeaturedRow({ portfolio, devotion, music, allMusic, loading }: FeaturedRowProps) {
  const { playTrack } = usePlayer();
  if (loading) {
    return (
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 -mt-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
             <div key={i} className="group rounded-2xl overflow-hidden bg-surface border border-white/10 h-[450px] animate-pulse relative shadow-2xl flex flex-col justify-end p-8">
                <div className="w-24 h-6 bg-white/10 rounded-full mb-4"></div>
                <div className="w-full h-8 bg-white/10 rounded mb-2"></div>
                <div className="w-3/4 h-8 bg-white/10 rounded mb-4"></div>
                <div className="w-32 h-4 bg-white/10 rounded mt-4"></div>
             </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 -mt-32 relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Portfolio Card */}
        <Link to="/portfolio" className="group rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-gold/50 transition-all duration-500 h-[450px] relative shadow-2xl flex flex-col justify-end">
          <div className="absolute inset-0">
            {portfolio?.mediaUrls?.[0] ? (
               <img src={portfolio.mediaUrls[0]} alt="Featured Portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
          <div className="relative z-10 p-8">
            <span className="inline-block px-3 py-1 bg-gold/20 text-gold border border-gold/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
              Visual Media
            </span>
            <h3 className="font-serif text-3xl text-white mb-2 line-clamp-2">{portfolio?.title || 'Creative Portfolio'}</h3>
            <div className="flex items-center text-gold text-sm font-medium tracking-wide uppercase group-hover:translate-x-2 transition-transform mt-4">
              View Gallery <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </Link>

        {/* Devotion Card */}
        <Link to={devotion ? `/devotions/${devotion.id}` : '/devotions'} className="group rounded-2xl overflow-hidden bg-surface border border-white/10 hover:border-gold/50 transition-all duration-500 h-[450px] p-8 flex flex-col justify-between relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-black opacity-80" />
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/10 text-white border border-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
              Latest Devotion
            </span>
            <h3 className="font-serif text-3xl text-white mb-4 line-clamp-3 leading-tight">
              {devotion ? devotion.title : '"Let your light shine before others."'}
            </h3>
            <p className="text-gold font-serif italic mb-6">
               {devotion ? devotion.scriptureReference : 'Matthew 5:16'}
            </p>
            <p className="text-gray-400 text-sm line-clamp-4 leading-relaxed font-light mt-4">
              {devotion?.content || 'Discover daily spiritual nourishment and connect deeply with the Word through our guided reflections.'}
            </p>
          </div>
          <div className="relative z-10 flex items-center text-white text-sm font-medium tracking-wide uppercase group-hover:translate-x-2 transition-transform">
            Read Devotion <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </Link>

        {/* Music Track Card */}
        <div className="group rounded-2xl overflow-hidden bg-surface border border-white/10 transition-all duration-500 h-[450px] p-8 flex flex-col items-center justify-center relative shadow-2xl text-center">
           <div className="absolute inset-0 bg-gradient-to-t from-black to-surface opacity-90" />
           {music?.coverImageUrl && (
              <img src={music.coverImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity blur-sm" alt="Music Cover BG" />
           )}
           
           <div className="relative z-10 mb-8 w-48 h-48 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <img src={music?.coverImageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070"} className="w-full h-full object-cover" alt="Track Cover" />
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => {
                  if (music) {
                    playTrack({
                      id: music.id || 'featured-music',
                      title: music.title,
                      artist: music.artist,
                      coverImage: music.coverImageUrl || '',
                      audioUrl: music.audioUrl,
                      type: 'music'
                    });
                  }
                }}
              >
                 <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-primary-base">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                 </div>
              </div>
           </div>
           <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">
                {music?.category || 'Featured Track'}
              </span>
              <p className="font-serif text-2xl text-white line-clamp-1">{music?.title || 'Worship Flow Vol. 1'}</p>
              <p className="text-gray-400 text-sm mt-2">{music?.artist || 'Christ Light Collective'}</p>
           </div>
        </div>

      </div>
    </section>
  );
}
