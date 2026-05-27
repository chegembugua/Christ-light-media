'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Star, Users, Clock, CheckCircle, ChevronDown, ChevronUp,
  Share2, BookOpen, Flame, Zap, Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { useAuth } from '@/context/AuthContext';

interface DailyPrompt {
  id: string;
  day: number;
  title: string;
  reflection: string;
  scripture: string | null;
  actionStep: string | null;
}

interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: number;
  _count?: { enrollments: number };
}

interface Enrollment {
  daysCompleted: number[];
  isCompleted: boolean;
  enrolledAt: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Prayer: Flame, Scripture: BookOpen, Fasting: Zap, Witness: Eye,
};

// Fallback data for when API isn't seeded yet
const FALLBACK: Record<string, { challenge: Challenge; dailyPrompts: DailyPrompt[] }> = {
  'prayer-21': {
    challenge: {
      id: '1', slug: 'prayer-21', title: '21 Days of Prayer',
      description: 'A transformative 21-day journey into the depths of prayer. Each day builds on the last, taking you from foundational principles to powerful intercession. Join thousands of believers who have experienced breakthrough through this challenge.',
      duration: 21, category: 'Prayer', difficulty: 3,
      _count: { enrollments: 1247 },
    },
    dailyPrompts: Array.from({ length: 21 }, (_, i) => ({
      id: String(i + 1), day: i + 1,
      title: ['Foundation: Starting Strong', 'Adoration: Entering His Presence', 'Confession: Clearing the Way', 'Thanksgiving: A Grateful Heart', 'Supplication: Bringing Your Needs', 'Intercession: Standing for Others', 'Listening: The Art of Silence', 'Persistence: Praying Through', 'Faith: Believing Before Seeing', 'Warfare: Praying with Authority', 'Scripture: Praying the Word', 'Fasting: Intensifying Prayer', 'Corporate: Agreeing Together', 'Breakthrough: Pressing In', 'Rest: Trusting God\'s Timing', 'Renewal: Fresh Fire', 'Alignment: Seeking His Will', 'Boldness: Approaching the Throne', 'Gratitude: Counting Answered Prayers', 'Consecration: Giving It All', 'Completion: A Life of Prayer'][i],
      reflection: `Day ${i + 1} reflection: Deepen your prayer life by focusing on this aspect of communion with God. Take time to be still and know that He is God.`,
      scripture: ['Matthew 6:9-13', 'Psalm 100:4', '1 John 1:9', 'Philippians 4:6', 'James 5:16', 'Ephesians 6:18', 'Psalm 46:10', 'Luke 18:1', 'Mark 11:24', 'Ephesians 6:12', 'Psalm 119:105', 'Isaiah 58:6', 'Matthew 18:19', 'Luke 11:8', 'Psalm 27:14', 'Isaiah 40:31', 'Matthew 6:10', 'Hebrews 4:16', '1 Thessalonians 5:18', 'Romans 12:1', 'Colossians 4:2'][i],
      actionStep: `Spend 20 minutes in focused prayer today. Write down what God speaks to you.`,
    })),
  },
  'scripture-40': {
    challenge: {
      id: '2', slug: 'scripture-40', title: '40 Days of Scripture',
      description: 'Immerse yourself in the Word of God for 40 days. This challenge will take you through key passages of Scripture, helping you build a daily habit of reading, meditating, and applying God\'s Word to your life.',
      duration: 40, category: 'Scripture', difficulty: 2,
      _count: { enrollments: 892 },
    },
    dailyPrompts: Array.from({ length: 40 }, (_, i) => ({
      id: String(i + 1), day: i + 1,
      title: `Day ${i + 1}: ${['In the Beginning', 'The Promise', 'Walking by Faith', 'The Covenant', 'Deliverance', 'The Law of Love', 'Entering the Promised Land', 'Strength in Weakness', 'A Heart After God', 'Wisdom from Above'][i % 10]}`,
      reflection: `Day ${i + 1}: Read today\'s passage slowly and meditatively. Ask the Holy Spirit to illuminate the text and speak to your heart.`,
      scripture: ['Genesis 1:1-3', 'Genesis 12:1-3', 'Hebrews 11:1-6', 'Genesis 15:1-6', 'Exodus 14:13-14', 'Deuteronomy 6:4-9', 'Joshua 1:8-9', 'Judges 6:12-16', '1 Samuel 13:14', 'Proverbs 3:5-7'][i % 10],
      actionStep: 'Read the passage three times. Write one verse that stands out and memorize it today.',
    })),
  },
};

function CircularProgress({ completed, total, size = 100 }: { completed: number; total: number; size?: number }) {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.min(completed / total, 1) : 0;
  const strokeDashoffset = circumference * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(200,162,74,0.15)" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#c8a24a" strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-gold font-bold text-xl leading-none">{pct}%</span>
        <span className="text-gray-500 text-[10px] leading-none mt-1">Day {completed}/{total}</span>
      </div>
    </div>
  );
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < level ? 'text-gold fill-gold' : 'text-gray-700'} />
      ))}
    </div>
  );
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params?.slug as string;

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [dailyPrompts, setDailyPrompts] = useState<DailyPrompt[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [markingDay, setMarkingDay] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/movement/challenges/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setChallenge(data.challenge);
        setDailyPrompts(data.dailyPrompts ?? []);
      } else {
        // Use fallback
        const fb = FALLBACK[slug];
        if (fb) { setChallenge(fb.challenge); setDailyPrompts(fb.dailyPrompts); }
      }
    } catch {
      const fb = FALLBACK[slug];
      if (fb) { setChallenge(fb.challenge); setDailyPrompts(fb.dailyPrompts); }
    }

    if (user) {
      try {
        const res = await fetch(`/api/movement/challenges/${slug}/progress`);
        if (res.ok) {
          const data = await res.json();
          setEnrollment(data.enrollment);
        }
      } catch { /* not enrolled */ }
    }
    setLoading(false);
  }, [slug, user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-expand current day
  useEffect(() => {
    if (enrollment && !expandedDay) {
      const currentDay = enrollment.daysCompleted.length + 1;
      setExpandedDay(Math.min(currentDay, challenge?.duration ?? 1));
    }
  }, [enrollment, challenge, expandedDay]);

  const handleEnroll = async () => {
    if (!user) { router.push('/login?redirect=/movement/challenges/' + slug); return; }
    if (!committed) { toast.error('Please confirm your commitment first.'); return; }
    setEnrolling(true);
    try {
      const res = await fetch(`/api/movement/challenges/${slug}/enroll`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        setEnrollment(data.enrollment);
        toast.success('Enrolled! Your journey begins today. 🙏');
      } else {
        const err = await res.json();
        toast.error(err.error ?? 'Failed to enroll');
      }
    } catch { toast.error('Something went wrong'); }
    setEnrolling(false);
  };

  const handleMarkToday = async () => {
    if (!enrollment) return;
    const today = enrollment.daysCompleted.length + 1;
    if (enrollment.daysCompleted.includes(today)) { toast('Already marked today!'); return; }
    setMarkingDay(true);
    try {
      const res = await fetch(`/api/movement/challenges/${slug}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: today }),
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollment(data.enrollment);
        const milestones = [7, 14, 21, 30, 40];
        if (milestones.includes(today)) {
          toast.success(`🎉 Milestone reached! Day ${today} complete!`, { duration: 5000 });
        } else {
          toast.success(`Day ${today} marked complete! Keep going! 💪`);
        }
      }
    } catch { toast.error('Failed to mark day'); }
    setMarkingDay(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Challenge not found.</p>
        <Link href="/movement/challenges"><Button variant="outline">Back to Challenges</Button></Link>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[challenge.category] ?? Flame;
  const enrollCount = challenge._count?.enrollments ?? 0;
  const completedDays = enrollment?.daysCompleted ?? [];
  const todayDay = completedDays.length + 1;
  const todayAlreadyDone = completedDays.includes(todayDay);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto max-w-3xl px-6 pt-24 pb-20">
        {/* Back */}
        <Link href="/movement/challenges" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-sm mb-10">
          <ArrowLeft size={16} /> All Challenges
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20">
              <Icon size={11} /> {challenge.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
              <Clock size={11} /> {challenge.duration} days
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
              <Users size={11} /> {enrollCount.toLocaleString()} enrolled
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 leading-tight">{challenge.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <DifficultyStars level={challenge.difficulty} />
            <span className="text-xs text-gray-600">Difficulty</span>
          </div>
          <p className="text-gray-300 text-base leading-relaxed">{challenge.description}</p>
        </motion.div>

        <div className="section-divider my-10" />

        {/* Enrollment / Progress */}
        <ScrollReveal>
          {!enrollment ? (
            <Card variant="featured" className="mb-10">
              <h2 className="text-xl font-cinzel font-bold mb-2">Ready to begin?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Commit to this challenge and track your daily progress. You can start today.
              </p>
              <label className="flex items-start gap-3 cursor-pointer mb-6 group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${committed ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-gold/50'}`}>
                  {committed && <CheckCircle size={12} className="text-black" />}
                </div>
                <input type="checkbox" className="sr-only" checked={committed} onChange={(e) => setCommitted(e.target.checked)} />
                <span className="text-sm text-gray-300">I commit to completing this challenge daily and giving it my full effort.</span>
              </label>
              <Button
                variant="gold" size="lg"
                className="w-full py-4 rounded-xl shadow-xl shadow-gold/20"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Enrolling...
                  </span>
                ) : 'Enroll in This Challenge'}
              </Button>
            </Card>
          ) : (
            <Card variant="featured" className="mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <CircularProgress completed={completedDays.length} total={challenge.duration} size={110} />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-cinzel font-bold mb-1">Your Progress</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    {enrollment.isCompleted
                      ? '🎉 Challenge Complete! Well done!'
                      : `Day ${Math.min(todayDay, challenge.duration)} of ${challenge.duration}`}
                  </p>
                  {/* Calendar dots */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {Array.from({ length: challenge.duration }, (_, i) => i + 1).map((day) => (
                      <div
                        key={day}
                        title={`Day ${day}`}
                        className={`w-6 h-6 rounded-md text-[9px] font-bold flex items-center justify-center transition-all ${
                          completedDays.includes(day)
                            ? 'bg-gold text-black'
                            : day === todayDay
                            ? 'bg-gold/20 border border-gold/50 text-gold'
                            : 'bg-white/5 text-gray-600'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  {!enrollment.isCompleted && (
                    <Button
                      variant="gold" size="md"
                      onClick={handleMarkToday}
                      disabled={markingDay || todayAlreadyDone}
                      className="rounded-xl"
                    >
                      {markingDay ? 'Marking...' : todayAlreadyDone ? `Day ${todayDay} Done ✓` : `Mark Day ${todayDay} Complete`}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </ScrollReveal>

        {/* Daily Prompts */}
        <ScrollReveal>
          <h2 className="text-2xl font-cinzel font-bold mb-6">Daily Prompts</h2>
          <div className="space-y-3">
            {dailyPrompts.map((prompt) => {
              const isDone = completedDays.includes(prompt.day);
              const isCurrent = prompt.day === todayDay && !!enrollment;
              const isExpanded = expandedDay === prompt.day;

              return (
                <div
                  key={prompt.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isCurrent
                      ? 'border-gold/40 bg-gold/5'
                      : isDone
                      ? 'border-green-500/20 bg-green-500/3'
                      : 'border-white/5 bg-card'
                  }`}
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setExpandedDay(isExpanded ? null : prompt.day)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isDone ? 'bg-green-500/20 text-green-400' : isCurrent ? 'bg-gold text-black' : 'bg-white/5 text-gray-500'
                    }`}>
                      {isDone ? '✓' : prompt.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isCurrent ? 'text-gold' : isDone ? 'text-gray-400' : 'text-white'}`}>
                        {prompt.title}
                        {isCurrent && <span className="ml-2 text-[10px] bg-gold text-black px-2 py-0.5 rounded-full font-bold uppercase">Today</span>}
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{prompt.reflection}</p>
                      {prompt.scripture && (
                        <div className="flex items-start gap-2 bg-gold/5 border border-gold/10 rounded-xl p-3">
                          <BookOpen size={14} className="text-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gold/70 mb-1">Scripture</p>
                            <p className="text-sm text-gray-300">{prompt.scripture}</p>
                          </div>
                        </div>
                      )}
                      {prompt.actionStep && (
                        <div className="flex items-start gap-2 bg-white/3 border border-white/5 rounded-xl p-3">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-400/70 mb-1">Action Step</p>
                            <p className="text-sm text-gray-300">{prompt.actionStep}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">Share this challenge with a friend</p>
          <Button
            variant="outline" size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
          >
            <Share2 size={14} /> Share Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
