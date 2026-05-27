import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Heart, Activity } from 'lucide-react';
import { prayerService, PrayerRequest } from '../../services/prayerService';
import { PrayerRequestCard } from '../../components/community/PrayerRequestCard';
import { SectionHeader } from '../../components/ui/section-header';
import { EmptyState } from '../../components/ui/empty-state';
import { CategorySelector } from '../../components/ui/category-selector';
import { useAuth } from '../../contexts/AuthContext';
import { radioSocketService } from '../../services/radioSocketService';
import { NotificationItem } from '../../services/notificationService';
import ScrollReveal from '../../components/animations/ScrollReveal';

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Healing', label: 'Healing' },
  { id: 'Guidance', label: 'Guidance' },
  { id: 'Family', label: 'Family' },
  { id: 'Salvation', label: 'Salvation' },
  { id: 'Ministry', label: 'Ministry' },
  { id: 'Financial', label: 'Financial' },
  { id: 'Other', label: 'Other' }
];

export default function PrayerRequests() {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriority, setActivePriority] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'prayed' | 'priority'>('newest');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchRequests();
  }, [activeCategory, activePriority, sortBy]);

  useEffect(() => {
    const unsubscribe = prayerService.subscribeToIntercessions((intercessions) => {
       setRecentActivities(intercessions);
    }, 5);
    
    return () => unsubscribe();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await prayerService.getPrayerRequests(activeCategory, sortBy, activePriority);
    if (res.success && res.data) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  const handlePray = async (id: string) => {
    if (!user) {
      // Prompt login or redirect
      return;
    }
    await prayerService.prayForRequest(id, user.uid, user.displayName || 'Anonymous');
    fetchRequests(); // Refresh logic could be optimized
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-primary-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <SectionHeader 
             title="Prayer Wall"
             subtitle="Join our community in lifting up these requests. Let us stand in faith together."
             align="left"
           />
           
           <Link 
             to="/community/prayer-requests/new"
             className="bg-gold text-primary-base hover:bg-white transition-all duration-300 px-8 py-4 rounded-full font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(200,162,74,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] whitespace-nowrap self-start md:self-auto hover:scale-105 active:scale-95"
           >
             <PlusCircle className="w-5 h-5" /> Share Request
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3">
              {/* Filters */}
              <div className="flex flex-col gap-6 mb-10 bg-surface-base p-6 rounded-[2rem] border border-white/5 shadow-lg">
                <CategorySelector 
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  onSelect={setActiveCategory}
                />

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-start sm:items-center pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                       <span className="text-xs font-mono uppercase tracking-[0.15em] text-gray-500">Priority</span>
                       <select 
                         value={activePriority}
                         onChange={(e) => setActivePriority(e.target.value)}
                         className="bg-transparent border border-white/10 rounded-full py-2 px-4 text-xs font-medium tracking-wide text-gray-300 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold appearance-none hover:border-white/20 transition-colors"
                       >
                         <option value="All">All Priorities</option>
                         <option value="high">High Priority</option>
                         <option value="medium">Medium Priority</option>
                         <option value="low">Low Priority</option>
                       </select>
                    </div>

                    <div className="flex items-center gap-3">
                       <span className="text-xs font-mono uppercase tracking-[0.15em] text-gray-500">Sort</span>
                       <select 
                         value={sortBy}
                         onChange={(e) => setSortBy(e.target.value as any)}
                         className="bg-transparent border border-white/10 rounded-full py-2 px-4 text-xs font-medium tracking-wide text-gray-300 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold appearance-none w-full sm:w-auto hover:border-white/20 transition-colors"
                       >
                         <option value="newest">Newest First</option>
                         <option value="prayed">Most Prayed For</option>
                         <option value="priority">Highest Priority</option>
                       </select>
                    </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 2].map(i => (
                    <div key={i} className="bg-surface-base/50 rounded-[2rem] h-[280px] p-6 border border-white/5 flex flex-col animate-pulse hidden"> {/* Hidden because we want a better loader if possible, but keep for now */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/5"></div>
                        <div className="space-y-2">
                          <div className="w-24 h-4 bg-white/5 rounded"></div>
                          <div className="w-16 h-3 bg-white/5 rounded"></div>
                        </div>
                      </div>
                      <div className="w-3/4 h-6 bg-white/5 rounded mb-4"></div>
                      <div className="w-full h-4 bg-white/5 rounded mb-2"></div>
                      <div className="w-5/6 h-4 bg-white/5 rounded"></div>
                      <div className="mt-auto flex justify-between">
                         <div className="w-20 h-4 bg-white/5 rounded"></div>
                         <div className="w-24 h-8 bg-white/5 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                  <div className="col-span-full py-12 flex justify-center">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <EmptyState 
                  title="No Prayer Requests Found"
                  description="There are currently no prayer requests in this category. Be the first to share your need with the community."
                  actionLabel="Share Request"
                  actionLink="/community/prayer-requests/new"
                />
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {requests.map((prayer, idx) => {
                    const hasPrayed = user ? prayer.prayedBy?.includes(user.uid) : false;
                    return (
                      <ScrollReveal 
                        key={prayer.id} 
                        animation="fade-up" 
                        delay={idx * 100}
                      >
                        <PrayerRequestCard 
                          id={prayer.id!}
                          title={prayer.title}
                          content={prayer.description}
                          authorName={prayer.userName}
                          category={prayer.category}
                          createdAt={new Date(prayer.createdAt)}
                          prayerCount={prayer.prayerCount}
                          commentCount={prayer.commentCount || 0}
                          hasPrayed={hasPrayed}
                          onPray={handlePray}
                          onClick={(id: string) => navigate(`/community/prayer-requests/${id}`)}
                        />
                      </ScrollReveal>
                    );
                  })}
                </div>
              )}
           </div>
           
           <div className="lg:col-span-1">
              <div className="bg-surface-base border border-white/5 p-6 rounded-[2rem] sticky top-24 shadow-xl">
                 <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gold rounded-full animate-ping opacity-20" />
                      <Activity className="w-5 h-5 text-gold relative z-10" />
                    </div>
                    <h3 className="font-mono text-sm uppercase tracking-widest text-white">Live Activity</h3>
                 </div>
                 
                 <div className="space-y-4">
                    <AnimatePresence>
                       {recentActivities.length === 0 ? (
                          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-gray-500 font-light text-center py-8">
                             Waiting for prayer activity...
                          </motion.div>
                       ) : (
                         recentActivities.map((activity) => (
                           <motion.div 
                             key={activity.id}
                             initial={{ opacity: 0, x: -20, height: 0 }}
                             animate={{ opacity: 1, x: 0, height: 'auto' }}
                             exit={{ opacity: 0, x: 20, height: 0 }}
                             className="text-sm p-4 rounded-xl relative group overflow-hidden border border-white/5 bg-white/[0.02]"
                           >
                              <div className="absolute top-0 left-0 w-1 h-full bg-gold opacity-50" />
                              <div className="flex justify-between items-start">
                                <p className="text-gray-300 font-light pr-4 leading-relaxed">
                                   <strong className="text-white font-medium">{activity.userName}</strong> just prayed for someone.
                                </p>
                                <Heart className="w-4 h-4 text-gold shrink-0 opacity-50" />
                              </div>
                           </motion.div>
                         ))
                       )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
