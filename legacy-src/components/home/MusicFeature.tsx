import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { MusicItem } from '../../services/musicService';
import { usePlayer } from '../../contexts/PlayerContext';

interface MusicFeatureProps {
  music: MusicItem | null;
  allMusic: MusicItem[];
  loading: boolean;
}

export default function MusicFeature({ music, allMusic, loading }: MusicFeatureProps) {
  const { playTrack } = usePlayer();
  if (loading) {
    return (
      <section className="py-24 bg-black/40 border-t border-white/5 animate-pulse">
        <div className="max-w-7xl mx-auto px-4"><div className="h-[400px] bg-white/5 rounded-3xl" /></div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-black/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Context/Text */}
          <div>
            <span className="inline-block px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-gold/20">
              Featured Audio
            </span>
            <h2 className="font-serif text-5xl text-white mb-6 leading-tight">Sounds of Heaven, <br/><span className="text-gold italic">Right Here.</span></h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-light">
              Stream worship moments inspired by the Holy Spirit. Allow the sound of pure devotion to wash over your space.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
                  if (music) {
                    playTrack({
                      id: music.id || 'hero-music',
                      title: music.title,
                      artist: music.artist,
                      coverImage: music.coverImageUrl || '',
                      audioUrl: music.audioUrl,
                      type: 'music'
                    });
                  }
                }}
                className="bg-gold text-primary-base hover:bg-white transition-colors duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(200,162,74,0.3)]"
              >
                <Play className="w-5 h-5" fill="currentColor" /> Play Now
              </button>
              <Link to="/music" className="border border-white/20 hover:border-white text-white transition-colors duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3">
                Browse Library
              </Link>
            </div>
          </div>

          {/* Featured Spotify-Style Player Visual */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-full max-w-sm bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10">
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-xl relative group">
                 <img src={music?.coverImageUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Album Cover" />
                 <div 
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                    onClick={() => {
                      if (music) {
                        playTrack({
                          id: music.id || 'hero-music',
                          title: music.title,
                          artist: music.artist,
                          coverImage: music.coverImageUrl || '',
                          audioUrl: music.audioUrl,
                          type: 'music'
                        });
                      }
                    }}
                  >
                     <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-primary-base shadow-[0_0_20px_rgba(200,162,74,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                     </div>
                  </div>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-xl text-white mb-1 truncate">{music?.title || 'Worship Flow Vol. 1'}</h3>
                <p className="text-gold/80 text-sm truncate uppercase tracking-widest">{music?.artist || 'Christ Light Collective'}</p>
              </div>
              {/* Fake progress bar purely for visuals in the hero card */}
              <div className="mt-8">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gold rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
                  <span>1:24</span>
                  <span>4:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
