
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { CheckCircle, BookOpen, Users, Flame, Share2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from '@/hooks/useApi';

const CHALLENGES = [
  { id: 'prayer-21', label: '21 Days of Prayer' },
  { id: 'scripture-40', label: '40 Days of Scripture' },
  { id: 'fasting', label: 'Fasting Challenge' },
  { id: 'witness', label: 'Witness Challenge' },
];

const HEARD_OPTIONS = [
  { value: '', label: 'Select an option...' },
  { value: 'radio', label: 'Radio' },
  { value: 'social', label: 'Social Media' },
  { value: 'friend', label: 'Friend' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'church', label: 'Church' },
  { value: 'other', label: 'Other' },
];

const COMMITMENTS = [
  { icon: Flame, text: 'Daily prayer and Scripture' },
  { icon: Users, text: 'Community engagement' },
  { icon: BookOpen, text: 'Spiritual growth through challenges' },
  { icon: Share2, text: 'Share your faith authentically' },
];

export default function JoinMovementPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  const [committed, setCommitted] = useState(false);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [heardFrom, setHeardFrom] = useState('');
  const [errors, setErrors] = useState<{ committed?: string }>({});

  const { execute: joinMovement, loading: joining } = useMutation<{ member: unknown }>(
    '/api/movement/join',
    { method: 'POST' }
  );

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/movement/join');
    }
  }, [user, loading]);

  const toggleChallenge = (id: string) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!committed) newErrors.committed = 'Please confirm your commitment to continue.';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    const ok = await joinMovement({
      enrollInChallenges: selectedChallenges,
      heardFrom: heardFrom || undefined,
    });

    if (ok) {
      toast.success('Welcome to In for Christ! 🙏', { duration: 4000 });
      navigate('/movement');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto max-w-2xl px-6 relative z-10">
        {/* Back link */}
        <Link href="/movement" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-sm mb-10">
          <ArrowLeft size={16} /> Back to Movement
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.35em] uppercase text-xs font-bold mb-4">THE COMMITMENT</p>
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4">Join In for Christ</h1>
            <p className="text-gray-400 text-base font-inter leading-relaxed">
              Commit to a life fully devoted to Jesus
            </p>
          </div>

          {/* Scripture */}
          <div className="bg-card border border-gold/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full blur-2xl" />
            <p className="text-gray-300 italic text-sm leading-relaxed mb-3">
              &ldquo;Therefore, I urge you, brothers and sisters, in view of God&apos;s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God — this is your true and proper worship.&rdquo;
            </p>
            <p className="text-gold/70 text-xs font-bold uppercase tracking-widest">— Romans 12:1</p>
          </div>

          {/* Commitments */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">What you&apos;re committing to</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMITMENTS.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-card border border-white/5 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <c.icon size={14} className="text-gold" />
                  </div>
                  <span className="text-sm text-gray-300">{c.text}</span>
                  <CheckCircle size={14} className="text-gold ml-auto flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Commitment checkbox */}
            <div>
              <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-xl border transition-all ${committed ? 'border-gold/40 bg-gold/5' : 'border-white/10 bg-card hover:border-white/20'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${committed ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-gold/50'}`}>
                  {committed && <CheckCircle size={12} className="text-black" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={committed}
                  onChange={(e) => { setCommitted(e.target.checked); setErrors({}); }}
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I commit to living out the values of the In for Christ movement — daily prayer, Scripture, community, and authentic witness.
                </span>
              </label>
              {errors.committed && (
                <p className="text-red-500 text-xs font-bold uppercase tracking-tight mt-2 ml-1">{errors.committed}</p>
              )}
            </div>

            {/* Challenge selection */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Challenges to enroll in <span className="text-gray-600 normal-case tracking-normal font-normal">(optional)</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHALLENGES.map((c) => {
                  const selected = selectedChallenges.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border transition-all ${selected ? 'border-gold/40 bg-gold/5' : 'border-white/10 bg-card hover:border-white/20'}`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'bg-gold border-gold' : 'border-white/30'}`}>
                        {selected && <div className="w-2 h-2 bg-black rounded-sm" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={() => toggleChallenge(c.id)}
                      />
                      <span className="text-sm text-gray-300">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* How you heard */}
            <Select
              label="How did you hear about us?"
              options={HEARD_OPTIONS}
              value={heardFrom}
              onChange={(e) => setHeardFrom(e.target.value)}
            />

            {/* Submit */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full py-4 text-base rounded-xl shadow-xl shadow-gold/20"
                disabled={joining}
              >
                {joining ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Committing...
                  </span>
                ) : (
                  'Commit & Join'
                )}
              </Button>
              <Link href="/movement" className="block text-center text-gray-500 hover:text-gold transition-colors text-sm py-2">
                Learn More First
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
