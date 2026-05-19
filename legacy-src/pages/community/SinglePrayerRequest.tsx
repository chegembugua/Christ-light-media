import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, ArrowLeft, CheckCircle2, Flag } from 'lucide-react';
import { prayerService, PrayerRequest } from '../../services/prayerService';
import { useAuth } from '../../contexts/AuthContext';
import PrayerCommentThread from '../../components/community/PrayerCommentThread';
import ReportModal from '../../components/community/ReportModal';
import PrayerVoteButton from '../../components/community/PrayerVoteButton';

export default function SinglePrayerRequest() {
  const { id } = useParams<{ id: string }>();
  const [prayer, setPrayer] = useState<PrayerRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;
    if (id) {
      fetchData().then(() => {
         unsubscribe = prayerService.subscribeToPrayerRequest(id, (updatedPrayer) => {
            setPrayer(updatedPrayer);
         });
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const res = await prayerService.getPrayerRequestById(id!);
    if (res.success && res.data) {
      setPrayer(res.data);
    } else {
      setError('Prayer request not found.');
    }
    setLoading(false);
  };

  const handleMarkAnswered = async () => {
     if (!user || user.uid !== prayer?.userId || prayer?.isAnswered) return;
     
     const res = await prayerService.markAsAnswered(prayer.id);
     if (res.success) {
        setPrayer(prev => prev ? { ...prev, isAnswered: true } : null);
        await prayerService.notifyPrayerAnswered(prayer.id);
     }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-primary-base flex justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !prayer) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-primary-base text-center">
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <Link to="/community/prayer-requests" className="text-gold hover:underline">
          Return to Prayer Wall
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === prayer.userId;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-primary-base">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/community/prayer-requests" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Prayer Wall
        </Link>

        <div className="bg-surface-base border border-surface-hover p-6 md:p-10 rounded-3xl shadow-xl mb-12 relative overflow-hidden">
           {prayer.isAnswered && (
             <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-bl-2xl border-b border-l border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Praise Report
             </div>
           )}

           <div className="flex items-center gap-4 mb-8">
             {prayer.isAnonymous ? (
                 <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface-hover flex items-center justify-center text-xl text-gray-500 font-bold uppercase">
                   A
                 </div>
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gold/20 flex items-center justify-center text-xl text-gold font-bold uppercase overflow-hidden">
                   {prayer.userPhoto ? (
                      <img src={prayer.userPhoto} alt={prayer.userName} className="w-full h-full object-cover" />
                   ) : (
                      prayer.userName.charAt(0)
                   )}
                </div>
              )}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">{prayer.isAnonymous ? 'Anonymous' : prayer.userName}</h2>
                <div className="text-sm text-gray-500 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {format(prayer.createdAt, 'MMMM d, yyyy')}</span>
                  <div className="flex items-center gap-2">
                     {prayer.priority && (
                       <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] uppercase tracking-widest font-bold border ${
                           prayer.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                           prayer.priority === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                           'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                       }`}>
                         {prayer.priority}
                       </span>
                     )}
                     <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-xs uppercase tracking-widest font-bold">
                       {prayer.category}
                     </span>
                     {user && (
                        <button 
                          onClick={() => setIsReportOpen(true)}
                          className="text-gray-500 hover:text-rose-500 transition-colors p-1"
                          title="Report"
                        >
                           <Flag className="w-3.5 h-3.5" />
                        </button>
                     )}
                  </div>
                </div>
              </div>
           </div>

           <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6 leading-tight">{prayer.title}</h1>
           
           <div className="prose prose-invert prose-p:text-gray-300 prose-p:font-light prose-p:leading-relaxed max-w-none text-lg mb-12 bg-primary-base/50 p-6 md:p-8 rounded-2xl border border-white/5 whitespace-pre-wrap">
             {prayer.description}
           </div>

           <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4 w-full sm:w-auto ml-auto">
                 {isOwner && !prayer.isAnswered && (
                    <button 
                      onClick={handleMarkAnswered}
                      className="flex-1 sm:flex-none bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-all px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest"
                    >
                      Mark Answered
                    </button>
                 )}
                 {prayer.isAnswered ? (
                    <button className="flex-1 sm:flex-none px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 cursor-default">Answered</button>
                 ) : (
                    <PrayerVoteButton 
                      prayerRequestId={prayer.id} 
                      prayerCount={prayer.prayerCount} 
                      prayedBy={prayer.prayedBy}
                    />
                 )}
              </div>
           </div>
        </div>

        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          contentType="prayerRequest" 
          contentId={prayer.id} 
        />

        <PrayerCommentThread prayerRequestId={prayer.id} />
      </div>
    </div>
  );
}
