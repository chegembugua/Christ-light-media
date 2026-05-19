import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { prayerService } from '../../services/prayerService';
import { useAuth } from '../../contexts/AuthContext';
import { Send, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Healing', 'Guidance', 'Family', 'Salvation', 'Ministry', 'Financial', 'Other'];

export default function NewPrayerRequest() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prayer request.');
      return;
    }

    if (!title || !description) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await prayerService.createPrayerRequest({
      userId: user.uid,
      userName: user.displayName || 'Anonymous Believer',
      userPhoto: user.photoURL || undefined,
      title,
      description,
      category,
      priority,
      isAnonymous
    });

    setLoading(false);
    if (res.success) {
      navigate('/community/prayer-requests');
    } else {
      setError(res.error || 'Failed to submit prayer request');
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen bg-primary-base flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please log in to share a request</h2>
          <button onClick={() => navigate('/community/prayer-requests')} className="text-gold hover:underline">
            Go back to Prayer Wall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-primary-base">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-surface-base border border-surface-hover p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-3xl lg:text-4xl font-serif font-bold mb-3">Share Your <span className="text-gold italic">Request</span></h1>
            <p className="text-gray-400 mb-8 font-light">"For where two or three gather in my name, there am I with them." - Matthew 18:20</p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Request Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prayer for my mother's healing"
                  className="w-full bg-primary-base border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Category *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        category === cat 
                          ? 'bg-gold/20 text-gold border border-gold/50' 
                          : 'bg-primary-base border border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Priority *</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize ${
                        priority === p
                          ? 'bg-gold/20 text-gold border border-gold/50' 
                          : 'bg-primary-base border border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wide">Details *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share the details so the community can pray specifically for you..."
                  rows={6}
                  className="w-full bg-primary-base border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors resize-y"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-3 bg-primary-base p-4 rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="anonymous" 
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 accent-gold bg-primary-base border-white/20 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-300">
                  <span className="font-medium text-white block">Post Anonymously</span>
                  Your name and photo will not be visible to the public.
                </label>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-4">
                 <button 
                   type="button"
                   onClick={() => navigate('/community/prayer-requests')}
                   className="text-gray-400 hover:text-white text-sm font-bold uppercase tracking-widest px-4 py-2"
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   disabled={loading}
                   className="bg-gold text-primary-base hover:bg-white transition-all duration-300 px-8 py-3 rounded-full font-bold tracking-widest uppercase text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(200,162,74,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                   {loading ? 'Submitting...' : 'Post Request'}
                 </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
