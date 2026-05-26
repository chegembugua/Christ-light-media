import { Play, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';

export default function PremiumHero() {
  return (
    <div className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
      <div className="divine-light-rays"></div>
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C8A24A]/20 via-[#0A0A0A]/90 to-[#0A0A0A] z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] z-10" />
        {/* Placeholder for video or cinematic image */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2938&auto=format&fit=crop')] bg-cover bg-center" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#C8A24A]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-[#C8A24A]/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center mt-24">
        
        <ScrollReveal animation="fade-up" delay={0}>
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-[#C8A24A]/30 backdrop-blur-md mb-8">
             <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C8A24A] animate-divine-pulse">“You are the light of the world. A city set on a hill cannot be hidden.” — Matthew 5:14</span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal animation="light-reveal" delay={200}>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-8 drop-shadow-2xl leading-[1.1]">
            Let Your Light Shine<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A24A] via-[#E4D09A] to-[#C8A24A] animate-gold-shine">Into Every Digital Space</span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" delay={400}>
          <p className="mt-6 text-lg md:text-2xl text-gray-300 font-light tracking-wide max-w-3xl mx-auto mb-12 leading-relaxed">
            Proclaiming the Gospel, equipping the saints, and fostering a global community of worship, prayer, and discipleship.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-in-scale" delay={700}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/radio" 
              className="group relative px-10 py-5 bg-[#C8A24A] text-black rounded-full font-semibold tracking-[0.15em] uppercase text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-3 accent-glow"
            >
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                <Play className="w-5 h-5 fill-black" /> Begin the Journey
              </span>
            </Link>
            
            <Link 
              to="/community/prayer-requests" 
              className="group px-10 py-5 bg-transparent border border-white/20 rounded-full font-medium tracking-[0.15em] uppercase text-sm text-gray-300 transition-all hover:border-[#C8A24A]/50 hover:bg-white/5 hover:text-white flex items-center gap-3"
            >
              Join the Community <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
