
import { useState } from 'react';
;
import { Play, Pause, Radio as RadioIcon, Volume2, Users, Calendar, Clock, Share2 } from 'lucide-react';
import { usePlayer } from '@/context/PlayerContext';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

const LIVE_STREAM = {
  id: 'radio-live',
  title: 'Christ Light Radio (Live)',
  artist: 'Pastor David Chen',
  coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070',
  audioUrl: '/audio/radio-stream.mp3', // Placeholder
  type: 'radio' as const,
  listeners: 1240,
  currentShow: 'Morning Grace & Worship',
  nextShow: 'The Daily Word',
};

const SCHEDULE = [
  { time: '06:00 AM', title: 'Morning Grace & Worship', host: 'Pastor David Chen', duration: '2h' },
  { time: '08:00 AM', title: 'The Daily Word', host: 'Sarah Okafor', duration: '1h' },
  { time: '09:00 AM', title: 'Faith in Action', host: 'James Mwangi', duration: '2h' },
  { time: '11:00 AM', title: 'Midday Praise', host: 'Worship Team', duration: '1h' },
  { time: '12:00 PM', title: 'Kingdom Principles', host: 'Ruth Wambui', duration: '2h' },
  { time: '02:00 PM', title: 'Youth Arise', host: 'Daniel K.', duration: '1.5h' },
];

export default function RadioPage() {
  const { playLive, pause, currentTrack, isPlaying } = usePlayer();
  const [activeDay, setActiveDay] = useState('Today');
  
  const isCurrentlyPlaying = currentTrack?.id === LIVE_STREAM.id && isPlaying;

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      playLive(LIVE_STREAM);
    }
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="LIVE STREAM" 
        title="Radio" 
        description="Tune in to Christ Light Radio. A continuous stream of faith, truth, and worship — live and on demand." 
      />

      {/* ── Live Player Hero ────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <Card variant="featured" className="overflow-hidden p-0 relative border-gold/20 shadow-[0_0_50px_rgba(200,162,74,0.1)]">
              {/* Background Map/Grid */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
                {/* Visualizer & Info */}
                <div className="p-8 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="live-pulse">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <span className="text-red-500 font-bold uppercase tracking-widest text-sm">On Air</span>
                    <span className="text-gray-500 text-sm ml-auto flex items-center gap-1.5">
                      <Users size={14} /> {LIVE_STREAM.listeners.toLocaleString()} listening
                    </span>
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-cinzel font-bold mb-4 leading-tight group-hover:text-gold transition-colors">
                    {LIVE_STREAM.currentShow}
                  </h2>
                  <p className="text-xl text-gray-400 font-inter mb-10 flex items-center gap-3">
                    <RadioIcon className="text-gold" /> {LIVE_STREAM.artist}
                  </p>

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={handlePlay}
                      className="w-20 h-20 bg-gold rounded-full flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(200,162,74,0.4)] text-black"
                    >
                      {isCurrentlyPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
                    </button>
                    
                    <div className="flex-1 hidden sm:flex items-center gap-1 h-8">
                      {/* Fake Visualizer */}
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-full bg-gold/50 ${isCurrentlyPlaying ? 'animate-pulse' : 'h-1'}`}
                          style={{ 
                            height: isCurrentlyPlaying ? `${Math.max(20, Math.random() * 100)}%` : '4px',
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.5s'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Up Next & Cover */}
                <div className="relative">
                  <img 
                    src={LIVE_STREAM.coverImage} 
                    alt="Radio Studio" 
                    fill 
                    className="object-cover opacity-40 grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] to-transparent" />
                  
                  <div className="relative z-10 p-8 lg:p-16 h-full flex flex-col justify-end">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                      <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">Up Next</p>
                      <h3 className="text-xl font-cinzel font-semibold text-white mb-1">{LIVE_STREAM.nextShow}</h3>
                      <p className="text-sm text-gray-400">Starts at 08:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Schedule ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2 font-bold">PROGRAMMING</p>
                <h2 className="text-3xl font-cinzel font-medium">Broadcast Schedule</h2>
              </div>
              <div className="flex bg-card border border-white/5 rounded-xl p-1">
                {['Yesterday', 'Today', 'Tomorrow'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeDay === day 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-white/5 border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-500">
              <div className="col-span-2">Time</div>
              <div className="col-span-5">Program</div>
              <div className="col-span-3">Host</div>
              <div className="col-span-2 text-right">Duration</div>
            </div>

            {/* List */}
            <div className="divide-y divide-white/5">
              {SCHEDULE.map((slot, i) => {
                const isCurrent = activeDay === 'Today' && i === 0; // Mock current slot
                return (
                  <ScrollReveal key={i} delay={i * 50}>
                    <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-white/5 ${
                      isCurrent ? 'bg-gold/5 border-l-2 border-gold' : ''
                    }`}>
                      <div className="col-span-2 text-gold font-mono text-sm font-semibold flex items-center gap-2">
                        {isCurrent && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
                        {slot.time}
                      </div>
                      <div className="col-span-5">
                        <p className={`font-cinzel font-semibold text-lg ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                          {slot.title}
                        </p>
                      </div>
                      <div className="col-span-3 text-sm text-gray-400">
                        {slot.host}
                      </div>
                      <div className="col-span-2 md:text-right text-sm text-gray-500 font-mono flex items-center md:justify-end gap-1.5">
                        <Clock size={14} className="text-gold/50" /> {slot.duration}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Podcast Promo ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="bg-[#111] border border-white/5 rounded-3xl p-10 md:p-16 text-center">
              <RadioIcon size={40} className="text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-cinzel font-medium mb-4">Missed a show?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 font-inter leading-relaxed">
                Most of our radio programs are recorded and available as podcasts. 
                Listen on demand wherever you go.
              </p>
              <button className="bg-white/10 hover:bg-gold hover:text-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all shadow-lg">
                Browse Podcasts
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
