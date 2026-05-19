import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sermonService, SermonItem } from '../services/sermonService';
import { usePlayer } from '../contexts/PlayerContext';
import { Play, ArrowLeft, BookOpen, Share2, Video, Headphones } from 'lucide-react';
import LikeButton from '../components/engagement/LikeButton';
import CommentSection from '../components/engagement/CommentSection';

export default function SingleSermon() {
  const { id } = useParams<{ id: string }>();
  const { playTrack } = usePlayer();
  const [sermon, setSermon] = useState<SermonItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSermon = async () => {
      setLoading(true);
      if (id) {
        const res = await sermonService.getItemById(id);
        if (res.success && res.data) {
          setSermon(res.data);
          document.title = `${res.data.title} | Christ Light Sermons`;
        }
      }
      setLoading(false);
    };
    fetchSermon();
  }, [id]);

  const handlePlayAudio = () => {
    if (!sermon) return;
    
    playTrack({
      id: sermon.id || 'sermon-1',
      title: sermon.title,
      artist: sermon.speaker,
      coverImage: sermon.coverImageUrl,
      audioUrl: sermon.audioUrl,
      type: 'sermon'
    });
  };

  if (loading) {
     return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
       </div>
     );
  }

  if (!sermon) {
      return (
       <div className="min-h-screen pt-32 pb-32 bg-primary-base flex items-center justify-center flex-col gap-4">
          <p className="text-gray-400">Sermon not found.</p>
          <Link to="/sermons" className="text-gold hover:underline">Back to Sermons</Link>
       </div>
     );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[200px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link to="/sermons" className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8 text-sm uppercase tracking-wider font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Sermons
        </Link>

        {sermon.videoUrl ? (
          <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden mb-12 shadow-2xl relative">
            <video 
               controls 
               className="w-full h-full object-contain"
               poster={sermon.coverImageUrl}
            >
               <source src={sermon.videoUrl} type="video/mp4" />
               Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl relative group flex items-center justify-center">
              <img src={sermon.coverImageUrl} alt={sermon.title} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 flex flex-col items-center">
                 <button 
                   onClick={handlePlayAudio}
                   className="w-20 h-20 bg-gold rounded-full flex items-center justify-center text-primary-base hover:scale-110 transition-transform shadow-[0_0_30px_rgba(200,162,74,0.5)] mb-4"
                 >
                    <Headphones className="w-10 h-10 ml-1" />
                 </button>
                 <span className="text-white font-medium tracking-widest uppercase text-sm">Play Audio Sermon</span>
              </div>
          </div>
        )}

        <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 md:p-12 shadow-xl">
           <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                 <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-xs font-bold tracking-widest uppercase border border-gold/20">
                    {sermon.category}
                 </span>
                 {sermon.scriptureReference && (
                   <span className="text-gray-300 text-sm flex items-center border-l border-white/10 pl-4">
                      <BookOpen className="w-4 h-4 mr-2 text-gold" /> {sermon.scriptureReference}
                   </span>
                 )}
                 <span className="text-gray-500 text-sm border-l border-white/10 pl-4">
                    {new Date(sermon.createdAt).toLocaleDateString()}
                 </span>
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                 {sermon.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                   <span className="text-gold font-serif text-xl">{sermon.speaker.charAt(0)}</span>
                 </div>
                 <div>
                    <h3 className="text-white font-medium text-lg">{sermon.speaker}</h3>
                    <p className="text-gray-500 text-sm">{sermon.speakerTitle || 'Speaker'}</p>
                 </div>
              </div>

              {sermon.videoUrl && (
                 <button 
                  onClick={handlePlayAudio}
                  className="mb-8 self-start bg-surface border border-white/10 hover:border-gold hover:text-gold text-white transition-all duration-300 px-6 py-3 rounded-full font-bold tracking-widest uppercase text-xs flex items-center gap-2"
                >
                  <Headphones className="w-4 h-4" /> Listen to Audio Version
                </button>
              )}
              
              <div className="w-full h-px bg-white/10 mb-8"></div>
              
              <div className="prose prose-invert prose-gold max-w-none">
                 <h2 className="text-xl font-serif text-white mb-4">About this message</h2>
                 <p className="text-gray-400 leading-relaxed text-lg font-light mb-8 whitespace-pre-wrap">
                    {sermon.description}
                 </p>
                 
                 {sermon.tags && sermon.tags.length > 0 && (
                   <div className="flex flex-wrap gap-2 mt-8">
                     {sermon.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 bg-white/5 text-gray-400 rounded-md text-xs tracking-wider uppercase">
                         #{tag}
                       </span>
                     ))}
                   </div>
                 )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                 <div className="flex gap-4 items-center">
                    <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors bg-surface" title="Share Sermon">
                       <Share2 className="w-5 h-5" />
                    </button>
                    <div className="flex items-center ml-2 border-l border-white/10 pl-6 h-8">
                       <LikeButton contentType="sermon" contentId={sermon.id!} contentTitle={sermon.title} contentOwnerId={sermon.createdBy} />
                    </div>
                 </div>
              </div>
              
              <CommentSection contentType="sermon" contentId={sermon.id!} contentTitle={sermon.title} contentOwnerId={sermon.createdBy} />
           </div>
        </div>
      </div>
    </div>
  );
}
