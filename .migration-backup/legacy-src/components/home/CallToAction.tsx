import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="py-24 border-t border-white/5 relative bg-primary-base overflow-hidden">
       <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
       <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl text-white mb-6">Join the Movement</h2>
          <p className="text-gray-400 font-light max-w-2xl mx-auto mb-12 text-lg">Partner with us as we continue to shine the light of Christ across the globe through powerful media, uplifting worship, and the uncompromised Word.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/about" className="bg-white text-primary-base hover:bg-gold transition-colors duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm">
              About Us
            </Link>
            <Link to="/portfolio" className="border border-white/20 hover:border-white text-white transition-colors duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm">
              Explore Content
            </Link>
            <a href="mailto:contact@christlightmedia.com" className="text-gold hover:text-white transition-colors duration-300 px-8 py-4 font-bold tracking-widest uppercase text-sm flex items-center justify-center">
              Contact Us <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
       </div>
    </section>
  );
}
