import { Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../../services/portfolioService';

interface PortfolioPreviewProps {
  portfolioGallery: PortfolioItem[];
  loading: boolean;
}

export default function PortfolioPreview({ portfolioGallery, loading }: PortfolioPreviewProps) {
  return (
    <section className="py-24 bg-black/30 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-4xl text-white mb-3 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-gold" /> Visual Ministry
          </h2>
          <p className="text-gray-400 font-light tracking-wide max-w-xl">Capturing moments of worship, events, and cinematic stories.</p>
        </div>
        <Link to="/portfolio" className="hidden sm:flex text-gold hover:text-white uppercase tracking-widest text-sm font-bold items-center transition-colors">
          View Full Gallery <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <div className="w-full overflow-x-auto pb-8 hide-scrollbar px-4 sm:px-6 lg:px-8">
         <div className="flex gap-6 min-w-max">
           {loading ? (
             [1,2,3,4].map(num => (
               <div key={num} className="w-[300px] h-[400px] rounded-xl bg-surface border border-white/5 shrink-0 flex items-center justify-center animate-pulse">
                 <ImageIcon className="w-8 h-8 text-white/10" />
               </div>
             ))
           ) : portfolioGallery.length > 0 ? portfolioGallery.map((item) => (
              <Link to="/portfolio" key={item.id} className="w-[300px] h-[400px] rounded-xl overflow-hidden relative group block shrink-0 border border-white/5 shadow-lg">
                <img src={item.thumbnailUrl || item.mediaUrls[0] || "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80"} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold bg-black/40 px-2 py-1 rounded backdrop-blur-md mb-2 inline-block shadow-sm">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-medium text-white truncate">{item.title}</h4>
                </div>
              </Link>
           )) : (
             <div className="text-gray-500 py-10 w-full text-center">No portfolio items available yet.</div>
           )}
         </div>
      </div>
    </section>
  );
}
