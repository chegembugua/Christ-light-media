import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Headphones, Radio as RadioIcon, UserPlus } from 'lucide-react';
import { radioSocketService, ConnectionState } from '../services/radioSocketService';
import { usePlayer } from '../contexts/PlayerContext';

export default function Radio() {
  const { playTrack } = usePlayer();
  const [listenerCount, setListenerCount] = useState(0);
  const [peakListeners, setPeakListeners] = useState(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // connect to socket.io initially to get events even if not playing, 
    // or just listen to count updates (the service handles fallback internally)
    let lastCount = 0;
    const unsubscribeCount = radioSocketService.onListenerCountUpdate((count, peak) => {
      // Show toast if count increased and it's not the initial load (lastCount > 0)
      if (count > lastCount && lastCount > 0) {
         setShowToast(true);
         setTimeout(() => setShowToast(false), 3000);
      }
      lastCount = count;
      setListenerCount(count);
      if (peak !== undefined) setPeakListeners(peak);
    });

    const unsubscribeStatus = radioSocketService.onConnectionStatusChange((state) => {
      setConnectionState(state);
    });
    
    // Explicitly connect to receive updates, even if we are not actively joining the stream yet
    radioSocketService.connectWithReconnection();

    return () => {
      unsubscribeCount();
      unsubscribeStatus();
    };
  }, []);

  const handleTogglePlay = () => {
    playTrack({
      id: 'live-radio',
      title: 'Christ Light Live Radio',
      artist: '24/7 Worship & Word',
      audioUrl: 'https://stream.ecn.global/rock', // Placeholder stream URL
      coverImage: 'https://images.unsplash.com/photo-1593697972412-2eb18fdd8d54?q=80&w=800',
      type: 'radio',
      isLive: true
    });
  };

  const formatCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl overflow-hidden border border-white/5 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-30" />
        
        <div className="p-8 md:p-12 relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <RadioIcon className="w-10 h-10 text-gold" />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mb-4">Christ Light Radio</h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-10">
            Tune in to our 24/7 live stream featuring worship music, teachings, and uplifting content for your daily walk of faith.
          </p>

          <div className="flex flex-col items-center gap-6 mb-12">
            <button 
              onClick={handleTogglePlay}
              className="w-20 h-20 rounded-full bg-gold hover:bg-gold-light text-primary-base flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-gold/20 group"
            >
              <Play className="w-8 h-8 ml-2 fill-current group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-sm tracking-widest uppercase font-medium text-gold/80">
              Start Listening
            </span>
          </div>

          {/* Listener Count Display */}
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 border border-white/5 backdrop-blur-sm">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-gray-400" />
                <div className="flex items-center text-white text-lg font-bold font-mono">
                  <span>Live • &nbsp;</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={listenerCount}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {formatCount(listenerCount)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <span className="text-gray-400 text-sm">Listening</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs font-mono text-gray-500 uppercase tracking-widest">
               <span className="flex items-center gap-1.5">
                 <div className={`w-1.5 h-1.5 rounded-full ${
                   connectionState === 'connected' ? 'bg-green-500' : 
                   connectionState === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                 }`}></div>
                 {connectionState === 'connected' ? 'Connected' : 
                   connectionState === 'connecting' ? 'Reconnecting...' : 'Disconnected (Fallback)'}
               </span>
               <span className="flex items-center gap-1.5">
                 Peak Today: {formatCount(peakListeners)}
               </span>
            </div>
          </div>
          
          {/* Toast Notification */}
          <AnimatePresence>
             {showToast && (
                <motion.div 
                   initial={{ opacity: 0, y: 20, scale: 0.9 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: -20, scale: 0.9 }}
                   className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-hover border border-gold/30 px-4 py-2 rounded-full shadow-xl shadow-gold/10 flex items-center gap-2"
                >
                   <UserPlus className="w-4 h-4 text-gold" />
                   <span className="text-sm font-medium text-gray-200">Someone just joined!</span>
                </motion.div>
             )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
