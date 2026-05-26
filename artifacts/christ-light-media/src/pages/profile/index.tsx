
import React, { useEffect, useState } from 'react';
;
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Settings,
  Heart,
  Trophy,
  Zap,
  Award,
  ChevronRight,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock,
  User,
  Mail,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'prayers' | 'challenges' | 'saved'>('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary">
        <Loader2 className="animate-spin text-gold mb-4" size={40} />
        <p className="text-text-secondary animate-pulse">Entering your sanctuary...</p>
      </div>
    );
  }

  if (!user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-bg-primary pt-28 pb-20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">Faith Journey</p>
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome, <span className="text-gradient">{user.fullName?.split(' ')[0]}</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Profile Info & Navigation */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Main Profile Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-premium text-center"
            >
              <div className="relative w-28 h-28 mx-auto mb-6 group">
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-md group-hover:bg-gold/40 transition-all" />
                <div className="relative w-full h-full rounded-full border-2 border-gold/30 overflow-hidden bg-bg-secondary flex items-center justify-center">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="text-gold" size={40} />
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-2">{user.fullName}</h2>
              <div className="flex items-center justify-center gap-2 text-text-tertiary text-sm mb-6">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>

              {user.bio && (
                <p className="text-text-secondary text-sm italic mb-8 leading-relaxed px-4">
                  &ldquo;{user.bio}&rdquo;
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Link href="/profile/edit" className="w-full">
                  <button className="btn-base btn-gold w-full text-sm py-2.5">Edit Profile</button>
                </Link>
                <Link href="/profile/settings" className="w-full">
                  <button className="btn-base btn-outline w-full text-sm py-2.5">
                    <Settings size={16} />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Navigation Tabs (Desktop) */}
            <div className="hidden lg:block space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: <Zap size={18} /> },
                { id: 'prayers', label: 'My Prayers', icon: <Heart size={18} /> },
                { id: 'challenges', label: 'Challenges', icon: <Award size={18} /> },
                { id: 'saved', label: 'Saved Content', icon: <BookOpen size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gold/10 text-gold border border-gold/20' 
                    : 'text-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {activeTab === tab.id && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-gold rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Tab Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-8"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Prayers Shared', value: '12', icon: <Heart className="text-red-400" /> },
                      { label: 'Days in Christ', value: '48', icon: <Clock className="text-blue-400" /> },
                      { label: 'Milestones', value: '05', icon: <Trophy className="text-gold" /> },
                    ].map((stat, i) => (
                      <motion.div key={i} variants={itemVariants} className="glass rounded-2xl p-6 gold-glow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-text-tertiary text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                          {stat.icon}
                        </div>
                        <p className="text-4xl font-bold font-cinzel">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Active Challenge Spotlight */}
                  <motion.div variants={itemVariants} className="card-premium group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold tracking-tighter uppercase border border-gold/20">
                          <Zap size={10} className="fill-gold" /> Active Pursuit
                        </div>
                        <h3 className="text-xl font-semibold">21 Days of Radical Faith</h3>
                        <p className="text-text-secondary text-sm">Day 14 of 21 — You&apos;re doing incredible.</p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gold">67%</span>
                          <p className="text-[10px] text-text-tertiary">COMPLETION</p>
                        </div>
                        <Link href="/movement/challenges/radical-faith">
                          <button className="btn-base btn-gold py-2 px-6 text-sm">Continue Journey</button>
                        </Link>
                      </div>
                    </div>
                    <div className="mt-6 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: '67%' }} 
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-gold to-gold-light" 
                      />
                    </div>
                  </motion.div>

                  {/* Recent Activity Timeline */}
                  <motion.section variants={itemVariants} className="space-y-6">
                    <h3 className="text-xl font-cinzel font-semibold">Spiritual Footprints</h3>
                    <div className="space-y-4">
                      {[
                        { type: 'prayer', title: 'Shared a Prayer Request', detail: 'Healing for the broken-hearted', time: '2 hours ago' },
                        { type: 'milestone', title: 'Earned Milestone: Seed Sower', detail: 'Completed your 10th devotion', time: 'Yesterday' },
                        { type: 'answered', title: 'Marked Prayer as Answered', detail: 'Financial breakthrough testimony', time: '3 days ago' },
                      ].map((activity, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-gold/50 ring-4 ring-gold/10 group-hover:scale-125 transition-transform" />
                            {i !== 2 && <div className="w-[1px] h-full bg-white/10 mt-2" />}
                          </div>
                          <div className="pb-6">
                            <h4 className="text-sm font-semibold text-white">{activity.title}</h4>
                            <p className="text-xs text-text-secondary mt-1">{activity.detail}</p>
                            <span className="text-[10px] text-text-tertiary mt-2 block uppercase tracking-widest">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                </motion.div>
              )}

              {activeTab === 'prayers' && (
                <motion.div
                  key="prayers"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-cinzel font-semibold">My Prayer Wall</h3>
                    <Link href="/community/prayer/new" className="btn-base btn-gold text-xs py-2">
                      <Plus size={14} /> New Request
                    </Link>
                  </div>
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="card-premium hover:border-gold/30 transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-lg">Strength for the new season</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${i === 1 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                          {i === 1 ? 'ANSWERED' : 'OPEN'}
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        Lord, I pray for clarity and divine wisdom as I step into this new professional role you have provided...
                      </p>
                      <div className="flex items-center gap-4 text-[10px] text-text-tertiary font-bold tracking-widest">
                        <span className="flex items-center gap-1.5"><Heart size={12} className="fill-gold text-gold" /> 42 PRAYING</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} /> AUG 24, 2024</span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Challenges & Saved tabs would follow a similar premium layout */}
              {activeTab === 'challenges' && (
                <motion.div key="challenges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-20 glass rounded-3xl">
                  <Award size={48} className="mx-auto text-gold/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Other Active Challenges</h3>
                  <p className="text-text-secondary text-sm mb-8">Ready to grow further? Explore new spiritual pursuits.</p>
                  <Link href="/movement" className="btn-base btn-gold px-8 py-3">Browse All Challenges</Link>
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div key="saved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="group relative rounded-2xl overflow-hidden glass border-white/5 hover:border-gold/20 transition-all">
                      <div className="aspect-video bg-bg-secondary overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gold/10 to-transparent group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] text-gold font-bold tracking-widest uppercase mb-1 block">Article</span>
                        <h4 className="font-semibold text-white group-hover:text-gold transition-colors">The Theology of Light</h4>
                        <button className="mt-3 text-[10px] text-text-tertiary flex items-center gap-1 hover:text-red-400 transition-colors">
                          REMOVE FROM SAVED
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
