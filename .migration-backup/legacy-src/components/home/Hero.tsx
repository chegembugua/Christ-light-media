import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, PlayCircle, BookOpen, Volume2 } from 'lucide-react';

interface HeroProps {
  featuredSermon?: any;
  featuredDevotion?: any;
  featuredPodcast?: any;
  loading?: boolean;
}

export default function Hero({ featuredSermon, featuredDevotion, featuredPodcast, loading }: HeroProps) {
  const defaultSlide = {
    id: 'default',
    title: 'Christ Light Media',
    description: 'A Light of Christ Through Media, Music & Ministry.',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop',
    type: 'brand',
    link: '/radio'
  };

  const [slides, setSlides] = useState<any[]>([defaultSlide]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      const newSlides = [];
      if (featuredSermon) {
        newSlides.push({
          id: featuredSermon.id,
          title: featuredSermon.title,
          description: featuredSermon.description,
          image: featuredSermon.coverImageUrl || defaultSlide.image,
          type: 'Sermon',
          link: `/sermons/${featuredSermon.id}`,
          icon: <PlayCircle className="w-5 h-5 mr-2" />
        });
      }
      if (featuredPodcast) {
        newSlides.push({
          id: featuredPodcast.id,
          title: featuredPodcast.title,
          description: featuredPodcast.description,
          image: featuredPodcast.coverImageUrl || defaultSlide.image,
          type: 'Podcast',
          link: `/podcasts/${featuredPodcast.id}`,
          icon: <Volume2 className="w-5 h-5 mr-2" />
        });
      }
      if (featuredDevotion) {
        newSlides.push({
          id: featuredDevotion.id,
          title: featuredDevotion.title,
          description: featuredDevotion.description,
          image: featuredDevotion.coverImageUrl || defaultSlide.image,
          type: 'Devotion',
          link: `/devotions/${featuredDevotion.id}`,
          icon: <BookOpen className="w-5 h-5 mr-2" />
        });
      }
      
      if (newSlides.length > 0) {
         // Optionally include the default slide too
         setSlides([defaultSlide, ...newSlides]);
      } else {
         setSlides([defaultSlide]);
      }
    }
  }, [featuredSermon, featuredDevotion, featuredPodcast, loading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <section className="relative h-[90vh] md:h-[95vh] w-full flex items-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
           key={currentSlide.id}
           initial={{ opacity: 0, scale: 1.05 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1.5 }}
           className="absolute inset-0 z-0"
        >
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-primary-base/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-base via-primary-base/80 to-transparent z-10" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] mix-blend-screen opacity-50 z-10 pointer-events-none" />

          <img 
            src={currentSlide.image} 
            alt={currentSlide.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            {currentSlide.type !== 'brand' && (
              <div className="inline-flex items-center text-gold text-xs font-bold uppercase tracking-widest mb-6 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-gold mr-2 animate-pulse"></span>
                Featured {currentSlide.type}
              </div>
            )}
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white leading-tight drop-shadow-2xl">
               {currentSlide.type === 'brand' ? (
                  <>Christ <span className="text-gold italic">Light</span> Media</>
               ) : (
                  currentSlide.title
               )}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide mb-10 line-clamp-3 leading-relaxed drop-shadow-md">
              {currentSlide.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to={currentSlide.link} 
                className="bg-gold text-primary-base hover:bg-white transition-all duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(200,162,74,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                {currentSlide.icon || <Play className="w-5 h-5 ml-1" fill="currentColor"/>}
                {currentSlide.type === 'brand' ? 'Listen Live' : 'Watch Now'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-4 sm:left-6 lg:left-8 flex gap-3 z-30">
           {slides.map((_, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentSlideIndex(idx)}
               className={`w-12 h-1 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'bg-gold' : 'bg-white/30 hover:bg-white/60'}`}
             />
           ))}
        </div>
      </div>
    </section>
  );
}
