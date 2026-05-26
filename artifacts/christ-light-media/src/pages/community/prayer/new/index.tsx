
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { authFetch } from '@/lib/api/authFetch';

const DURATION_OPTIONS = [
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'This week', label: 'This week' },
  { value: 'This month', label: 'This month' },
  { value: 'One-time', label: 'One-time' },
];

const CATEGORY_OPTIONS = [
  { value: 'Health', label: 'Health' },
  { value: 'Family', label: 'Family' },
  { value: 'Ministry', label: 'Ministry' },
  { value: 'Finances', label: 'Finances' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Nation', label: 'Nation' },
  { value: 'Other', label: 'Other' },
];

function truncateRight(str: string, max: number) {
  return str.length > max ? str.slice(0, max) : str;
}

export default function NewPrayerPage() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [yourName, setYourName] = useState('');
  const [duration, setDuration] = useState('Ongoing');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('/api/users/profile', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.fullName) {
          setUserName(data.user.fullName);
          setYourName(data.user.fullName);
        }
      })
      .catch(() => {});
  }, []);

  const validate = useCallback(() => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Title is required';
    else if (title.trim().length > 100) next.title = 'Title must be 100 characters or less';
    if (!content.trim()) next.description = 'Description is required';
    else if (content.trim().length < 10) next.description = 'Description must be at least 10 characters';
    else if (content.trim().length > 2000) next.description = 'Description must be 2,000 characters or less';
    if (!category) next.category = 'Category is required';
    if (!duration) next.duration = 'Duration is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [title, content, category, duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Check auth before submitting
    const { error } = await authFetch('/api/auth/profile').then((r) => r.json());
    if (error) {
      toast.error('Please sign in to submit a prayer request.');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/api/community/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category,
          isAnonymous,
          duration,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to submit');
      toast.success('Prayer request shared. Thank you for trusting us.');
      navigate('/community/prayer');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormBlank = !title.trim() && !content.trim();

  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-2xl px-6">
        <header className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-gold">Community</p>
          <h1 className="font-cinzel text-3xl font-bold tracking-tighter md:text-4xl text-white">
            Share Your Prayer Request
          </h1>
          <p className="mt-2 text-gray-400">Let the body of Christ intercede with you.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Input
              label="Title"
              placeholder="Please pray for healing..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <div className="mt-1 flex justify-between text-[10px]">
              {errors.title && <span className="text-red-500 font-bold uppercase tracking-tight">{errors.title}</span>}
              <span className="ml-auto text-gray-600">{truncateRight(title, 100).length}/100</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Description"
              placeholder="Details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minLength={10}
              maxLength={2000}
            />
            <div className="mt-1 flex justify-between text-[10px]">
              {errors.description && <span className="text-red-500 font-bold uppercase tracking-tight">{errors.description}</span>}
              <span className="ml-auto text-gray-600">{truncateRight(content, 2000).length}/2000</span>
            </div>
          </div>

          {/* Category */}
          <div>
              <Select
                label="Category"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            {errors.category && <p className="mt-1 ml-1 text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.category}</p>}
          </div>

          {/* Privacy */}
          <div className="space-y-2">
            <p className="ml-1 text-xs font-bold uppercase tracking-widest text-gray-400">Privacy</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={!isAnonymous}
                onChange={() => setIsAnonymous(false)}
                className="accent-[#C8A24A] h-4 w-4"
              />
              <span className="text-sm text-gray-300">Public — everyone can see (name optional)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                checked={isAnonymous}
                onChange={() => setIsAnonymous(true)}
                className="accent-[#C8A24A] h-4 w-4"
              />
              <span className="text-sm text-gray-300">Anonymous — request visible, name hidden</span>
            </label>
          </div>

          {/* Your name */}
          {!isAnonymous && (
            <div>
              <Input
                label="Your name (optional)"
                placeholder={userName || 'Your name'}
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
              />
            </div>
          )}

          {/* Duration */}
          <div>
            <Select
              label="Request Duration"
              options={DURATION_OPTIONS}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            {errors.duration && <p className="mt-1 ml-1 text-[10px] font-bold uppercase tracking-tight text-red-500">{errors.duration}</p>}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting || isFormBlank}
              className="w-full py-3 text-base"
            >
              {submitting ? 'Submitting…' : 'Submit Prayer Request'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
