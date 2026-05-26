import { useState, useEffect } from 'react';
import { moderationService, Report } from '../services/moderationService';
import { profanityService } from '../services/profanityService';
import { AlertTriangle, CheckCircle, Trash2, Ban, ExternalLink, X, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminModeration() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');
  const [currentAction, setCurrentAction] = useState<'block' | 'asterisk'>('block');
  
  const { userData } = useAuth();

  useEffect(() => {
     const unsubscribeReports = moderationService.subscribeToPendingReports((data) => {
        setReports(data);
        setLoading(false);
     });
     
     // Update custom words periodically or by polling since we don't have a direct hook for it yet
     const interval = setInterval(() => {
        setCustomWords(profanityService.getCustomWords());
        setCurrentAction(profanityService.currentAction);
     }, 1000);

     return () => {
        unsubscribeReports();
        clearInterval(interval);
     };
  }, []);

  const handleAddWord = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!newWord.trim()) return;
     await profanityService.addCustomWord(newWord.trim());
     setNewWord('');
  };

  const handleRemoveWord = async (word: string) => {
     await profanityService.removeCustomWord(word);
  };

  const handleChangeAction = async (action: 'block' | 'asterisk') => {
     await profanityService.setAction(action);
  };

  const handleDismiss = async (reportId: string) => {
     setIsProcessing(reportId);
     await moderationService.reviewReport(reportId, userData?.uid || 'admin', 'dismissed', 'Report dismissed');
     setIsProcessing(null);
  };

  const handleDeleteContent = async (report: Report) => {
     if (!window.confirm(`Are you sure you want to delete this ${report.contentType}?`)) return;
     
     setIsProcessing(report.id);
     // Delete the actual content
     await moderationService.deleteContent(report.contentType, report.contentId);
     // Resolve the report
     await moderationService.reviewReport(report.id, userData?.uid || 'admin', 'resolved', 'Content deleted');
     setIsProcessing(null);
  };

  const handleBanUser = async (report: Report, days: number) => {
     // Note: We don't have the content creator's ID in the report currently (unless we fetch the content).
     // Ideally, the report object should include the offender's ID.
     // For this MVP, we will show an alert if we cannot ban.
     alert("Ban user functionality requires user ID of the content creator. Implementation is pending.");
  };

  if (loading) {
     return <div className="p-8 text-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin mx-auto"></div></div>;
  }

  return (
     <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
           <AlertTriangle className="w-8 h-8 text-gold" />
           <div>
              <h2 className="text-2xl font-bold font-serif text-white">Community Moderation</h2>
              <p className="text-gray-400 text-sm">{reports.length} pending reports</p>
           </div>
        </div>

        {reports.length === 0 ? (
           <div className="bg-surface border border-surface-hover p-12 rounded-2xl text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">All Clear</h3>
              <p className="text-gray-400">There are no pending reports to review.</p>
           </div>
        ) : (
           <div className="grid gap-6">
              {reports.map(report => (
                 <div key={report.id} className="bg-surface border border-surface-hover p-6 rounded-2xl flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2 text-sm">
                          <span className="bg-rose-500/10 text-rose-500 px-2.5 py-1 rounded-sm font-bold uppercase tracking-widest text-[10px]">
                             {report.contentType}
                          </span>
                          <span className="text-gray-500">Reported {formatDistanceToNow(report.createdAt)} ago by {report.reportedByName}</span>
                       </div>
                       
                       <h3 className="text-lg font-bold text-white mb-1">Reason: {report.reason}</h3>
                       {report.description && (
                          <div className="bg-primary-base border border-white/5 p-4 rounded-xl mt-3 mb-4">
                             <p className="text-gray-300 text-sm font-light italic">"{report.description}"</p>
                          </div>
                       )}

                       <Link 
                        to={report.contentType === 'prayerRequest' ? `/community/prayer-requests/${report.contentId}` : `/community/prayer-requests/${report.contentId}`} 
                        className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-white transition-colors mt-2"
                        target="_blank"
                       >
                          <ExternalLink className="w-4 h-4" /> View Content
                       </Link>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 shrink-0">
                       <button 
                         onClick={() => handleDeleteContent(report)}
                         disabled={isProcessing === report.id}
                         className="flex items-center gap-2 justify-center px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-sm font-bold rounded-lg transition-colors border border-rose-500/20"
                       >
                         <Trash2 className="w-4 h-4" /> Delete Content
                       </button>
                       <button 
                         onClick={() => handleBanUser(report, 7)}
                         disabled={isProcessing === report.id}
                         className="flex items-center gap-2 justify-center px-4 py-2.5 bg-surface-hover hover:bg-white/10 text-gray-300 text-sm font-bold rounded-lg transition-colors border border-white/10"
                       >
                         <Ban className="w-4 h-4" /> Ban User (7d)
                       </button>
                       <button 
                         onClick={() => handleDismiss(report.id)}
                         disabled={isProcessing === report.id}
                         className="flex items-center gap-2 justify-center px-4 py-2.5 bg-surface-hover hover:bg-white/10 text-gray-300 text-sm font-bold rounded-lg transition-colors border border-white/10"
                       >
                         <X className="w-4 h-4" /> Dismiss Report
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* Profanity Settings */}
        <div className="bg-surface border border-surface-hover p-8 rounded-2xl mt-12">
           <h3 className="text-xl font-bold font-serif text-white mb-6">Profanity Filter Settings</h3>
           
           <div className="grid md:grid-cols-2 gap-12">
              <div>
                 <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Action on Profanity</h4>
                 <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                       <input 
                         type="radio" 
                         name="action" 
                         value="block" 
                         checked={currentAction === 'block'}
                         onChange={() => handleChangeAction('block')}
                         className="w-4 h-4 text-gold bg-primary-base border-gray-600 focus:ring-gold"
                       />
                       <div>
                          <span className="block text-white text-sm font-medium">Block Submission (Recommended)</span>
                          <span className="text-xs text-gray-500">Shows a gentle error message to the user asking them to rephrase.</span>
                       </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer mt-2">
                       <input 
                         type="radio" 
                         name="action" 
                         value="asterisk" 
                         checked={currentAction === 'asterisk'}
                         onChange={() => handleChangeAction('asterisk')}
                         className="w-4 h-4 text-gold bg-primary-base border-gray-600 focus:ring-gold"
                       />
                       <div>
                          <span className="block text-white text-sm font-medium">Allow & Censor</span>
                          <span className="text-xs text-gray-500">Replaces profane words with asterisks (****) and allows submission.</span>
                       </div>
                    </label>
                 </div>
              </div>

              <div>
                 <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Custom Blocked Words</h4>
                 <form onSubmit={handleAddWord} className="flex gap-2 mb-4">
                    <input 
                      type="text"
                      value={newWord}
                      onChange={e => setNewWord(e.target.value)}
                      placeholder="Add custom word..."
                      className="flex-1 bg-primary-base border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-gold"
                    />
                    <button type="submit" disabled={!newWord.trim()} className="bg-surface-hover hover:bg-white/10 text-white px-3 py-2 rounded-xl transition-colors disabled:opacity-50">
                       <Plus className="w-4 h-4" />
                    </button>
                 </form>

                 <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {customWords.map(word => (
                       <span key={word} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-sm border border-rose-500/20">
                          {word}
                          <button onClick={() => handleRemoveWord(word)} className="hover:text-white transition-colors">
                             <X className="w-3.5 h-3.5" />
                          </button>
                       </span>
                    ))}
                    {customWords.length === 0 && (
                       <span className="text-xs text-gray-500 italic">No custom words added yet.</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
     </div>
  );
}
