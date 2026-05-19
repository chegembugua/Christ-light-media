import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { podcastService, PodcastItem } from '../services/podcastService';
import { Play, Pause, ArrowLeft, Mic, Share2, SkipBack, SkipForward } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import LikeButton from '../components/engagement/LikeButton';
import CommentSection from '../components/engagement/CommentSection';

export default function SinglePodcast() {
  const { id } = useParams<{ id: string }>();
  const { playTrack } = usePlayer();
  const [podcast, setPodcast] = useState<PodcastItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Minimal built-in audio state just for visuals if we don't want to rely entirely on global player,
  // But per instructions, we can use existing music player system. 
  // "Playback using existing or extended music player system"
  // Let's integrate with existing `playTrack` global player for actual playback, 
  // but also provide local visual UI or completely hand off to global.
  
  useEffect(() => {
    const fetchPodcast = async () => {
      setLoading(true);
      if (id) {
        const res = await podcastService.getItemById(id);
        if (res.success && res.data) {
          setPodcast(res.data);
          document.title = `${res.data.title} | Christ Light Podcasts`;
          // Increment play count logic can be added here or played
        }
      }
      setLoading(false);
    };
    fetchPodcast();
  }, [id]);

  const handlePlayPodcast = () => {
    if (!podcast) return;
    
    playTrack({
      id: podcast.id || 'podcast-1',
      title: podcast.title,
      artist: podcast.speaker,
      coverImage: podcast.coverImageUrl,
      audioUrl: podcast.audioUrl,
      type: 'podcast'
    });
    setIsPlaying(true);
  };

  if (loading) {
     return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  if (!podcast) {
      return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Podcast episode not found.</p>
          <Link to="/podcasts" className="text-gold hover:underline">Back to Podcasts</Link>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[200px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/podcasts" className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8 text-sm uppercase tracking-wider font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Episodes
        </Link>

        <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row gap-12">
           {/* Cover Image */}
           <div className="shrink-0 w-full md:w-80 flex flex-col items-center">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)] mb-8">
                 <img src={podcast.coverImageUrl} alt={podcast.title} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={handlePlayPodcast}
                className="w-full bg-gold hover:bg-white text-primary-base transition-all duration-300 py-4 rounded-full font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(200,162,74,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                  <Play className="w-5 h-5" fill="currentColor" /> Play Episode
              </button>
           </div>
           
           {/* Info */}
           <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                 <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold tracking-widest uppercase border border-gold/20">
                    {podcast.category}
                 </span>
                 <span className="text-gray-500 text-sm flex items-center">
                    <Mic className="w-4 h-4 mr-2" /> Host: {podcast.speaker}
                 </span>
                 <span className="text-gray-600 text-sm border-l border-gray-700 pl-4">
                    {new Date(podcast.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-6 leading-tight">
                 {podcast.title}
              </h1>
              
              <div className="w-16 h-1 bg-gold/30 mb-8 rounded-full"></div>
              
              <div className="prose prose-invert prose-gold max-w-none">
                 <p className="text-gray-300 leading-relaxed text-lg font-light mb-6">
                    {podcast.description}
                 </p>
              </div>

              <div className="mt-auto pt-10 border-t border-white/10 flex items-center justify-between">
                 <div className="flex gap-4 items-center">
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors bg-surface" title="Share">
                       <Share2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center ml-2 border-l border-white/10 pl-6 h-8">
                       <LikeButton contentType="podcast" contentId={podcast.id!} contentTitle={podcast.title} contentOwnerId={podcast.createdBy} />
                    </div>
                 </div>
              </div>
              
              <CommentSection contentType="podcast" contentId={podcast.id!} contentTitle={podcast.title} contentOwnerId={podcast.createdBy} />
           </div>
        </div>
      </div>
    </div>
  );
}
