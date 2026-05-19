import { Link } from 'react-router-dom';
import { MessageCircle, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { PrayerRequest } from '../../services/prayerService';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReportModal from './ReportModal';
import PrayerVoteButton from './PrayerVoteButton';

interface PrayerCardProps {
  prayer: PrayerRequest;
  onPrayed?: () => void;
  isLoggedIn: boolean;
}

export default function PrayerCard({ prayer, onPrayed, isLoggedIn }: PrayerCardProps) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Link 
      to={`/community/prayer-requests/${prayer.id}`}
      className="group flex flex-col bg-surface-base rounded-2xl p-6 border border-surface-hover hover:border-gold/30 transition-all shadow-lg hover:shadow-[0_10px_30px_-15px_rgba(200,162,74,0.2)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {prayer.isAnonymous ? (
             <div className="w-10 h-10 rounded-full bg-surface-hover flex items-center justify-center text-gray-500 font-bold uppercase">
               A
             </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold uppercase overflow-hidden">
               {prayer.userPhoto ? (
                  <img src={prayer.userPhoto} alt={prayer.userName} className="w-full h-full object-cover" />
               ) : (
                  prayer.userName.charAt(0)
               )}
            </div>
          )}
          <div>
            <div className="font-medium text-white">{prayer.isAnonymous ? 'Anonymous' : prayer.userName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {format(prayer.createdAt, 'MMM d, yyyy')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {prayer.priority && (
              <div className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-widest border ${
                  prayer.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                  prayer.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {prayer.priority}
              </div>
           )}
           <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gold/10 text-gold border border-gold/20">
             {prayer.category}
           </div>
           {isLoggedIn && (
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsReportOpen(true); }}
                className="text-gray-500 hover:text-rose-500 transition-colors p-1"
                title="Report"
              >
                 <Flag className="w-4 h-4" />
              </button>
           )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-200 mb-3 group-hover:text-gold transition-colors line-clamp-1">{prayer.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 font-light leading-relaxed">{prayer.description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
           <div className="flex items-center gap-1 text-gray-500">
              <MessageCircle className="w-4 h-4" />
              <span>{prayer.commentCount || 0}</span>
           </div>
        </div>

        <div onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
           <PrayerVoteButton 
              prayerRequestId={prayer.id} 
              prayerCount={prayer.prayerCount} 
              prayedBy={prayer.prayedBy}
              onVoteClick={onPrayed}
           />
        </div>
      </div>

      <ReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        contentType="prayerRequest" 
        contentId={prayer.id} 
      />
    </Link>
  );
}
