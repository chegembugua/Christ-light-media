
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  { value: '', label: 'Select a category...' },
  { value: 'Prayer', label: 'Prayer' },
  { value: 'Healing', label: 'Healing' },
  { value: 'Family', label: 'Family' },
  { value: 'Ministry', label: 'Ministry' },
  { value: 'Finances', label: 'Finances' },
  { value: 'Personal Growth', label: 'Personal Growth' },
  { value: 'Salvation', label: 'Salvation' },
  { value: 'Other', label: 'Other' },
];

interface FormErrors {
  title?: string;
  category?: string;
  story?: string;
  permission?: string;
}

export default function NewTestimonyPage() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [story, setStory] = useState('');
  const [authorTitle, setAuthorTitle] = useState('');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/movement/testimonies/new');
    }
  }, [user, loading]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2MB'); return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { toast.error('Only JPG, PNG, or WebP allowed'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    else if (title.length > 100) newErrors.title = 'Max 100 characters';
    if (!category) newErrors.category = 'Please select a category';
    if (!story.trim()) newErrors.story = 'Your story is required';
    else if (story.length < 200) newErrors.story = `At least 200 characters (${story.length}/200)`;
    if (!hasPermission) newErrors.permission = 'Please give permission to share your testimony';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      // Upload photo if provided (simplified — in production use Supabase Storage)
      let photoUrl: string | undefined;
      if (photoFile) {
        // For MVP, skip actual upload and use placeholder
        photoUrl = undefined;
      }

      const res = await fetch('/api/movement/testimonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          story: story.trim(),
          authorTitle: authorTitle.trim() || undefined,
          location: location.trim() || undefined,
          isAnonymous,
          photoUrl,
        }),
      });

      if (res.ok) {
        toast.success('Thank you! Your testimony will be reviewed and published soon. 🙏', { duration: 5000 });
        navigate('/movement/testimonies');
      } else {
        const data = await res.json();
        toast.error(data.error ?? 'Failed to submit testimony');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const storyLength = story.length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto max-w-2xl px-6 relative z-10">
        <Link href="/movement/testimonies" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors text-sm mb-10">
          <ArrowLeft size={16} /> Back to Testimonies
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-gold tracking-[0.35em] uppercase text-xs font-bold mb-4">YOUR STORY</p>
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4">Share Your Story</h1>
            <p className="text-gray-400 text-base font-inter">Your testimony is a gift to the body of Christ</p>
          </div>

          {/* Scripture */}
          <div className="bg-card border border-gold/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full blur-2xl" />
            <p className="text-gray-300 italic text-sm leading-relaxed mb-3">
              &ldquo;...and they have conquered him by the blood of the Lamb and by the word of their testimony...&rdquo;
            </p>
            <p className="text-gold/70 text-xs font-bold uppercase tracking-widest">— Revelation 12:11</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Title *"
              placeholder='How God Healed My Marriage'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              maxLength={100}
            />
            <p className="text-xs text-gray-600 -mt-4 text-right">{title.length}/100</p>

            {/* Category */}
            <Select
              label="Category *"
              options={CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={errors.category}
            />

            {/* Photo upload */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Your Photo <span className="text-gray-600 normal-case tracking-normal font-normal">(optional, max 2MB)</span>
              </p>
              <div
                className="border border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-gold/30 transition-colors relative"
                onClick={() => fileRef.current?.click()}
              >
                {photoPreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-gold/30" />
                    <button
                      type="button"
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                      onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); setPhotoFile(null); }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-gray-500">Click to upload photo</p>
                    <p className="text-xs text-gray-700 mt-1">JPG, PNG, WebP — max 2MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
              </div>
            </div>

            {/* Story */}
            <div>
              <Textarea
                label="Your Story *"
                placeholder="Share your story — how God worked in your life, what you experienced, and how it changed you..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                error={errors.story}
                className="min-h-[240px]"
                maxLength={5000}
              />
              <p className={`text-xs mt-1 text-right ${storyLength < 200 ? 'text-gray-600' : storyLength > 4800 ? 'text-orange-400' : 'text-gray-500'}`}>
                {storyLength.toLocaleString()} / 5,000
              </p>
            </div>

            {/* Author title + location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Your Title / Role"
                placeholder="e.g., Teacher, Business Owner, Parent"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
              />
              <Input
                label="Location"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Privacy */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Privacy</p>
              <div className="flex flex-col gap-2">
                {[
                  { value: false, label: 'Public', desc: 'Your name and story are visible to all' },
                  { value: true, label: 'Anonymous', desc: 'Story visible, your name is hidden' },
                ].map((opt) => (
                  <label key={String(opt.value)} className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border transition-all ${isAnonymous === opt.value ? 'border-gold/40 bg-gold/5' : 'border-white/10 bg-card hover:border-white/20'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${isAnonymous === opt.value ? 'border-gold' : 'border-white/30'}`}>
                      {isAnonymous === opt.value && <div className="w-2 h-2 bg-gold rounded-full" />}
                    </div>
                    <input type="radio" className="sr-only" checked={isAnonymous === opt.value} onChange={() => setIsAnonymous(opt.value)} />
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permission */}
            <div>
              <label className={`flex items-start gap-4 cursor-pointer group p-4 rounded-xl border transition-all ${hasPermission ? 'border-gold/40 bg-gold/5' : 'border-white/10 bg-card hover:border-white/20'}`}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${hasPermission ? 'bg-gold border-gold' : 'border-white/30 group-hover:border-gold/50'}`}>
                  {hasPermission && <span className="text-black text-xs font-bold">✓</span>}
                </div>
                <input type="checkbox" className="sr-only" checked={hasPermission} onChange={(e) => { setHasPermission(e.target.checked); setErrors((prev) => ({ ...prev, permission: undefined })); }} />
                <span className="text-sm text-gray-300 leading-relaxed">
                  I give Christ Light Media permission to share my testimony on the platform and in ministry materials.
                </span>
              </label>
              {errors.permission && (
                <p className="text-red-500 text-xs font-bold uppercase tracking-tight mt-2 ml-1">{errors.permission}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full py-4 text-base rounded-xl shadow-xl shadow-gold/20"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit Testimony'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
