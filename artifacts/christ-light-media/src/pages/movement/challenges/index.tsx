
import { Link } from 'wouter';
import { Star, Users, Clock, ArrowRight, Flame, BookOpen, Zap, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { useApi } from '@/hooks/useApi';

interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: number;
  imageUrl: string | null;
  isActive: boolean;
  _count?: { enrollments: number };
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Prayer: Flame,
  Scripture: BookOpen,
  Fasting: Zap,
  Witness: Eye,
};

const CATEGORY_COLORS: Record<string, string> = {
  Prayer: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Scripture: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Fasting: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Witness: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const FALLBACK_CHALLENGES: Challenge[] = [
  {
    id: '1', slug: 'prayer-21', title: '21 Days of Prayer',
    description: 'Join thousands in 21 days of deepening your prayer life through structured daily intercession and worship.',
    duration: 21, category: 'Prayer', difficulty: 3, imageUrl: null, isActive: true,
    _count: { enrollments: 1247 },
  },
  {
    id: '2', slug: 'scripture-40', title: '40 Days of Scripture',
    description: 'Read and meditate on Scripture daily, allowing the Word to transform your mind and renew your heart.',
    duration: 40, category: 'Scripture', difficulty: 2, imageUrl: null, isActive: true,
    _count: { enrollments: 892 },
  },
  {
    id: '3', slug: 'fasting', title: 'Fasting Challenge',
    description: 'A guided journey through biblical fasting — learning to deny the flesh and seek God with greater intensity.',
    duration: 7, category: 'Fasting', difficulty: 4, imageUrl: null, isActive: true,
    _count: { enrollments: 438 },
  },
  {
    id: '4', slug: 'witness', title: 'Witness Challenge',
    description: 'Step out in faith and share the gospel with at least one person each day for 14 days.',
    duration: 14, category: 'Witness', difficulty: 5, imageUrl: null, isActive: true,
    _count: { enrollments: 321 },
  },
];

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < level ? 'text-gold fill-gold' : 'text-gray-700'}
        />
      ))}
    </div>
  );
}

export default function ChallengesPage() {
  const { data, loading } = useApi<{ challenges: Challenge[] }>('/api/movement/challenges');
  const challenges = data?.challenges ?? (loading ? [] : FALLBACK_CHALLENGES);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-gold text-sm tracking-[0.3em] mb-4 uppercase font-bold">DISCIPLINES</p>
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold tracking-tighter mb-5 text-shine leading-tight">
              Spiritual Challenges
            </h1>
            <p className="text-gray-400 max-w-xl text-lg font-inter leading-relaxed">
              Grow deeper in your faith through focused disciplines. Each challenge is designed to stretch you and draw you closer to Christ.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="pb-24">
        <div className="container mx-auto max-w-5xl px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 rounded-3xl bg-card animate-pulse" />
              ))}
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {challenges.map((challenge) => {
                const Icon = CATEGORY_ICONS[challenge.category] ?? Flame;
                const colorClass = CATEGORY_COLORS[challenge.category] ?? 'bg-gold/10 text-gold border-gold/20';
                const enrollCount = challenge._count?.enrollments ?? 0;

                return (
                  <div
                    key={challenge.id}
                    className="bg-card border border-white/5 rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-300 group flex flex-col"
                  >
                    {/* Card top accent */}
                    <div className={`h-1 w-full ${challenge.category === 'Prayer' ? 'bg-gradient-to-r from-orange-500/50 to-transparent' : challenge.category === 'Scripture' ? 'bg-gradient-to-r from-blue-500/50 to-transparent' : challenge.category === 'Fasting' ? 'bg-gradient-to-r from-purple-500/50 to-transparent' : 'bg-gradient-to-r from-green-500/50 to-transparent'}`} />

                    <div className="p-8 flex flex-col flex-1">
                      {/* Category + Duration badges */}
                      <div className="flex items-center gap-2 mb-5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${colorClass}`}>
                          <Icon size={11} />
                          {challenge.category}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10">
                          <Clock size={11} />
                          {challenge.duration} days
                        </span>
                      </div>

                      <h3 className="text-2xl font-cinzel font-bold mb-3 group-hover:text-gold transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                        {challenge.description}
                      </p>

                      {/* Difficulty + Participants */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 uppercase tracking-wider">Difficulty</span>
                          <DifficultyStars level={challenge.difficulty} />
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Users size={12} />
                          {enrollCount.toLocaleString()} enrolled
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        <Link href={`/movement/challenges/${challenge.slug}`} className="flex-1">
                          <Button variant="gold" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/movement/challenges/${challenge.slug}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Enroll <ArrowRight size={13} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-gold tracking-widest uppercase text-xs mb-4 font-bold">THE MOVEMENT</p>
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-5">Not a member yet?</h2>
            <p className="text-gray-400 mb-8 font-inter">
              Join In for Christ to track your challenge progress, connect with others, and share your journey.
            </p>
            <Link href="/movement/join">
              <Button variant="gold" size="lg" className="px-10 rounded-full shadow-xl shadow-gold/20">
                Join the Movement
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
