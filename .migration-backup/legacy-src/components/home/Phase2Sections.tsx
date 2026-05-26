import { Link } from 'react-router-dom';
import { Play, Headphones, Radio as RadioIcon, FileText, Video } from 'lucide-react';
import { PodcastItem } from '../../services/podcastService';
import { SermonItem } from '../../services/sermonService';
import { NewsItem } from '../../services/newsService';
import { useEffect, useState } from 'react';
import { radioSocketService, ConnectionState } from '../../services/radioSocketService';
import { format } from 'date-fns';
import SectionHeader from '../ui/SectionHeader';

export function FeaturedRadio() {
  const [listenerCount, setListenerCount] = useState(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');

  useEffect(() => {
    let unsubscribeCount = () => {};
    let unsubscribeStatus = () => {};
    
    // Connect to receive updates on home page as well
    radioSocketService.connectWithReconnection();
    
    unsubscribeCount = radioSocketService.onListenerCountUpdate((count) => {
      setListenerCount(count);
    });
    
    unsubscribeStatus = radioSocketService.onConnectionStatusChange((state) => {
      setConnectionState(state);
    });

    return () => {
      unsubscribeCount();
      unsubscribeStatus();
    };
  }, []);

  const formatCount = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return count.toString();
  };

  const handlePlayRadio = () => {
    const event = new CustomEvent('playTrack', {
      detail: {
        track: {
          id: 'live-radio',
          title: 'Christ Light Live Radio',
          artist: '24/7 Worship & Word',
          audioUrl: 'https://stream.ecn.global/rock',
          coverImageUrl: 'https://images.unsplash.com/photo-1593697972412-2eb18fdd8d54?q=80&w=800',
          isRadio: true
        },
        playlist: []
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-24 bg-black relative overflow-hidden mt-8 rounded-3xl border border-white/5 mx-4 md:mx-12 shadow-[0_30px_60px_-15px_rgba(200,162,74,0.1)]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[100px] opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-6">
              <span className="relative flex h-2 w-2">
                {connectionState === 'connected' ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                )}
              </span>
              <span className="text-xs uppercase tracking-widest text-gold/80 font-medium">Global Broadcast</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Christ Light <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">Live Radio</span></h2>
            <p className="text-gray-400 text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto lg:mx-0">
              Join thousands of listeners worldwide for 24/7 worship, word, and uninterrupted spiritual upliftment.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button 
                onClick={handlePlayRadio}
                className="group flex items-center justify-center w-16 h-16 rounded-full bg-gold hover:bg-gold-light text-primary-base transition-all shadow-[0_0_30px_rgba(200,162,74,0.3)] hover:scale-105"
              >
                <Play className="w-6 h-6 ml-1 fill-current group-hover:scale-110 transition-transform" />
              </button>
              <div className="text-center sm:text-left">
                <div className="text-sm text-gray-400 mb-1">Currently Listening</div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Headphones className="w-5 h-5 text-gold" />
                  <span className="text-3xl font-mono font-bold text-white tracking-tight">{formatCount(listenerCount)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-md hidden md:block">
            <div className="aspect-square rounded-2xl overflow-hidden relative border border-white/10 group shadow-2xl">
              <img src="https://images.unsplash.com/photo-1593697972412-2eb18fdd8d54?q=80&w=800" alt="Radio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-base/90 via-primary-base/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LatestNews({ news }: { news: NewsItem[] }) {
  if (!news || news.length === 0) return null;
  const topNews = news.slice(0, 3);

  return (
    <section className="py-24 bg-surface-base border-t border-surface-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
           title="Christian News"
           subtitle="Stay updated with the body of Christ"
           linkTo="/news"
           linkLabel="View All News"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {topNews.map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="group flex flex-col bg-primary-base rounded-2xl overflow-hidden border border-surface-hover hover:border-gold/30 transition-colors shadow-lg">
              <div className="aspect-[16/9] overflow-hidden">
                <img src={item.imageUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800'} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-gold uppercase tracking-widest font-medium border border-gold/20 px-2 py-0.5 rounded-full">{item.category}</span>
                  <span className="text-xs text-gray-500">{format(item.createdAt, 'MMM d, yyyy')}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 font-light leading-relaxed">{item.content ? item.content.substring(0, 150) + '...' : ''}</p>
                <div className="flex items-center text-sm text-gold font-medium uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Read Article <FileText className="w-4 h-4 ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrendingMedia({ podcasts, sermons }: { podcasts: PodcastItem[], sermons: SermonItem[] }) {
  const topPodcasts = podcasts.slice(0, 2);
  const topSermons = sermons.slice(0, 2);

  if (topPodcasts.length === 0 && topSermons.length === 0) return null;

  return (
    <section className="py-24 bg-primary-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
           title="Nourish Spirit"
           subtitle="Word and Spirit with our latest sermons and podcast episodes."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 mt-12">
          {/* Sermons Column */}
          {topSermons.length > 0 && (
            <div className="bg-surface/20 p-6 md:p-8 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-hover">
                <h3 className="text-2xl font-bold flex items-center gap-3"><Video className="w-6 h-6 text-gold" /> Latest Sermons</h3>
                <Link to="/sermons" className="text-xs text-gold uppercase tracking-widest hover:text-white transition-colors font-medium border border-gold/30 px-3 py-1.5 rounded-full">See All</Link>
              </div>
              <div className="space-y-6">
                {topSermons.map(sermon => (
                  <Link key={sermon.id} to={`/sermons/${sermon.id}`} className="group flex gap-4 md:gap-6 items-center p-3 -m-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden relative border border-white/5 shadow-md">
                      <img src={sermon.coverImageUrl || 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=400'} alt={sermon.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white fill-current shadow-lg drop-shadow" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-widest font-bold mb-1 block">{sermon.category || 'Message'}</span>
                      <h4 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-gold transition-colors mb-2 line-clamp-2 leading-snug">{sermon.title}</h4>
                      <p className="text-sm text-gray-400 mb-1">{sermon.speaker}</p>
                      <div className="text-xs text-gray-500 font-mono">{format(sermon.createdAt, 'MMM d, yyyy')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Podcasts Column */}
          {topPodcasts.length > 0 && (
            <div className="bg-surface/20 p-6 md:p-8 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-hover">
                <h3 className="text-2xl font-bold flex items-center gap-3"><Headphones className="w-6 h-6 text-gold" /> Popular Podcasts</h3>
                <Link to="/podcasts" className="text-xs text-gold uppercase tracking-widest hover:text-white transition-colors font-medium border border-gold/30 px-3 py-1.5 rounded-full">See All</Link>
              </div>
              <div className="space-y-6">
                {topPodcasts.map(podcast => (
                  <Link key={podcast.id} to={`/podcasts/${podcast.id}`} className="group flex gap-4 md:gap-6 items-center p-3 -m-3 hover:bg-white/5 rounded-2xl transition-colors">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden relative border border-white/5 shadow-md">
                      <img src={podcast.coverImageUrl || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400'} alt={podcast.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <Play className="w-8 h-8 text-white fill-current shadow-lg drop-shadow" />
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-widest font-bold mb-1 block">Episode</span>
                      <h4 className="text-lg md:text-xl font-bold text-gray-200 group-hover:text-gold transition-colors mb-2 line-clamp-2 leading-snug">{podcast.title}</h4>
                      <p className="text-sm text-gray-400 mb-1">{podcast.speaker}</p>
                      <div className="text-xs text-gray-500 font-mono">{format(podcast.createdAt, 'MMM d, yyyy')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
